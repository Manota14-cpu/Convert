import { $ } from './dom.js';
import { LANG, currentLang, setText } from './i18n.js';

export function buildFaq() {
  const container = $('faq-container');
  if (!container) return;
  const L = LANG[currentLang];
  setText('faq-title', L.faqTitle);
  setText('faq-sub', L.faqSub);
  container.innerHTML = L.faqSections.map(section => `
    <div class="faq-section-title">${section.title}</div>
    ${section.items.map(item => `
      <div class="faq-item">
        <div class="faq-question" tabindex="0" role="button" aria-expanded="false">
          ${item.q}
          <span class="faq-chevron">▼</span>
        </div>
        <div class="faq-answer" role="region">
          <div class="faq-answer-inner">${item.a}</div>
        </div>
      </div>
    `).join('')}
  `).join('');
}

export function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-question').forEach(q => {
    q.classList.remove('open');
    q.setAttribute('aria-expanded', 'false');
    q.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    answer.classList.add('open');
  }
}
