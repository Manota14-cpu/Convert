import { $, $$$ } from './dom.js';
import { t } from './i18n.js';

const tools = {
  img:     { label: 'Imágenes',     icon: '🖼' },
  pdf2img: { label: 'PDF → Img',    icon: '📄' },
  word2pdf:{ label: 'Word → PDF',   icon: '📝' },
  vid2gif: { label: 'Video → GIF',  icon: '🎬' },
  bgremove:{ label: 'Borrar Fondo',  icon: '✂️' },
  urldown: { label: 'Descargar URL', icon: '🔗' }
};

/* ─── Bicolor SVG icon generator ─── */
const iconSymbols = {
  img: `<path d="M14 30l6-8 5 6 5-4 8 10z"/><circle cx="36" cy="14" r="4"/>`,
  pdf2img: `<text x="24" y="28" font-size="11" font-weight="700" text-anchor="middle" fill="rgba(255,255,255,0.9)">PDF</text>`,
  word2pdf: `<rect x="15" y="20" width="18" height="2" rx="1"/><rect x="15" y="26" width="18" height="2" rx="1"/><rect x="15" y="32" width="12" height="2" rx="1"/>`,
  vid2gif: `<path d="M20 16v16l12-8z"/><circle cx="14" cy="14" r="2.5"/><circle cx="34" cy="14" r="2.5"/>`,
  bgremove: `<circle cx="24" cy="18" r="6"/><path d="M14 34c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-linecap="round"/>`,
  urldown: `<path d="M24 14v16m-7-7l7 7 7-7" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 36h16" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round"/>`
};

const iconColors = {
  hot:    { dark: '#2667c7', light: '#8bc4f0' },
  cold:   { dark: '#1d7e8a', light: '#7dc8d4' },
  ok:     { dark: '#2b7a38', light: '#78c485' },
  warn:   { dark: '#c64e00', light: '#f29463' },
  purple: { dark: '#7a3d8a', light: '#b882c9' },
  pink:   { dark: '#c62d32', light: '#f0878b' }
};

