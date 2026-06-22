import { $ } from './dom.js';

let deferredPrompt = null;
const DISMISSED_KEY = 'convrt_install_dismissed';

export function initInstallPrompt() {
  const banner = $('install-banner');
  const btn = $('install-btn');
  const dismiss = $('install-dismiss');
  if (!banner || !btn || !dismiss) return;

  if (isDismissed()) return;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    banner.hidden = false;
  });

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.hidden = true;
    if (result.outcome === 'accepted') {
      try { localStorage.setItem(DISMISSED_KEY, '1'); } catch {}
    }
  });

  dismiss.addEventListener('click', () => {
    banner.hidden = true;
    deferredPrompt = null;
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch {}
  });

  window.addEventListener('appinstalled', () => {
    banner.hidden = true;
    deferredPrompt = null;
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch {}
  });
}

function isDismissed() {
  try { return localStorage.getItem(DISMISSED_KEY) === '1'; } catch { return false; }
}
