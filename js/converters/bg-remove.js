import { $ } from '../dom.js';
import { state, showProgress, setProgress, updateFileStatus, updateBtn } from '../state.js';
import { t } from '../i18n.js';
import { showToast } from '../toast.js';
import { baseName, sleep, downloadBlob, _triggerDownload } from '../helpers.js';

let bgWorker = null;

function getBgWorker() {
  if (!bgWorker) {
    bgWorker = new Worker('./js/bg-worker.js');
  }
  return bgWorker;
}

export async function removeBackgrounds() {
  const files = state.bgremove.files;
  const tolerance = parseInt($('bg-tolerance')?.value || '30');
  const previews = $('bg-previews');
  if (previews) previews.innerHTML = '';
  showProgress('bgremove', t('statusConverting'));
  const btn = $('btn-bgremove');
  if (btn) btn.disabled = true;
  for (let i = 0; i < files.length; i++) {
    updateFileStatus('bgremove', i, 'converting');
    setProgress('bgremove', (i / files.length) * 100);
    try {
      const canvas = await removeBg(files[i].file, tolerance);
      const name = baseName(files[i].name);
      const wrap = document.createElement('div');
      wrap.className = 'bg-preview-item';
      wrap.style.animationDelay = i * 0.08 + 's';
      const label = document.createElement('div');
      label.className = 'preview-label';
      label.textContent = files[i].name;
      const dlBtn = document.createElement('button');
      dlBtn.className = 'preview-dl';
      dlBtn.textContent = 'DL';
      dlBtn.onclick = () => canvas.toBlob(b => { if (b) _triggerDownload(b, name + '_nobg.png'); }, 'image/png');
      wrap.appendChild(canvas); wrap.appendChild(label); wrap.appendChild(dlBtn);
      if (previews) previews.appendChild(wrap);
      canvas.toBlob(blob => { if (blob) downloadBlob(blob, name + '_nobg.png'); }, 'image/png');
      updateFileStatus('bgremove', i, 'done');
    } catch (e) {
      updateFileStatus('bgremove', i, 'error', e.message);
    }
    await sleep(80);
  }
  setProgress('bgremove', 100);
  if (btn) btn.disabled = false;
  showToast(t('toastBgDone'));
}

function removeBg(file, tolerance) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imgData.data;
      const w = c.width, h = c.height;

      let sumR = 0, sumG = 0, sumB = 0, count = 0;
      for (let x = 0; x < w; x++) {
        const ti = (0 * w + x) * 4, bi = ((h - 1) * w + x) * 4;
        sumR += data[ti] + data[bi]; sumG += data[ti + 1] + data[bi + 1]; sumB += data[ti + 2] + data[bi + 2]; count += 2;
      }
      for (let y = 1; y < h - 1; y++) {
        const li = (y * w + 0) * 4, ri = (y * w + (w - 1)) * 4;
        sumR += data[li] + data[ri]; sumG += data[li + 1] + data[ri + 1]; sumB += data[li + 2] + data[ri + 2]; count += 2;
      }
      const bgR = Math.round(sumR / count);
      const bgG = Math.round(sumG / count);
      const bgB = Math.round(sumB / count);

      const worker = getBgWorker();
      worker.onmessage = function(e) {
        const outData = new Uint8ClampedArray(e.data.outputData);
        imgData.data.set(outData);
        ctx.putImageData(imgData, 0, 0);
        resolve(c);
      };
      worker.onerror = function() { reject(new Error('Worker error')); };
      worker.postMessage({ imageData: data.buffer, width: w, height: h, tolerance, bgR, bgG, bgB }, [data.buffer]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(t('errorImageLoad') || 'Failed to load image')); };
    img.src = url;
  });
}
