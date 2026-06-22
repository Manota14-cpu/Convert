import { $ } from '../dom.js';
import { state, showProgress, setProgress, updateFileStatus, updateBtn } from '../state.js';
import { t } from '../i18n.js';

import { showToast } from '../toast.js';
import { baseName, sleep, getPdfScale, loadScript } from '../helpers.js';

const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

let pdfjsLoaded = false;

async function ensurePdfJs() {
  if (typeof pdfjsLib !== 'undefined') { pdfjsLoaded = true; return; }
  if (pdfjsLoaded) return;
  await loadScript(PDFJS_URL);
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  pdfjsLoaded = true;
}

export async function convertPdfToImg() {
  try {
    await ensurePdfJs();
  } catch (e) {
    showToast(t('errorPdfJs'), 'error');
    return;
  }
  const files = state.pdf2img.files;
  const fmt = state.pdf2img.fmt;
  const ext = fmt === 'jpeg' ? 'jpg' : fmt;
  const scale = getPdfScale();
  showProgress('pdf2img', t('statusConverting'));
  const btn = $('btn-pdf2img');
  if (btn) btn.disabled = true;
  for (let i = 0; i < files.length; i++) {
    updateFileStatus('pdf2img', i, 'converting');
    setProgress('pdf2img', (i / files.length) * 100);
    try {
      const buf = await files[i].file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const name = baseName(files[i].name);
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const vp = page.getViewport({ scale });
        const c = document.createElement('canvas');
        c.width = vp.width; c.height = vp.height;
        const ctx = c.getContext('2d');
        if (fmt === 'jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0,0,c.width,c.height); }
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        const blob = await new Promise(res => c.toBlob(res, 'image/' + fmt, parseInt(document.getElementById('cfg-quality')?.value || '92') / 100));
        const sfx = pdf.numPages > 1 ? `_p${p}` : '';
        import('../helpers.js').then(m => m.downloadBlob(blob, `${name}${sfx}.${ext}`));
        await sleep(60);
      }
      updateFileStatus('pdf2img', i, 'done');
    } catch(e) { updateFileStatus('pdf2img', i, 'error', e.message); }
    await sleep(120);
  }
  setProgress('pdf2img', 100);
  if (btn) btn.disabled = false;
  showToast(t('toastPdfDone'));
}
