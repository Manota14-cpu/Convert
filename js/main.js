import { $, $$, $$$, clearDomCache } from './dom.js';
import { t, setLang, setText, setHtml, currentLang, LANG } from './i18n.js';
import { state, gifBlob, setGifBlob, getPanelFiles, getPanelFmt, setPanelFmt,
         renderFiles, revokeThumbUrls, removeFile, clearFiles, clearVid,
         updateFileStatus, updateBtn, showProgress, setProgress, hideProgress } from './state.js';
import { showToast } from './toast.js';
import { initSwUpdate } from './sw-update.js';
import { initInstallPrompt } from './install-prompt.js';
import { initNetworkIndicator } from './network-indicator.js';
import { enterApp, goLanding, switchAppPage, switchPanel, selectFmt,
         initSidebar, initSidebarKeyboard, initViewToggle } from './dock.js';
import { initCarousel, destroyCarousel } from './carousel.js';
import { baseName, sleep, getQuality, getPdfScale, downloadBlob, _triggerDownload,
         imageToFormat, loadScript, formatBytes } from './helpers.js';
import { saveSettings, loadSettings as loadStoredSettings, syncGifFps } from './settings.js';
import { buildFaq, toggleFaq } from './faq.js';
import { convertImages, processFiles } from './converters/image.js';
import { convertPdfToImg } from './converters/pdf.js';
import { convertWordToPdf } from './converters/word.js';
import { handleVideoFile, convertVideoToGif, downloadGif, updateGifEstimate } from './converters/video-gif.js';
import { removeBackgrounds } from './converters/bg-remove.js';
import { urlInputChanged, fetchUrl, downloadFromUrl, clearUrlHistory, renderHistory, initUrlHistory } from './converters/url-download.js';

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (val !== undefined && val !== key) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    const val = t(key);
    if (val !== undefined && val !== key) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const val = t(key);
    if (val !== undefined && val !== key) el.placeholder = val;
  });
  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    const key = el.dataset.i18nValue;
    const val = t(key);
    if (val !== undefined && val !== key) el.value = val;
  });
}

function handleFiles(fileList, tool) {
  const arr = Array.from(fileList).slice(0, 20);
  if (tool === 'vid2gif' && arr.length) {
    handleVideoFile(arr[0].file);
    return;
  }
  for (const f of arr) {
    state[tool].files.push({ file: f, name: f.name, size: f.size, status: 'pending' });
    if (f.size > 100 * 1024 * 1024) showToast(t('toastFileTooLarge', f.name), 'warn');
  }
  renderFiles(tool);
  updateBtn(tool);
}

