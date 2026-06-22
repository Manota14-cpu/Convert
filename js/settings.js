import { $ } from './dom.js';

const SETTINGS_KEY = 'convrt_settings';

export function saveSettings() {
  try {
    const s = {
      quality: $('cfg-quality')?.value,
      pdfscale: $('cfg-pdfscale')?.value,
      toasts: $('cfg-toasts')?.checked,
      autoDl: $('cfg-autoDl')?.checked,
      lang: $('cfg-lang')?.value,
      gifFps: $('cfg-gifFps')?.value,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s.quality !== undefined) {
      const el = $('cfg-quality');
      if (el) { el.value = s.quality; const v = $('cfg-quality-val'); if (v) v.textContent = s.quality + '%'; }
    }
    if (s.pdfscale !== undefined) { const el = $('cfg-pdfscale'); if (el) el.value = s.pdfscale; }
    if (s.toasts !== undefined) { const el = $('cfg-toasts'); if (el) el.checked = s.toasts; }
    if (s.autoDl !== undefined) { const el = $('cfg-autoDl'); if (el) el.checked = s.autoDl; }
    if (s.lang !== undefined) { const el = $('cfg-lang'); if (el) el.value = s.lang; }
    if (s.gifFps !== undefined) {
      const el = $('cfg-gifFps'); if (el) el.value = s.gifFps;
      const gf = $('gif-fps'); if (gf) gf.value = s.gifFps;
    }
    return s;
  } catch {}
}

export function syncGifFps() {
  const val = $('cfg-gifFps')?.value;
  const gf = $('gif-fps');
  if (gf && val) gf.value = val;
}