export function iconSvg(name, colorKey, size = 48) {
  const c = iconColors[colorKey] || iconColors.hot;
  const s = typeof size === 'number' ? size : 48;
  const midY = s * 0.38;
  const r = s * 0.14;

  return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M${r} ${r}h${s-2*r}v${s-2*r}c0 ${r*0.6} ${r*0.2} ${r} ${r*0.5} ${r}H${r}c${r*0.3} 0 ${r*0.5}-${r*0.4} ${r*0.5}-${r}V${r}z" fill="${c.light}"/>
    <path d="M${r} ${r}h${s-2*r}v${midY}c0 ${r*0.4} ${r*0.15} ${r*0.7} ${r*0.35} ${r*0.7}H${r}c${r*0.2} 0 ${r*0.35}-${r*0.3} ${r*0.35}-${r*0.7}V${r}z" fill="${c.dark}"/>
    <path d="M${r} ${r}h${s-2*r}v${s*0.08}H${r}z" fill="${c.dark}" opacity="0.3"/>
    ${iconSymbols[name] || iconSymbols.img}
  </svg>`;
}

function renderSidebarIcons() {
  document.querySelectorAll('.sidebar-icon[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    const item = el.closest('.sidebar-item');
    const colorKey = item?.dataset.color || 'hot';
    el.innerHTML = iconSvg(name, colorKey, 28);
  });
  document.querySelectorAll('.tool-card-icon[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    const card = el.closest('.tool-card');
    const colorKey = card?.dataset.color || 'hot';
    el.innerHTML = iconSvg(name, colorKey, 28);
  });
}

function renderDockIcons() {
  document.querySelectorAll('.mobile-dock-item .dock-icon[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    const item = el.closest('.mobile-dock-item');
    const colorKey = item?.dataset.color || 'hot';
    el.innerHTML = iconSvg(name, colorKey, 24);
  });
}

/* ─── Breadcrumb navigation ─── */
let pageHistory = ['converter'];
let historyIdx = 0;

export function updateBreadcrumb(toolId) {
  const bread = $('breadcrumb');
  if (!bread) return;

  let names = {
    img:      'Imágenes',
    pdf2img:  'PDF → Img',
    word2pdf: 'Word → PDF',
    vid2gif:  'Video → GIF',
    bgremove: 'Borrar Fondo',
    urldown:  'Descargar URL',
    converter:'Convertir',
    settings: 'Config',
    faq:      'Ayuda'
  };

  const name = names[toolId] || toolId;
  const active = toolId === 'converter' ? getActivePanel() : toolId;
  const activeName = names[active] || active;

  if (toolId === 'converter' && active) {
    bread.innerHTML = `<span class="bc-segment bc-home">🏠</span> <span class="bc-sep">/</span> <span class="bc-segment bc-current">${name}</span> <span class="bc-sep">/</span> <span class="bc-segment bc-tool">${activeName}</span>`;
  } else {
    bread.innerHTML = `<span class="bc-segment bc-home">🏠</span> <span class="bc-sep">/</span> <span class="bc-segment bc-current">${name}</span>`;
  }

  // Update nav arrows
  const backBtn = $('nav-back');
  const fwdBtn = $('nav-forward');
  if (backBtn) backBtn.disabled = historyIdx <= 0;
  if (fwdBtn) fwdBtn.disabled = historyIdx >= pageHistory.length - 1;
}

function getActivePanel() {
  const active = document.querySelector('.sidebar-item.active') || document.querySelector('.panel.active');
  if (active) {
    const id = active.getAttribute('data-panel');
    if (id) {
      const names = {
        img:'Imágenes', pdf2img:'PDF → Img', word2pdf:'Word → PDF',
        vid2gif:'Video → GIF', bgremove:'Borrar Fondo', urldown:'Descargar URL'
      };
      return names[id] || id;
    }
  }
  return '';
}

export function navBack() {
  if (historyIdx > 0) {
    historyIdx--;
    navigateTo(pageHistory[historyIdx]);
  }
}

export function navForward() {
  if (historyIdx < pageHistory.length - 1) {
    historyIdx++;
    navigateTo(pageHistory[historyIdx]);
  }
}

function navigateTo(id) {
  if (id === 'converter' || id === 'settings' || id === 'faq') {
    const btn = document.querySelector(`.top-nav-btn[data-page="${id}"]`);
    switchAppPage(id, btn);
  } else {
    const sidebarItem = document.querySelector(`.sidebar-item[data-panel="${id}"]`);
    switchPanel(id, sidebarItem);
    const dockItem = document.querySelector(`.mobile-dock-item[data-panel="${id}"]`);
    if (dockItem) dockItem.classList.add('active');
  }
}

export function enterApp() {
  const landing = $('screen-landing');
  const app = $('screen-app');
  landing.style.opacity = '0';
  setTimeout(() => {
    landing.classList.remove('active');
    landing.style = '';
    app.classList.add('active');
    document.getElementById('page-converter')?.classList.add('active');
    if (app) app.focus();
    updateBreadcrumb('img');
  }, 250);
}

export function goLanding() {
  $('screen-app')?.classList.remove('active');
  $('screen-landing')?.classList.add('active');
}

export function switchAppPage(id, btn) {
  $$$('.app-page').forEach(p => p.classList.remove('active'));
  $$$('.top-nav-btn').forEach(b => b.classList.remove('active'));
  const page = $('page-' + id);
  if (page) page.classList.add('active');
  if (btn) btn.classList.add('active');

  updateBreadcrumb(id);

  // Deselect sidebar
  $$$('.sidebar-item').forEach(b => b.classList.remove('active'));

  if (pageHistory[historyIdx] !== id) {
    pageHistory = pageHistory.slice(0, historyIdx + 1);
    pageHistory.push(id);
    historyIdx = pageHistory.length - 1;
  }
  updateBreadcrumb(id);
}

export function switchPanel(id, btn) {
  $$$('.panel').forEach(p => p.classList.remove('active'));
  $$$('.sidebar-item').forEach(b => b.classList.remove('active'));
  $$$('.mobile-dock-item').forEach(b => b.classList.remove('active'));
  const panel = $('panel-' + id);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');

  // Always make sure the converter page is visible when switching panels
  $$$('.app-page').forEach(p => p.classList.remove('active'));
  $$$('.top-nav-btn').forEach(b => b.classList.remove('active'));
  const converterPage = $('page-converter');
  if (converterPage) converterPage.classList.add('active');
  const converterBtn = document.querySelector('.top-nav-btn[data-page="converter"]');
  if (converterBtn) converterBtn.classList.add('active');

  if (id === 'vid2gif') {
    import('./settings.js').then(m => m.syncGifFps());
  }

  updateBreadcrumb(id);

  if (pageHistory[historyIdx] !== id) {
    pageHistory = pageHistory.slice(0, historyIdx + 1);
    pageHistory.push(id);
    historyIdx = pageHistory.length - 1;
  }
}

export function selectFmt(panel, fmt, btn) {
  import('./state.js').then(m => { m.setPanelFmt(panel, fmt); });
  const parent = btn.closest('.format-options');
  const oldBtn = parent.querySelector('.fmt-opt.selected');
  if (oldBtn === btn) return;
  parent.querySelectorAll('.fmt-opt').forEach(b => b.classList.remove('selected', 'flip-out', 'flip-in'));
  if (oldBtn) {
    oldBtn.classList.add('flip-out');
    btn.classList.add('flip-in');
    setTimeout(() => {
      btn.classList.add('selected');
      btn.classList.remove('flip-in');
      oldBtn.classList.remove('flip-out');
    }, 200);
  } else {
    btn.classList.add('selected');
  }
}

export function initSidebar() {
  const sidebar = $('sidebar');
  if (!sidebar) return;

  renderSidebarIcons();
  renderDockIcons();

  sidebar.addEventListener('click', e => {
    const item = e.target.closest('.sidebar-item');
    if (!item) return;
    const id = item.getAttribute('data-panel');
    const page = item.getAttribute('data-page');
    if (id) { switchPanel(id, item); }
    else if (page) {
      const btn = document.querySelector(`.top-nav-btn[data-page="${page}"]`);
      switchAppPage(page, btn);
    }
  });

  const mobileDock = $('mobile-dock');
  if (mobileDock) {
    mobileDock.addEventListener('click', e => {
      const item = e.target.closest('.mobile-dock-item');
      if (!item) return;
      const id = item.getAttribute('data-panel');
      if (!id) return;
      switchPanel(id, item);
    });
  }

  // Nav arrows
  const backBtn = $('nav-back');
  const fwdBtn = $('nav-forward');
  if (backBtn) backBtn.addEventListener('click', navBack);
  if (fwdBtn) fwdBtn.addEventListener('click', navForward);

  // Burger menu
  const burger = $('nav-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Close sidebar on item click (mobile)
  sidebar.addEventListener('click', e => {
    if (e.target.closest('.sidebar-item')) {
      sidebar.classList.remove('open');
    }
  });

  // Auto-activate first tool
  const firstItem = sidebar.querySelector('.sidebar-item[data-panel]');
  if (firstItem) {
    switchPanel(firstItem.dataset.panel, firstItem);
  }
}

export function initSidebarKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key >= '1' && e.key <= '6') {
      const items = [...document.querySelectorAll('.sidebar-item[data-panel]')];
      const idx = parseInt(e.key) - 1;
      if (idx >= items.length) return;
      e.preventDefault();
      items[idx].focus();
      items[idx].click();
    }
  });
}

/* ─── View toggle (grid ↔ list) ─── */
let gridView = true;

export function toggleView() {
  gridView = !gridView;
  const btn = $('view-toggle');
  if (btn) btn.textContent = gridView ? '⊞' : '☰';
  document.querySelectorAll('.file-grid').forEach(g => {
    g.classList.toggle('list-view', !gridView);
    g.classList.toggle('grid-view', gridView);
  });
}

export function initViewToggle() {
  const btn = $('view-toggle');
  if (btn) btn.addEventListener('click', toggleView);
}