document.addEventListener('click', e => {
  const target = e.target;

  if (target.closest('.btn-enter')) { enterApp(); return; }

  const navBtn = target.closest('.top-nav-btn[data-page]');
  if (navBtn) { switchAppPage(navBtn.dataset.page, navBtn); return; }

  const fmtOpt = target.closest('.fmt-opt[data-tool][data-fmt]');
  if (fmtOpt) { selectFmt(fmtOpt.dataset.tool, fmtOpt.dataset.fmt, fmtOpt); return; }

  const convertBtn = target.closest('.btn-convert[data-tool]');
  if (convertBtn && !convertBtn.disabled) {
    const t = convertBtn.dataset.tool;
    if (t === 'img') convertImages();
    else if (t === 'pdf2img') convertPdfToImg();
    else if (t === 'word2pdf') convertWordToPdf();
    else if (t === 'vid2gif') convertVideoToGif();
    else if (t === 'bgremove') removeBackgrounds();
    return;
  }

  const clearBtn = target.closest('.btn-clear[data-tool]');
  if (clearBtn) {
    const t = clearBtn.dataset.tool;
    if (t === 'vid2gif') clearVid();
    else { clearFiles(t); if (t === 'bgremove') { const p = $('bg-previews'); if (p) p.innerHTML = ''; } }
    return;
  }

  const fileRemove = target.closest('.file-remove[data-remove-panel]');
  if (fileRemove) {
    const panel = fileRemove.dataset.removePanel;
    const idx = parseInt(fileRemove.dataset.removeIdx);
    removeFile(panel, idx);
    return;
  }

  const fileDl = target.closest('.file-dl-btn[data-dl-panel]');
  if (fileDl) {
    const panel = fileDl.dataset.dlPanel;
    const idx = parseInt(fileDl.dataset.dlIdx);
    const f = state[panel]?.files[idx];
    if (f?.blob) _triggerDownload(f.blob, f.outName || f.name);
    return;
  }

  if (target.closest('#btn-dl-gif')) { downloadGif(); return; }
  if (target.closest('#url-fetch-btn')) { fetchUrl(); return; }
  if (target.closest('#url-dl-btn')) { downloadFromUrl(); return; }
  if (target.closest('.url-clear-btn')) { clearUrlHistory(); return; }

  const dropZone = target.closest('.drop-zone[data-tool]');
  if (dropZone) {
    const input = dropZone.querySelector('input[type="file"]');
    if (input) input.click();
    return;
  }

  const faqQ = target.closest('.faq-question');
  if (faqQ) { toggleFaq(faqQ); return; }
});

document.addEventListener('change', e => {
  const fileInput = e.target.closest('input[type="file"][data-tool]');
  if (fileInput && fileInput.files.length) {
    handleFiles(fileInput.files, fileInput.dataset.tool);
    fileInput.value = '';
    return;
  }

  const settingsInput = e.target.closest('#page-settings select, #page-settings input');
  if (settingsInput) {
    saveSettings();
    if (e.target.id === 'cfg-lang') setLang(e.target.value);
    applyLang();
    return;
  }
});

document.addEventListener('input', e => {
  const target = e.target;

  if (target.matches('#gif-start, #gif-duration, #gif-fps, #gif-width')) {
    updateGifEstimate();
    return;
  }

  if (target.id === 'bg-tolerance') {
    const val = $('tol-val');
    if (val) val.textContent = target.value;
    return;
  }

  if (target.id === 'cfg-quality') {
    const val = $('cfg-quality-val');
    if (val) val.textContent = target.value + '%';
    saveSettings();
    return;
  }

  if (target.id === 'url-input') {
    urlInputChanged();
    return;
  }
});

document.addEventListener('keydown', e => {
  if (e.target.id === 'url-input' && e.key === 'Enter') {
    fetchUrl();
  }
});

document.addEventListener('dragover', e => {
  const zone = e.target.closest('.drop-zone[data-tool]');
  if (zone) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; zone.classList.add('dragover'); }
});

document.addEventListener('dragleave', e => {
  const zone = e.target.closest('.drop-zone[data-tool]');
  if (zone) { zone.classList.remove('dragover'); }
});

document.addEventListener('drop', e => {
  const zone = e.target.closest('.drop-zone[data-tool]');
  if (zone) {
    e.preventDefault(); zone.classList.remove('dragover');
    const tool = zone.dataset.tool;
    const files = e.dataTransfer.files;
    if (files.length && tool) handleFiles(files, tool);
  }
});

document.addEventListener('langchange', applyLang);

document.addEventListener('DOMContentLoaded', () => {
  const saved = loadStoredSettings();
  if (saved?.lang && saved.lang !== currentLang) setLang(saved.lang);
  // Sync language select to current lang
  const langSel = document.getElementById('cfg-lang');
  if (langSel) langSel.value = currentLang;
  syncGifFps();
  buildFaq();
  initCarousel();
  initSidebar();
  initSidebarKeyboard();
  initViewToggle();
  initUrlHistory();
  renderHistory();
  initSwUpdate();
  initInstallPrompt();
  initNetworkIndicator();
  applyLang();
  clearDomCache();
});
