import { $ } from './dom.js';

let swRegistration = null;

export function initSwUpdate() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./sw.js').then(reg => {
    swRegistration = reg;
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateBanner();
        }
      });
    });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

function showUpdateBanner() {
  const indicator = $('sw-indicator');
  if (!indicator) return;
  indicator.style.display = 'inline';
  indicator.innerHTML = '<span class="sw-badge">⬇ Nueva versión — <button class="sw-reload-btn" id="sw-reload-btn">Actualizar</button></span>';
  const btn = document.getElementById('sw-reload-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (swRegistration && swRegistration.waiting) {
        swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
}
