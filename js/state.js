import { $ } from './dom.js';
import { t } from './i18n.js';
import { iconSvg } from './dock.js';

export const state = {
  img:      { files: [], fmt: 'png' },
  pdf2img:  { files: [], fmt: 'png' },
  word2pdf: { files: [] },
  vid2gif:  { files: [] },
  bgremove: { files: [] }
};

export let gifBlob = null;
export function setGifBlob(v) { gifBlob = v; }

export function getPanelFiles(panel) { return state[panel].files; }
export function getPanelFmt(panel) { return state[panel].fmt; }
export function setPanelFmt(panel, fmt) { state[panel].fmt = fmt; }

const statusIcons = {
  pending:    '○',
  converting: '···',
  done:       '✓',
  error:      '✗'
};

const toolColorKeys = {
  img: 'hot', pdf2img: 'cold', word2pdf: 'ok',
  vid2gif: 'warn', bgremove: 'purple', urldown: 'pink'
};

export function renderFiles(panel) {
  const grid = $('files-' + panel);
  const list = $('files-list-' + panel);
  const countEl = $('count-' + panel);
  const files = state[panel].files;
  if (countEl) countEl.textContent = t('fileCount', files.length);

  // Render grid (primary)
  if (grid) {
    const colorKey = toolColorKeys[panel] || 'hot';
    grid.innerHTML = files.map((f, i) => {
      const size = f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+' MB' : (f.size/1024).toFixed(0)+' KB';
      const autoDlEl = document.getElementById('cfg-autoDl');
      const showDlBtn = f.status === 'done' && f.blob && autoDlEl && !autoDlEl.checked;
      const statusEl = f.status === 'done' ? `<span class="file-grid-status done">${statusIcons.done}</span>`
        : f.status === 'error' ? `<span class="file-grid-status error">${statusIcons.error}</span>`
        : f.status === 'converting' ? `<span class="file-grid-status converting">${statusIcons.converting}</span>`
        : '';
      return `<div class="file-grid-cell" id="fi-${panel}-${i}" title="${f.name}">
        <div class="file-grid-icon">${iconSvg(panel, colorKey, 64)}</div>
        ${statusEl}
        <div class="file-grid-info">
          <span class="file-grid-name">${f.name}</span>
          <span class="file-grid-size">${size}</span>
        </div>
        ${showDlBtn ? `<button class="file-dl-btn" data-dl-panel="${panel}" data-dl-idx="${i}" aria-label="Descargar" style="position:absolute;bottom:0.25rem;right:0.25rem;">↓</button>` : ''}
        <button class="file-remove" data-remove-panel="${panel}" data-remove-idx="${i}" aria-label="Eliminar archivo" style="position:absolute;top:0.25rem;left:0.25rem;background:rgba(0,0,0,0.5);color:#fff;border-radius:50%;width:18px;height:18px;font-size:0.6rem;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.15s;">×</button>
      </div>`;
    }).join('');
  }

  // Keep list view in sync for remove/dl button event handling
  if (list) {
    list.innerHTML = files.map((f, i) => {
      const size = f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+' MB' : (f.size/1024).toFixed(0)+' KB';
      const autoDlEl = document.getElementById('cfg-autoDl');
      const showDlBtn = f.status === 'done' && f.blob && autoDlEl && !autoDlEl.checked;
      return `<div class="file-item file-item--${f.status}" id="fl-${panel}-${i}" style="display:none;">
        <span class="file-status-icon">${statusIcons[f.status]}</span>
        <span class="file-name">${f.name}</span>
        <span class="file-size">${size}</span>
        ${showDlBtn ? `<button class="file-dl-btn" data-dl-panel="${panel}" data-dl-idx="${i}" aria-label="Descargar">↓</button>` : ''}
        <button class="file-remove" data-remove-panel="${panel}" data-remove-idx="${i}" aria-label="Eliminar archivo">×</button>
      </div>`;
    }).join('');
  }

}

export function revokeThumbUrls(panel) {
  if (state[panel]) state[panel].files.forEach(f => { if (f._thumbUrl) { URL.revokeObjectURL(f._thumbUrl); f._thumbUrl = null; } });
}

export function removeFile(panel, idx) {
  const item = document.getElementById(`fi-${panel}-${idx}`);
  const f = state[panel].files[idx];
  if (f && f._thumbUrl) { URL.revokeObjectURL(f._thumbUrl); f._thumbUrl = null; }
  if (item) {
    item.style.transition = 'opacity 0.2s, transform 0.2s';
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    setTimeout(() => { state[panel].files.splice(idx, 1); renderFiles(panel); updateBtn(panel); }, 200);
  } else {
    state[panel].files.splice(idx, 1); renderFiles(panel); updateBtn(panel);
  }
}

export function clearFiles(panel) { revokeThumbUrls(panel); state[panel].files = []; renderFiles(panel); updateBtn(panel); hideProgress(panel); }

export function clearVid() {
  clearFiles('vid2gif');
  const pw = $('vid-preview-wrap'); if (pw) pw.style.display = 'none';
  const gr = $('gif-result'); if (gr) gr.style.display = 'none';
  const vp = $('vid-preview'); if (vp) { URL.revokeObjectURL(vp.src); vp.src = ''; }
  const go = $('gif-output'); if (go) { URL.revokeObjectURL(go.src); go.src = ''; }
  const ge = $('gif-size-estimate'); if (ge) ge.textContent = '';
  setGifBlob(null);
}

export function updateFileStatus(panel, idx, status, errorMsg, blob, outName) {
  if (state[panel].files[idx]) {
    state[panel].files[idx].status = status;
    if (errorMsg) state[panel].files[idx].errorMsg = errorMsg;
    if (blob) state[panel].files[idx].blob = blob;
    if (outName) state[panel].files[idx].outName = outName;
  }
  renderFiles(panel);
}

export function updateBtn(panel) {
  const btn = $('btn-' + panel);
  if (btn) btn.disabled = state[panel].files.length === 0;
}

export function showProgress(panel, label) {
  const wrap = $('progress-' + panel);
  if (wrap) wrap.classList.add('visible');
  const lbl = $('progress-' + panel + '-lbl');
  if (lbl) lbl.textContent = label;
  setProgress(panel, 0);
}

export function setProgress(panel, pct) {
  const fill = $('progress-' + panel + '-fill');
  if (fill) {
    fill.style.width = pct + '%';
    fill.classList.toggle('complete', pct >= 100);
  }
  const pctEl = $('progress-' + panel + '-pct');
  if (pctEl) pctEl.textContent = Math.round(pct) + '%';
}

export function hideProgress(panel) {
  const wrap = $('progress-' + panel);
  if (wrap) wrap.classList.remove('visible');
}
