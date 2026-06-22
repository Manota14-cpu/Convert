const cache = {};
export function $(id) {
  if (!(id in cache)) cache[id] = document.getElementById(id);
  return cache[id];
}
export function $$(sel, ctx) { return (ctx || document).querySelector(sel); }
export function $$$(sel, ctx) { return (ctx || document).querySelectorAll(sel); }
export function clearDomCache() {
  Object.keys(cache).forEach(k => delete cache[k]);
}
