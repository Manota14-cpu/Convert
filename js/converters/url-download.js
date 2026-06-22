import { $ } from '../dom.js';
import { showToast } from '../toast.js';
import { formatBytes } from '../helpers.js';

let currentUrlData = null;
let urlHistory = JSON.parse(localStorage.getItem('convrt_url_history') || '[]');

const IMAGE_EXTS = ['jpg','jpeg','png','gif','webp','bmp','svg','avif','tiff','ico'];
const VIDEO_EXTS = ['mp4','webm','mov','avi','mkv','m4v','ogv','flv'];

function detectType(url) {
  const clean = url.split('?')[0].toLowerCase();
  const ext = clean.split('.').pop();
  if (IMAGE_EXTS.includes(ext)) return { type: 'image', ext };
  if (VIDEO_EXTS.includes(ext)) return { type: 'video', ext };
  if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)/i)) return { type: 'image', ext: 'jpg' };
  if (url.match(/\.(mp4|webm|mov|avi|mkv|m4v)/i)) return { type: 'video', ext: 'mp4' };
  return { type: 'unknown', ext: '' };
}

function getFilenameFromUrl(url) {
  try {
    const parts = new URL(url).pathname.split('/');
    return parts[parts.length - 1] || 'descarga';
  } catch { return 'descarga'; }
}

export function urlInputChanged() {
  $('url-preview-box')?.classList.remove('visible');
  $('url-cors-notice')?.classList.remove('visible');
  const dl = $('url-dl-status');
  if (dl) dl.textContent = '';
  currentUrlData = null;
}

export async function fetchUrl() {
  const input = $('url-input');
  if (!input) return;
  const url = input.value.trim();
  if (!url) return;

  const fetchBtn = $('url-fetch-btn');
  const previewBox = $('url-preview-box');
  const corsNotice = $('url-cors-notice');
  const metaEl = $('url-meta');
  const mediaWrap = $('url-media-wrap');
  const dlStatus = $('url-dl-status');

  if (currentUrlData && currentUrlData.objectUrl) {
    URL.revokeObjectURL(currentUrlData.objectUrl);
  }

  if (previewBox) previewBox.classList.remove('visible');
  if (corsNotice) corsNotice.classList.remove('visible');
  if (mediaWrap) mediaWrap.innerHTML = '';
  if (metaEl) metaEl.innerHTML = '';
  if (dlStatus) dlStatus.textContent = '';
  currentUrlData = null;

  if (fetchBtn) { fetchBtn.disabled = true; fetchBtn.textContent = 'Cargando...'; }

  const { type, ext } = detectType(url);
  const filename = getFilenameFromUrl(url);

  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const detectedType = blob.type || '';
    const isImage = detectedType.startsWith('image/') || type === 'image';
    const isVideo = detectedType.startsWith('video/') || type === 'video';
    const finalType = isImage ? 'image' : isVideo ? 'video' : type;

    currentUrlData = { blob, objectUrl, filename, type: finalType, size: blob.size, mime: detectedType };

    if (metaEl) {
      metaEl.innerHTML = `
        <div class="url-meta-row"><span class="url-meta-label">Tipo</span>
          <span class="url-type-badge ${finalType}">${finalType === 'image' ? '🖼 Imagen' : finalType === 'video' ? '🎬 Video' : '❓ Desconocido'}</span></div>
        <div class="url-meta-row"><span class="url-meta-label">Tamaño</span>
          <span class="url-meta-value">${formatBytes(blob.size)}</span></div>
        <div class="url-meta-row"><span class="url-meta-label">Formato</span>
          <span class="url-meta-value">${detectedType || ext || '—'}</span></div>
        <div class="url-meta-row"><span class="url-meta-label">Archivo</span>
          <span class="url-meta-value">${filename}</span></div>
      `;
    }

    if (mediaWrap) {
      if (isImage) {
        const img = document.createElement('img');
        img.src = objectUrl; img.className = 'url-preview-media'; img.alt = filename;
        mediaWrap.appendChild(img);
      } else if (isVideo) {
        const video = document.createElement('video');
        video.src = objectUrl; video.className = 'url-preview-media'; video.controls = true;
        mediaWrap.appendChild(video);
      }
    }

    if (previewBox) previewBox.classList.add('visible');
    addToHistory(url, finalType);

  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      if (corsNotice) corsNotice.classList.add('visible');
      const { type: t } = detectType(url);
      if (t === 'image' && mediaWrap && metaEl && previewBox) {
        const img = document.createElement('img');
        img.src = url; img.className = 'url-preview-media'; img.alt = filename;
        img.onload = () => {
          metaEl.innerHTML = `
            <div class="url-meta-row"><span class="url-meta-label">Tipo</span><span class="url-type-badge image">🖼 Imagen</span></div>
            <div class="url-meta-row"><span class="url-meta-label">Archivo</span><span class="url-meta-value">${filename}</span></div>
            <div class="url-meta-row" style="color:var(--warn)"><span class="url-meta-label">Nota</span><span>Solo preview — descarga bloqueada por CORS</span></div>
          `;
          mediaWrap.appendChild(img);
          previewBox.classList.add('visible');
          currentUrlData = { url, filename, type: 'image', corsBlocked: true };
        };
        img.onerror = () => { showToast('No se pudo cargar el recurso', 'error'); };
      } else {
        showToast('No se pudo acceder al recurso (CORS)', 'error');
      }
    } else {
      showToast(`Error: ${err.message}`, 'error');
    }
  }

  if (fetchBtn) { fetchBtn.disabled = false; fetchBtn.textContent = 'Cargar →'; }
}

