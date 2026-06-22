import { $ } from '../dom.js';
import { state, showProgress, setProgress, updateFileStatus, updateBtn } from '../state.js';
import { t } from '../i18n.js';
import { showToast } from '../toast.js';
import { baseName, sleep, loadScript } from '../helpers.js';

const MAMMOTH_URL = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';

let mammothLoaded = false;

async function ensureMammoth() {
  if (typeof mammoth !== 'undefined') { mammothLoaded = true; return; }
  if (mammothLoaded) return;
  await loadScript(MAMMOTH_URL);
  mammothLoaded = true;
}

export async function convertWordToPdf() {
  try {
    await ensureMammoth();
  } catch (e) {
    showToast(t('errorMammoth'), 'error');
    return;
  }
  const files = state.word2pdf.files;
  showProgress('word2pdf', t('statusConverting'));
  const btn = $('btn-word2pdf');
  if (btn) btn.disabled = true;
  for (let i = 0; i < files.length; i++) {
    updateFileStatus('word2pdf', i, 'converting');
    setProgress('word2pdf', 80);
    const win = window.open('', '_blank');
    try {
      const buf = await files[i].file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: buf });
      const name = baseName(files[i].name);
      if (!win || win.closed) {
        showToast(t('errorPopupBlocked'), 'error');
        updateFileStatus('word2pdf', i, 'error', 'Popup blocked');
      } else {
        win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${name}</title>
          <style>
            body{font-family:Georgia,'Times New Roman',serif;font-size:11.5pt;line-height:1.7;margin:2.2cm 2.5cm;color:#111;max-width:100%}
            h1,h2,h3,h4{font-family:Arial,Helvetica,sans-serif;font-weight:700;page-break-after:avoid;margin-top:1.2em;margin-bottom:0.4em;line-height:1.25}
            h1{font-size:1.6em}h2{font-size:1.3em}h3{font-size:1.1em}
            p{margin:0 0 0.7em 0;text-align:justify}
            a{color:#2255cc;text-decoration:underline}
            img{max-width:100%;height:auto;margin:0.8em 0}
            table{border-collapse:collapse;width:100%;margin:0.8em 0;font-size:10.5pt}
            td,th{border:1px solid #999;padding:5px 8px;text-align:left;vertical-align:top}
            th{background:#eee;font-weight:700}
            ul,ol{margin:0.4em 0 0.8em 0;padding-left:2em}
            li{margin-bottom:0.15em}
            strong,b{font-weight:700}em,i{font-style:italic}
            blockquote{margin:0.6em 1.5em;padding:0 1em;border-left:3px solid #ccc;color:#555}
            pre,code{font-family:Consolas,'Courier New',monospace;font-size:10pt;background:#f5f5f5;padding:0.1em 0.3em}
            pre{padding:0.7em 1em;overflow-x:auto}
            hr{border:none;border-top:1px solid #ccc;margin:1.2em 0}
            @media print{body{margin:0;font-size:11pt}@page{margin:2cm}}
          </style>
          </head><body>${result.value}</body></html>`);
        win.document.close();
        setTimeout(() => { try { win.print(); } catch(pe) { win.close(); } }, 600);
        updateFileStatus('word2pdf', i, 'done');
      }
    } catch(e) {
      if (win && !win.closed) win.close();
      updateFileStatus('word2pdf', i, 'error', e.message);
    }
    await sleep(200);
  }
  setProgress('word2pdf', 100);
  if (btn) btn.disabled = false;
  showToast(t('toastWordDone'), 'warn');
}
