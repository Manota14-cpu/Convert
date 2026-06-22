import { $, $$ } from './dom.js';
import { t } from './i18n.js';

const steps = [
  { icon: 'drop',    title: 'howStep1Title', desc: 'howStep1Desc' },
  { icon: 'format',  title: 'howStep2Title', desc: 'howStep2Desc' },
  { icon: 'dl',      title: 'howStep3Title', desc: 'howStep3Desc' }
];

const stepVisuals = {
  drop: `<svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="12" y="4" width="24" height="40" rx="3" fill="var(--card-bg)" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4 3"/>
    <path d="M24 18v12m-6-6l6 6 6-6" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 34h16" fill="none" stroke="var(--text-4)" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  format: `<svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="8" y="8" width="32" height="6" rx="2" fill="var(--accent)" opacity="0.2"/>
    <rect x="8" y="20" width="32" height="6" rx="2" fill="var(--accent)" opacity="0.4"/>
    <rect x="8" y="32" width="32" height="6" rx="2" fill="var(--accent)" opacity="0.8"/>
    <circle cx="36" cy="35" r="6" fill="var(--green)"/>
    <path d="M33 35l2 2 4-4" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  dl: `<svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="14" y="4" width="20" height="30" rx="2" fill="var(--card-bg)" stroke="var(--green)" stroke-width="1.5"/>
    <path d="M24 12v16m-7-7l7 7 7-7" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 38h16" fill="none" stroke="var(--text-4)" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`
};

let currentStep = 0;
let intervalId = null;
let isPaused = false;

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function showStep(idx) {
  const container = $('carousel-steps');
  const dots = $('carousel-dots');
  if (!container) return;

  const step = steps[idx];
  container.innerHTML = `
    <div class="carousel-panel" aria-live="polite">
      <div class="carousel-visual">${stepVisuals[step.icon] || ''}</div>
      <div class="carousel-step-num">${idx + 1}</div>
      <div class="carousel-title" data-i18n="${step.title}">${t(step.title)}</div>
      <div class="carousel-desc" data-i18n="${step.desc}">${t(step.desc)}</div>
    </div>
  `;

  if (dots) {
    dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }
}

function advance() {
  if (isPaused || getReducedMotion()) return;
  currentStep = (currentStep + 1) % steps.length;
  showStep(currentStep);
}

function goToStep(idx) {
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
  currentStep = idx;
  showStep(idx);
  if (!isPaused && !getReducedMotion()) {
    intervalId = setInterval(advance, 4000);
  }
}

export function initCarousel() {
  const container = $('carousel-steps');
  if (!container) return;

  const dotsHtml = steps.map((s, i) =>
    `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="${t(s.title)}"></button>`
  ).join('');

  container.insertAdjacentHTML('afterend', `<div class="carousel-dots" id="carousel-dots">${dotsHtml}</div>`);

  showStep(0);

  const dotsEl = $('carousel-dots');
  dotsEl?.addEventListener('click', e => {
    const dot = e.target.closest('.carousel-dot');
    if (dot) goToStep(parseInt(dot.getAttribute('data-idx')));
  });

  container.addEventListener('mouseenter', () => { isPaused = true; });
  container.addEventListener('mouseleave', () => { isPaused = false; });
  container.addEventListener('focusin', () => { isPaused = true; });
  container.addEventListener('focusout', () => { isPaused = false; });

  if (!getReducedMotion()) {
    intervalId = setInterval(advance, 4000);
  }

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
    if (e.matches) {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    } else if (!isPaused) {
      intervalId = setInterval(advance, 4000);
    }
  });
}

export function destroyCarousel() {
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
}
