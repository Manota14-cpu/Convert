import { $, $$$ } from './dom.js';

let requestCount = 0;

export function initNetworkIndicator() {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    requestCount++;
    updateNetCount();
    return originalFetch.call(window, input, init);
  };
  updateNetCount();
}

function updateNetCount() {
  const el = $('net-count');
  if (el) el.textContent = requestCount;
}

export function getRequestCount() { return requestCount; }
