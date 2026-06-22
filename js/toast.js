import { $ } from './dom.js';

const toasts = [];
const MAX_TOASTS = 5;

export function showToast(msg, type = 'ok') {
  const cfg = document.getElementById('cfg-toasts');
  if (cfg && !cfg.checked && type === 'ok') return;
  const toast = document.createElement('div');
  toast.className = 'toast show' + (type !== 'ok' ? ' ' + type : '');
  toast.textContent = msg;
  toast.setAttribute('role', 'alert');
  document.body.appendChild(toast);
  toasts.push(toast);
  if (toasts.length > MAX_TOASTS) {
    const old = toasts.shift();
    if (old.parentNode) old.parentNode.removeChild(old);
  }
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'toast';
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    const idx = toasts.indexOf(toast);
    if (idx > -1) toasts.splice(idx, 1);
  }, 3500);
}