export async function downloadFromUrl() {
  if (!currentUrlData) return;
  const dlBtn = $('url-dl-btn');
  const dlStatus = $('url-dl-status');

  if (currentUrlData.corsBlocked) {
    const a = document.createElement('a');
    a.href = currentUrlData.url; a.download = currentUrlData.filename;
    a.target = '_blank'; a.rel = 'noopener'; a.click();
    if (dlStatus) dlStatus.textContent = 'Abierto en nueva pestaña';
    return;
  }

  if (dlBtn) { dlBtn.textContent = 'Descargando...'; dlBtn.style.opacity = '0.6'; }

  try {
    const a = document.createElement('a');
    a.href = currentUrlData.objectUrl; a.download = currentUrlData.filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    if (dlStatus) {
      dlStatus.textContent = `✓ ${formatBytes(currentUrlData.size)} descargados`;
      dlStatus.style.color = 'var(--ok)';
    }
    showToast(`Descargado: ${currentUrlData.filename}`);
  } catch (err) {
    showToast('Error al descargar', 'error');
    if (dlStatus) { dlStatus.textContent = 'Error al descargar'; dlStatus.style.color = 'var(--hot)'; }
  }

  if (dlBtn) { dlBtn.textContent = '↓ Descargar'; dlBtn.style.opacity = '1'; }
}

function addToHistory(url, type) {
  urlHistory = urlHistory.filter(h => h.url !== url);
  urlHistory.unshift({ url, type, ts: Date.now() });
  if (urlHistory.length > 8) urlHistory = urlHistory.slice(0, 8);
  try { localStorage.setItem('convrt_url_history', JSON.stringify(urlHistory)); } catch {}
  renderHistory();
}

export function clearUrlHistory() {
  urlHistory = [];
  if (currentUrlData && currentUrlData.objectUrl) {
    URL.revokeObjectURL(currentUrlData.objectUrl);
    currentUrlData = null;
  }
  try { localStorage.removeItem('convrt_url_history'); } catch {}
  renderHistory();
}

export function renderHistory() {
  const wrap = $('url-history');
  const list = $('url-history-list');
  if (!urlHistory.length) { if (wrap) wrap.style.display = 'none'; return; }
  if (wrap) wrap.style.display = 'flex';
  if (list) {
    list.innerHTML = urlHistory.map(h => `
      <div class="url-history-item" data-url="${h.url.replace(/"/g,'&quot;')}">
        <span class="hist-type">${h.type === 'image' ? '🖼' : h.type === 'video' ? '🎬' : '🔗'}</span>
        <span class="hist-url">${h.url}</span>
      </div>
    `).join('');
  }
}

export function initUrlHistory() {
  const list = $('url-history-list');
  if (list) {
    list.addEventListener('click', e => {
      const item = e.target.closest('.url-history-item');
      if (item) {
        const url = item.getAttribute('data-url');
        const input = $('url-input');
        if (input && url) { input.value = url; fetchUrl(); }
      }
    });
  }
}
