import { $ } from '../dom.js';
import { state, gifBlob, setGifBlob, showProgress, setProgress, updateFileStatus, updateBtn, renderFiles } from '../state.js';
import { t } from '../i18n.js';
import { showToast } from '../toast.js';
import { baseName, sleep, _triggerDownload } from '../helpers.js';

let gifWorker = null;

function getWorker() {
  if (!gifWorker) {
    gifWorker = new Worker('./js/gif-worker.js');
  }
  return gifWorker;
}

export function handleVideoFile(file) {
  state.vid2gif.files = [{ file, name: file.name, size: file.size, status: 'pending' }];
  const vid = $('vid-preview');
  if (vid) {
    URL.revokeObjectURL(vid.src);
    vid.src = URL.createObjectURL(file);
    vid.onloadedmetadata = updateGifEstimate;
  }
  const pw = $('vid-preview-wrap'); if (pw) pw.style.display = 'block';
  const gr = $('gif-result'); if (gr) gr.style.display = 'none';
  setGifBlob(null);
  renderFiles('vid2gif');
  updateBtn('vid2gif');
}

export async function convertVideoToGif() {
  const files = state.vid2gif.files;
  if (!files.length) return;
  const vid = $('vid-preview');
  if (!vid) return;
  const start    = parseFloat($('gif-start')?.value || '0');
  const duration = Math.min(parseFloat($('gif-duration')?.value || '3'), 15);
  const fps      = parseInt($('gif-fps')?.value || '10');
  const width    = parseInt($('gif-width')?.value || '480');
  const frameCount   = Math.ceil(duration * fps);
  const frameInterval = 1 / fps;

  showProgress('vid2gif', t('statusConverting'));
  const btn = $('btn-vid2gif');
  if (btn) btn.disabled = true;
  const gr = $('gif-result'); if (gr) gr.style.display = 'none';
  updateFileStatus('vid2gif', 0, 'converting');

  const frames = [];
  const c = document.createElement('canvas');
  const ratio = vid.videoHeight / vid.videoWidth;
  c.width = width; c.height = Math.round(width * ratio);
  const ctx = c.getContext('2d');

  for (let i = 0; i < frameCount; i++) {
    await seekVideo(vid, start + i * frameInterval);
    ctx.drawImage(vid, 0, 0, c.width, c.height);
    frames.push(ctx.getImageData(0, 0, c.width, c.height));
    setProgress('vid2gif', (i / frameCount) * 60);
    await sleep(10);
  }

  setProgress('vid2gif', 65);
  const palette = buildAdaptivePalette(frames);
  const delay = Math.round(100 / fps);

  setProgress('vid2gif', 70);

  try {
    const worker = getWorker();
    const gifData = await encodeGifInWorker(frames, c.width, c.height, delay, palette);
    setGifBlob(new Blob([gifData], { type: 'image/gif' }));
    const url = URL.createObjectURL(gifBlob);
    const gifOut = $('gif-output');
    if (gifOut) { URL.revokeObjectURL(gifOut.src); gifOut.src = url; }
    if (gr) gr.style.display = 'block';
    setProgress('vid2gif', 100);
    updateFileStatus('vid2gif', 0, 'done');
    showToast(t('toastGifDone'));
  } catch (e) {
    updateFileStatus('vid2gif', 0, 'error', e.message);
    showToast(t('errorGifGen', e.message), 'error');
  }

  if (btn) btn.disabled = false;
}

function encodeGifInWorker(frames, width, height, delay, palette) {
  return new Promise((resolve, reject) => {
    const worker = getWorker();
    const transferable = frames.map(f => f.data.buffer);

    worker.onmessage = function(e) {
      if (e.data.error) { reject(new Error(e.data.error)); return; }
      resolve(new Uint8Array(e.data.gifData));
    };
    worker.onerror = reject;

    worker.postMessage({ frames, width, height, delay, palette }, transferable);
  });
}

function seekVideo(vid, time) {
  return new Promise(res => {
    vid.currentTime = time;
    vid.onseeked = () => { vid.onseeked = null; res(); };
  });
}

export function downloadGif() {
  if (!gifBlob) return;
  const name = state.vid2gif.files[0]?.name || 'video';
  _triggerDownload(gifBlob, baseName(name) + '.gif');
}

export function updateGifEstimate() {
  const vid = $('vid-preview');
  const duration = parseFloat($('gif-duration')?.value || '0');
  const fps = parseInt($('gif-fps')?.value || '0');
  const width = parseInt($('gif-width')?.value || '0');
  const ratio = vid && vid.videoHeight && vid.videoWidth ? vid.videoHeight / vid.videoWidth : 1;
  const height = Math.round(width * ratio);
  const estBytes = width * height * fps * duration;
  const el = $('gif-size-estimate');
  if (estBytes > 0 && vid && vid.src) {
    const size = estBytes > 1024 * 1024 ? (estBytes / 1024 / 1024).toFixed(1) + ' MB' : (estBytes / 1024).toFixed(0) + ' KB';
    el.innerHTML = 'Tamaño estimado: <strong>' + size + '</strong>';
  } else {
    if (el) el.textContent = '';
  }
}

export function buildAdaptivePalette(frames) {
  const sampleStep = Math.max(1, Math.floor(frames[0].data.length / (4 * 8000)));
  const pixels = [];
  for (const frame of frames) {
    for (let i = 0; i < frame.data.length; i += 4 * sampleStep) {
      pixels.push([frame.data[i], frame.data[i+1], frame.data[i+2]]);
    }
  }
  const boxes = [pixels];
  while (boxes.length < 256) {
    let maxRange = -1, maxIdx = 0;
    for (let b = 0; b < boxes.length; b++) {
      const box = boxes[b];
      if (box.length < 2) continue;
      let minR=255,minG=255,minB=255,maxR=0,maxG=0,maxB=0;
      for (const [r,g,bl] of box) {
        if(r<minR)minR=r; if(r>maxR)maxR=r;
        if(g<minG)minG=g; if(g>maxG)maxG=g;
        if(bl<minB)minB=bl; if(bl>maxB)maxB=bl;
      }
      const range = Math.max(maxR-minR, maxG-minG, maxB-minB);
      if (range > maxRange) { maxRange = range; maxIdx = b; }
    }
    if (maxRange < 2) break;
    const box = boxes[maxIdx];
    const rRange = box.reduce((a,p)=>Math.max(a,p[0]),0)-box.reduce((a,p)=>Math.min(a,p[0]),255);
    const gRange = box.reduce((a,p)=>Math.max(a,p[1]),0)-box.reduce((a,p)=>Math.min(a,p[1]),255);
    const bRange = box.reduce((a,p)=>Math.max(a,p[2]),0)-box.reduce((a,p)=>Math.min(a,p[2]),255);
    const ch = rRange >= gRange && rRange >= bRange ? 0 : gRange >= bRange ? 1 : 2;
    box.sort((a,b) => a[ch]-b[ch]);
    const mid = Math.floor(box.length / 2);
    boxes.splice(maxIdx, 1, box.slice(0, mid), box.slice(mid));
  }
  const palette = boxes.map(box => {
    const avg = box.reduce((a,p) => [a[0]+p[0],a[1]+p[1],a[2]+p[2]], [0,0,0]);
    return [Math.round(avg[0]/box.length), Math.round(avg[1]/box.length), Math.round(avg[2]/box.length)];
  });
  while (palette.length < 256) palette.push([0,0,0]);
  return palette.slice(0, 256);
}
