export function baseName(name) { return name.replace(/\.[^.]+$/, ''); }
export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
export function getQuality() { return parseInt(document.getElementById('cfg-quality')?.value || '92') / 100; }
export function getPdfScale() { return parseFloat(document.getElementById('cfg-pdfscale')?.value || '2'); }

export function downloadBlob(blob, filename) {
  const el = document.getElementById('cfg-autoDl');
  if (el && !el.checked) return;
  _triggerDownload(blob, filename);
}

export function _triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function imageToFormat(file, fmt) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      if (fmt === 'jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0,0,c.width,c.height); }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob(blob => {
        img.src = '';
        if (blob) resolve(blob); else reject(new Error('Canvas toBlob failed'));
      }, 'image/' + fmt, getQuality());
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

export function handleDragOver(e, zone) { e.preventDefault(); zone.classList.add('dragover'); }
export function handleDragLeave(zone) { zone.classList.remove('dragover'); }

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
