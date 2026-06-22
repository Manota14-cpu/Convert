import { $ } from '../dom.js';
import { state, showProgress, setProgress, updateFileStatus, updateBtn, renderFiles, hideProgress } from '../state.js';
import { t } from '../i18n.js';
import { showToast } from '../toast.js';
import { baseName, sleep, imageToFormat, downloadBlob } from '../helpers.js';

const MAX_WARN_BYTES = 100 * 1024 * 1024;

export function processFiles(files, panel) {
  const filtered = files.filter(f => {
    if (panel === 'word2pdf') return f.name.endsWith('.docx');
    if (panel === 'pdf2img') return f.type === 'application/pdf' || f.name.endsWith('.pdf');
    if (panel === 'vid2gif') return f.type.startsWith('video/');
    return f.type.startsWith('image/');
  });
  if (!filtered.length) { showToast(t('toastBadFmt'), 'error'); return; }

  filtered.forEach(f => {
    if (f.size > MAX_WARN_BYTES) showToast(t('toastFileTooLarge', f.name), 'warn');
  });

  if (panel === 'vid2gif') {
    import('./video-gif.js').then(m => m.handleVideoFile(filtered[0]));
  } else {
    filtered.forEach(f => {
      if (!state[panel].files.find(x => x.name === f.name && x.size === f.size))
        state[panel].files.push({ file: f, name: f.name, size: f.size, status: 'pending' });
    });
  }
  renderFiles(panel);
  updateBtn(panel);
}

export async function convertImages() {
  const files = state.img.files;
  const fmt = state.img.fmt;
  const ext = fmt === 'jpeg' ? 'jpg' : fmt;
  showProgress('img', t('statusConverting'));
  const btn = $('btn-img');
  if (btn) btn.disabled = true;
  for (let i = 0; i < files.length; i++) {
    updateFileStatus('img', i, 'converting');
    setProgress('img', (i / files.length) * 100);
    try {
      const blob = await imageToFormat(files[i].file, fmt);
      const outName = baseName(files[i].name) + '.' + ext;
      downloadBlob(blob, outName);
      updateFileStatus('img', i, 'done', null, blob, outName);
    } catch(e) { updateFileStatus('img', i, 'error', e.message); }
    await sleep(100);
  }
  setProgress('img', 100);
  if (btn) btn.disabled = false;
  showToast(t('toastImgDone', files.length));
}
