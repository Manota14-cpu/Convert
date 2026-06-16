// ═══════════════════════════════
//  i18n
// ═══════════════════════════════
const LANG = {
  es: {
    // Landing
    landingTag:    'Herramienta de conversión local',
    landingDesc:   'Convertí imágenes, PDFs, documentos Word, creá GIFs desde video y eliminá fondos de imágenes. Todo en tu navegador, sin servidores, sin privacidad comprometida.',
    landingNote:   ' — tus archivos nunca se suben a ningún servidor',
    enterBtn:      'Entrar a la app',
    // Header
    navConverter:  'Convertir',
    navSettings:   'Config',
    navHelp:       'Ayuda',
    statusReady:   'Listo',
    // Sidebar
    sidebarTitle:  'Conversiones',
    convImages:    'Imágenes',
    convPdf2img:   'PDF → Img',
    convWord2pdf:  'Word → PDF',
    convVid2gif:   'Video → GIF',
    convBgRemove:  'Borrar Fondo',
    // Panel subtitles
    imgSubtitle:     'Convertí entre formatos de imagen sin pérdida de calidad',
    pdfSubtitle:     'Extraé cada página del PDF como imagen de alta resolución',
    wordSubtitle:    'Convertí documentos .docx preservando el formato',
    vidSubtitle:     'Convertí fragmentos de video en GIFs animados',
    bgSubtitle:      'Eliminá el fondo de imágenes automáticamente',
    // Drop zone
    dropMain:    'Arrastrá o hacé clic',
    dropSub:     'Múltiples archivos soportados',
    dropSubSingle: 'Un video a la vez',
    dropSubBg:   'Funciona mejor con fondos de color uniforme',
    // Format selector
    convertTo:   'Convertir a →',
    outputFmt:   'Formato de salida →',
    // GIF options
    gifStart:    'Inicio (seg)',
    gifDuration: 'Duración (seg)',
    gifFps:      'FPS',
    gifWidth:    'Ancho (px)',
    // Slider
    tolerance:   'Tolerancia',
    // Buttons
    btnConvert:   'Convertir',
    btnGenerateGif: 'Generar GIF',
    btnRemoveBg:  'Borrar Fondo',
    btnClear:     'Limpiar',
    btnDownloadGif: 'Descargar GIF',
    // File status
    statusPending:    'En cola',
    statusConverting: 'Procesando...',
    statusDone:       '✓ Listo',
    statusError:      '✗ Error',
    // File count
    fileCount:  (n) => `${n} archivo${n !== 1 ? 's' : ''}`,
    // Notices
    noticeLocal:  '<strong>Procesamiento local</strong> — Tus archivos nunca salen de tu navegador.',
    noticePdf:    '<strong>PDF.js</strong> — Renderizado directo en el navegador. Sin servidores.',
    noticeWord:   '<strong>Nota:</strong> Se abrirá el diálogo de impresión. Elegí <strong>"Guardar como PDF"</strong> como destino.',
    noticeGif:    '<strong>Nota:</strong> GIFs generados mediante captura de frames. Para mejores resultados usá videos cortos (&lt; 10 seg).',
    noticeBg:     '<strong>Algoritmo local:</strong> Usa flood-fill desde las esquinas. Funciona mejor con fondos uniformes. Ajustá la tolerancia si es necesario.',
    // Toasts
    toastImgDone:   (n) => `✓ ${n} imagen${n > 1 ? 'es convertidas' : ' convertida'}`,
    toastPdfDone:   '✓ PDF convertido a imágenes',
    toastWordDone:  '✓ Abrí el diálogo → guardá como PDF',
    toastGifDone:   '✓ GIF generado',
    toastBgDone:    '✓ Fondo removido',
    toastBadFmt:    'Formato no soportado',
    // Settings
    settingsTitle: 'Configuración',
    settingsSub:   'Personalizá el comportamiento de CONVRT',
    settingsGrpQuality: 'Calidad de exportación',
    settingJpgQualityName: 'Calidad JPG / WEBP',
    settingJpgQualityDesc: 'Nivel de compresión para imágenes JPG y WEBP (1–100)',
    settingPdfScaleName: 'Escala PDF',
    settingPdfScaleDesc: 'Factor de resolución al convertir páginas PDF a imagen',
    settingPdfScale1: '1x — Rápido',
    settingPdfScale2: '2x — Balanceado',
    settingPdfScale3: '3x — Alta calidad',
    settingsGrpUI: 'Interfaz',
    settingToastsName: 'Notificaciones',
    settingToastsDesc: 'Mostrar toast al completar cada conversión',
    settingAutoDlName: 'Descarga automática',
    settingAutoDlDesc: 'Descargar archivos automáticamente al finalizar',
    settingLangName:  'Idioma',
    settingLangDesc:  'Idioma de la interfaz',
    settingsGrpGif: 'GIF',
    settingGifFpsName: 'FPS por defecto',
    settingGifFpsDesc: 'Frames por segundo al generar GIFs',
    // FAQ
    faqTitle: 'Ayuda & FAQ',
    faqSub:   'Preguntas frecuentes sobre el uso de CONVRT',
    faqSections: [
      { title: 'General', items: [
        { q: '¿Mis archivos se suben a algún servidor?', a: '<strong>No, absolutamente no.</strong> Toda la conversión ocurre directamente en tu navegador usando APIs nativas como <code>Canvas</code>, <code>PDF.js</code> y <code>Mammoth.js</code>. Tus archivos nunca abandonan tu dispositivo. Podés desconectar Internet y la app sigue funcionando.' },
        { q: '¿Qué tamaño máximo de archivo soporta?', a: 'Depende de la memoria disponible en tu navegador. En general, archivos de hasta <strong>100 MB</strong> funcionan bien. PDFs con muchas páginas o imágenes de alta resolución pueden ser lentos en dispositivos con poca RAM.' },
        { q: '¿Puedo usar la app sin conexión a Internet?', a: 'Casi sí. Las fuentes tipográficas y librerías se cargan desde CDN. Si ya las cargaste una vez, el navegador puede tenerlas en caché. Para uso completamente offline, podés descargar esas dependencias y referenciarlas localmente.' },
      ]},
      { title: 'Conversión de imágenes', items: [
        { q: '¿Por qué al convertir a JPG la imagen pierde transparencia?', a: 'JPG <strong>no soporta transparencia</strong>. Al convertir una imagen PNG con fondo transparente a JPG, los píxeles transparentes se rellenan con blanco. Si necesitás mantener la transparencia, usá <strong>PNG o WEBP</strong>.' },
        { q: '¿Cuál es la diferencia entre PNG, JPG y WEBP?', a: '<strong>PNG:</strong> Sin pérdida, soporta transparencia. Ideal para logos e ilustraciones.<br/><br/><strong>JPG:</strong> Con compresión, no soporta transparencia. Ideal para fotos.<br/><br/><strong>WEBP:</strong> Formato moderno. Mejor compresión que JPG. Soporta transparencia. Recomendado para web.' },
      ]},
      { title: 'Borrar fondo', items: [
        { q: '¿Por qué el fondo no se elimina correctamente?', a: 'El algoritmo usa <strong>flood-fill desde las esquinas</strong>. Funciona mejor cuando el fondo ocupa las esquinas y tiene un color uniforme. <br/><br/>Tip: <strong>aumentá la tolerancia</strong> si el fondo no se elimina del todo, o bajála si se eliminan partes del sujeto.' },
      ]},
      { title: 'Video → GIF', items: [
        { q: '¿Por qué el GIF generado es grande en tamaño?', a: 'El formato GIF soporta solo <strong>256 colores</strong>. Para reducir el tamaño: bajá el <strong>ancho</strong>, reducí la <strong>duración</strong>, o bajá los <strong>FPS</strong>. Un buen balance es 480px, 10 FPS y menos de 5 segundos.' },
        { q: '¿Puedo convertir cualquier formato de video?', a: 'La app acepta cualquier formato que tu navegador pueda reproducir. En la mayoría de los navegadores modernos: <strong>MP4, WEBM y MOV</strong>. Si el video no se previsualiza, el navegador no puede leerlo directamente.' },
      ]},
    ],
  },
  en: {
    landingTag:    'Local file conversion tool',
    landingDesc:   'Convert images, PDFs, Word documents, create GIFs from video and remove image backgrounds. All in your browser, no servers, no privacy compromise.',
    landingNote:   ' — your files are never uploaded to any server',
    enterBtn:      'Enter the app',
    navConverter:  'Convert',
    navSettings:   'Settings',
    navHelp:       'Help',
    statusReady:   'Ready',
    sidebarTitle:  'Conversions',
    convImages:    'Images',
    convPdf2img:   'PDF → Img',
    convWord2pdf:  'Word → PDF',
    convVid2gif:   'Video → GIF',
    convBgRemove:  'Remove BG',
    imgSubtitle:     'Convert between image formats without quality loss',
    pdfSubtitle:     'Extract each PDF page as a high-resolution image',
    wordSubtitle:    'Convert .docx documents preserving formatting',
    vidSubtitle:     'Convert video clips into animated GIFs',
    bgSubtitle:      'Automatically remove image backgrounds',
    dropMain:    'Drag or click to upload',
    dropSub:     'Multiple files supported',
    dropSubSingle: 'One video at a time',
    dropSubBg:   'Works best with solid color backgrounds',
    convertTo:   'Convert to →',
    outputFmt:   'Output format →',
    gifStart:    'Start (sec)',
    gifDuration: 'Duration (sec)',
    gifFps:      'FPS',
    gifWidth:    'Width (px)',
    tolerance:   'Tolerance',
    btnConvert:   'Convert',
    btnGenerateGif: 'Generate GIF',
    btnRemoveBg:  'Remove BG',
    btnClear:     'Clear',
    btnDownloadGif: 'Download GIF',
    statusPending:    'Queued',
    statusConverting: 'Processing...',
    statusDone:       '✓ Done',
    statusError:      '✗ Error',
    fileCount:  (n) => `${n} file${n !== 1 ? 's' : ''}`,
    noticeLocal:  '<strong>Local processing</strong> — Your files never leave your browser.',
    noticePdf:    '<strong>PDF.js</strong> — Direct in-browser rendering. No servers.',
    noticeWord:   '<strong>Note:</strong> The print dialog will open. Choose <strong>"Save as PDF"</strong> as destination.',
    noticeGif:    '<strong>Note:</strong> GIFs generated via frame capture. For best results use short videos (&lt; 10 sec).',
    noticeBg:     '<strong>Local algorithm:</strong> Uses flood-fill from corners. Works best with uniform backgrounds. Adjust tolerance as needed.',
    toastImgDone:   (n) => `✓ ${n} image${n > 1 ? 's converted' : ' converted'}`,
    toastPdfDone:   '✓ PDF converted to images',
    toastWordDone:  '✓ Open the dialog → save as PDF',
    toastGifDone:   '✓ GIF generated',
    toastBgDone:    '✓ Background removed',
    toastBadFmt:    'Unsupported format',
    settingsTitle: 'Settings',
    settingsSub:   'Customize how CONVRT behaves',
    settingsGrpQuality: 'Export quality',
    settingJpgQualityName: 'JPG / WEBP Quality',
    settingJpgQualityDesc: 'Compression level for JPG and WEBP images (1–100)',
    settingPdfScaleName: 'PDF Scale',
    settingPdfScaleDesc: 'Resolution factor when converting PDF pages to image',
    settingPdfScale1: '1x — Fast',
    settingPdfScale2: '2x — Balanced',
    settingPdfScale3: '3x — High quality',
    settingsGrpUI: 'Interface',
    settingToastsName: 'Notifications',
    settingToastsDesc: 'Show toast on each conversion completion',
    settingAutoDlName: 'Auto-download',
    settingAutoDlDesc: 'Automatically download files when done',
    settingLangName:  'Language',
    settingLangDesc:  'Interface language',
    settingsGrpGif: 'GIF',
    settingGifFpsName: 'Default FPS',
    settingGifFpsDesc: 'Frames per second when generating GIFs',
    faqTitle: 'Help & FAQ',
    faqSub:   'Frequently asked questions about using CONVRT',
    faqSections: [
      { title: 'General', items: [
        { q: 'Are my files uploaded to any server?', a: '<strong>No, absolutely not.</strong> All conversion happens directly in your browser using native APIs like <code>Canvas</code>, <code>PDF.js</code> and <code>Mammoth.js</code>. Your files never leave your device. You can disconnect from the Internet and the app still works.' },
        { q: 'What is the maximum file size supported?', a: 'It depends on the memory available in your browser. Generally, files up to <strong>100 MB</strong> work well. PDFs with many pages or high-resolution images may be slow on devices with limited RAM.' },
        { q: 'Can I use the app offline?', a: 'Almost. Fonts and libraries are loaded from CDN. If you have loaded them once, the browser may have them cached. For fully offline use, you can download those dependencies and reference them locally.' },
      ]},
      { title: 'Image conversion', items: [
        { q: 'Why does converting to JPG lose transparency?', a: 'JPG <strong>does not support transparency</strong>. When converting a PNG with a transparent background to JPG, transparent pixels are filled with white. If you need to keep transparency, use <strong>PNG or WEBP</strong>.' },
        { q: 'What is the difference between PNG, JPG and WEBP?', a: '<strong>PNG:</strong> Lossless, supports transparency. Ideal for logos and illustrations.<br/><br/><strong>JPG:</strong> Compressed, no transparency. Ideal for photos.<br/><br/><strong>WEBP:</strong> Modern format. Better compression than JPG. Supports transparency. Recommended for web.' },
      ]},
      { title: 'Background removal', items: [
        { q: 'Why is the background not removed correctly?', a: 'The algorithm uses <strong>flood-fill from corners</strong>. It works best when the background occupies the corners and has a uniform color. <br/><br/>Tip: <strong>increase tolerance</strong> if the background is not fully removed, or lower it if parts of the subject are being removed.' },
      ]},
      { title: 'Video → GIF', items: [
        { q: 'Why is the generated GIF large in file size?', a: 'The GIF format only supports <strong>256 colors</strong>. To reduce size: lower the <strong>width</strong>, reduce the <strong>duration</strong>, or lower the <strong>FPS</strong>. A good balance is 480px, 10 FPS and less than 5 seconds.' },
        { q: 'Can I convert any video format?', a: 'The app accepts any format your browser can play. In most modern browsers: <strong>MP4, WEBM and MOV</strong>. If the video does not preview, the browser cannot read it directly.' },
      ]},
    ],
  }
};

let currentLang = 'es';

function t(key, ...args) {
  const val = LANG[currentLang][key];
  if (typeof val === 'function') return val(...args);
  return val ?? key;
}

function applyLang() {
  const L = LANG[currentLang];
  // Landing
  setText('landing-tag-text', L.landingTag);
  setText('landing-desc-text', L.landingDesc);
  setHtml('landing-note-text', `<span>100% local</span>${L.landingNote}`);
  setText('enter-btn-text', L.enterBtn);
  // Header
  setText('nav-converter', L.navConverter);
  setText('nav-settings', L.navSettings);
  setText('nav-faq', L.navHelp);
  setText('status-dot-text', L.statusReady);
  // Sidebar
  setText('sidebar-title', L.sidebarTitle);
  setText('conv-images-text', L.convImages);
  setText('conv-pdf2img-text', L.convPdf2img);
  setText('conv-word2pdf-text', L.convWord2pdf);
  setText('conv-vid2gif-text', L.convVid2gif);
  setText('conv-bgremove-text', L.convBgRemove);
  // Panel subtitles
  setText('img-subtitle', L.imgSubtitle);
  setText('pdf-subtitle', L.pdfSubtitle);
  setText('word-subtitle', L.wordSubtitle);
  setText('vid-subtitle', L.vidSubtitle);
  setText('bg-subtitle', L.bgSubtitle);
  // Drop zones
  document.querySelectorAll('.drop-main').forEach(el => el.textContent = L.dropMain);
  setText('drop-sub-img', L.dropSub);
  setText('drop-sub-pdf', L.dropSub);
  setText('drop-sub-word', L.dropSub);
  setText('drop-sub-vid', L.dropSubSingle);
  setText('drop-sub-bg', L.dropSubBg);
  // Format selectors
  document.querySelectorAll('.format-label-to').forEach(el => el.textContent = L.convertTo);
  setText('format-label-pdf', L.outputFmt);
  // GIF options
  setText('gif-label-start', L.gifStart);
  setText('gif-label-duration', L.gifDuration);
  setText('gif-label-fps', L.gifFps);
  setText('gif-label-width', L.gifWidth);
  // Tolerance
  setText('tolerance-label', L.tolerance);
  // Buttons
  document.querySelectorAll('.btn-convert-img').forEach(el => el.textContent = L.btnConvert);
  setText('btn-vid2gif', L.btnGenerateGif);
  setText('btn-bgremove', L.btnRemoveBg);
  document.querySelectorAll('.btn-clear-label').forEach(el => el.textContent = L.btnClear);
  setText('btn-dl-gif-text', L.btnDownloadGif);
  // Notices
  setHtml('notice-img', L.noticeLocal);
  setHtml('notice-pdf', L.noticePdf);
  setHtml('notice-word', L.noticeWord);
  setHtml('notice-gif', L.noticeGif);
  setHtml('notice-bg', L.noticeBg);
  // File counts
  ['img','pdf2img','word2pdf','vid2gif','bgremove'].forEach(p => {
    const n = state[p].files.length;
    const el = document.getElementById('count-' + p);
    if (el) el.textContent = L.fileCount(n);
  });
  // Settings
  setText('settings-title', L.settingsTitle);
  setText('settings-sub', L.settingsSub);
  setText('settings-grp-quality', L.settingsGrpQuality);
  setText('setting-jpg-name', L.settingJpgQualityName);
  setText('setting-jpg-desc', L.settingJpgQualityDesc);
  setText('setting-pdfscale-name', L.settingPdfScaleName);
  setText('setting-pdfscale-desc', L.settingPdfScaleDesc);
  setText('setting-pdfscale-1', L.settingPdfScale1);
  setText('setting-pdfscale-2', L.settingPdfScale2);
  setText('setting-pdfscale-3', L.settingPdfScale3);
  setText('settings-grp-ui', L.settingsGrpUI);
  setText('setting-toasts-name', L.settingToastsName);
  setText('setting-toasts-desc', L.settingToastsDesc);
  setText('setting-autodl-name', L.settingAutoDlName);
  setText('setting-autodl-desc', L.settingAutoDlDesc);
  setText('setting-lang-name', L.settingLangName);
  setText('setting-lang-desc', L.settingLangDesc);
  setText('settings-grp-gif', L.settingsGrpGif);
  setText('setting-gif-fps-name', L.settingGifFpsName);
  setText('setting-gif-fps-desc', L.settingGifFpsDesc);
  // FAQ — rebuild
  buildFaq();
  // Re-render file lists for status labels
  ['img','pdf2img','word2pdf','vid2gif','bgremove'].forEach(renderFiles);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.textContent = val;
}
function setHtml(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.innerHTML = val;
}

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  applyLang();
}

// FAQ builder
function buildFaq() {
  const container = document.getElementById('faq-container');
  if (!container) return;
  const L = LANG[currentLang];
  setText('faq-title', L.faqTitle);
  setText('faq-sub', L.faqSub);
  container.innerHTML = L.faqSections.map(section => `
    <div class="faq-section-title">${section.title}</div>
    ${section.items.map(item => `
      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          ${item.q}
          <span class="faq-chevron">▼</span>
        </div>
        <div class="faq-answer">
          <div class="faq-answer-inner">${item.a}</div>
        </div>
      </div>
    `).join('')}
  `).join('');
}

// ═══════════════════════════════
//  STATE
// ═══════════════════════════════
const state = {
  img:      { files: [], fmt: 'png' },
  pdf2img:  { files: [], fmt: 'png' },
  word2pdf: { files: [] },
  vid2gif:  { files: [] },
  bgremove: { files: [] }
};
let gifBlob = null;

// ═══════════════════════════════
//  SCREENS
// ═══════════════════════════════
function enterApp() {
  const landing = document.getElementById('screen-landing');
  const app = document.getElementById('screen-app');
  landing.style.transition = 'opacity 0.5s, transform 0.5s';
  landing.style.opacity = '0';
  landing.style.transform = 'scale(1.03)';
  setTimeout(() => {
    landing.classList.remove('active');
    landing.style = '';
    app.classList.add('active');
  }, 450);
}

function goLanding() {
  document.getElementById('screen-app').classList.remove('active');
  document.getElementById('screen-landing').classList.add('active');
}

// ═══════════════════════════════
//  APP PAGES
// ═══════════════════════════════
function switchAppPage(id, btn) {
  document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');
}

// ═══════════════════════════════
//  PANELS
// ═══════════════════════════════
function switchPanel(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.conv-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
}

// ═══════════════════════════════
//  FORMAT
// ═══════════════════════════════
function selectFmt(panel, fmt, btn) {
  state[panel].fmt = fmt;
  btn.closest('.format-options').querySelectorAll('.fmt-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// ═══════════════════════════════
//  DRAG & DROP
// ═══════════════════════════════
function handleDragOver(e, zone) { e.preventDefault(); zone.classList.add('dragover'); }
function handleDragLeave(zone) { zone.classList.remove('dragover'); }
function handleDrop(e, panel) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  processFiles([...e.dataTransfer.files], panel);
}
function handleFiles(fileList, panel) { processFiles([...fileList], panel); }

function processFiles(files, panel) {
  const filtered = files.filter(f => {
    if (panel === 'word2pdf') return f.name.endsWith('.docx');
    if (panel === 'pdf2img') return f.type === 'application/pdf' || f.name.endsWith('.pdf');
    if (panel === 'vid2gif') return f.type.startsWith('video/');
    return f.type.startsWith('image/');
  });
  if (!filtered.length) { showToast(t('toastBadFmt'), 'error'); return; }
  if (panel === 'vid2gif') {
    state.vid2gif.files = [{ file: filtered[0], name: filtered[0].name, size: filtered[0].size, status: 'pending' }];
    const vid = document.getElementById('vid-preview');
    vid.src = URL.createObjectURL(filtered[0]);
    document.getElementById('vid-preview-wrap').style.display = 'block';
    document.getElementById('gif-result').style.display = 'none';
    gifBlob = null;
  } else {
    filtered.forEach(f => {
      if (!state[panel].files.find(x => x.name === f.name && x.size === f.size))
        state[panel].files.push({ file: f, name: f.name, size: f.size, status: 'pending' });
    });
  }
  renderFiles(panel);
  updateBtn(panel);
}

// ═══════════════════════════════
//  FILES UI
// ═══════════════════════════════
function renderFiles(panel) {
  const list = document.getElementById('files-' + panel);
  const count = document.getElementById('count-' + panel);
  const files = state[panel].files;
  if (count) count.textContent = t('fileCount', files.length);
  const labels = {
    pending:    t('statusPending'),
    converting: t('statusConverting'),
    done:       t('statusDone'),
    error:      t('statusError')
  };
  if (list) list.innerHTML = files.map((f, i) => {
    const ext = f.name.split('.').pop().toUpperCase();
    const size = f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+' MB' : (f.size/1024).toFixed(0)+' KB';
    return `<div class="file-item" id="fi-${panel}-${i}" style="animation-delay:${i*0.05}s">
      <span class="file-ext">${ext}</span>
      <span class="file-name">${f.name}</span>
      <span class="file-size">${size}</span>
      <span class="file-status ${f.status}">${labels[f.status]}</span>
      <button class="file-remove" onclick="removeFile('${panel}',${i})">×</button>
    </div>`;
  }).join('');
}

function removeFile(panel, idx) {
  const item = document.getElementById(`fi-${panel}-${idx}`);
  if (item) {
    item.style.transition = 'opacity 0.2s, transform 0.2s';
    item.style.opacity = '0';
    item.style.transform = 'translateX(-10px)';
    setTimeout(() => { state[panel].files.splice(idx, 1); renderFiles(panel); updateBtn(panel); }, 200);
  } else {
    state[panel].files.splice(idx, 1); renderFiles(panel); updateBtn(panel);
  }
}

function clearFiles(panel) { state[panel].files = []; renderFiles(panel); updateBtn(panel); hideProgress(panel); }
function clearVid() {
  clearFiles('vid2gif');
  document.getElementById('vid-preview-wrap').style.display = 'none';
  document.getElementById('gif-result').style.display = 'none';
  document.getElementById('vid-preview').src = '';
  gifBlob = null;
}

function updateFileStatus(panel, idx, status) {
  if (state[panel].files[idx]) state[panel].files[idx].status = status;
  const el = document.getElementById(`fi-${panel}-${idx}`);
  if (!el) return;
  const labels = { pending: t('statusPending'), converting: t('statusConverting'), done: t('statusDone'), error: t('statusError') };
  el.querySelector('.file-status').className = `file-status ${status}`;
  el.querySelector('.file-status').textContent = labels[status];
}
function updateBtn(panel) {
  const btn = document.getElementById('btn-' + panel);
  if (btn) btn.disabled = state[panel].files.length === 0;
}

// ═══════════════════════════════
//  PROGRESS
// ═══════════════════════════════
function showProgress(panel, label) {
  document.getElementById('progress-' + panel).classList.add('visible');
  document.getElementById('progress-' + panel + '-lbl').textContent = label;
  setProgress(panel, 0);
}
function setProgress(panel, pct) {
  document.getElementById('progress-' + panel + '-fill').style.width = pct + '%';
  document.getElementById('progress-' + panel + '-pct').textContent = Math.round(pct) + '%';
}
function hideProgress(panel) { document.getElementById('progress-' + panel).classList.remove('visible'); }

// ═══════════════════════════════
//  TOAST
// ═══════════════════════════════
function showToast(msg, type = 'ok') {
  if (!document.getElementById('cfg-toasts').checked && type === 'ok') return;
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (type !== 'ok' ? ' ' + type : '');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.className = 'toast', 3500);
}

// ═══════════════════════════════
//  HELPERS
// ═══════════════════════════════
function downloadBlob(blob, filename) {
  if (!document.getElementById('cfg-autoDl').checked) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function baseName(name) { return name.replace(/\.[^.]+$/, ''); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function getQuality() { return parseInt(document.getElementById('cfg-quality').value) / 100; }
function getPdfScale() { return parseFloat(document.getElementById('cfg-pdfscale').value); }

// ═══════════════════════════════
//  CONVERT IMAGES
// ═══════════════════════════════
async function convertImages() {
  const files = state.img.files;
  const fmt = state.img.fmt;
  const ext = fmt === 'jpeg' ? 'jpg' : fmt;
  showProgress('img', t('statusConverting'));
  document.getElementById('btn-img').disabled = true;
  for (let i = 0; i < files.length; i++) {
    updateFileStatus('img', i, 'converting');
    setProgress('img', (i / files.length) * 100);
    try {
      const blob = await imageToFormat(files[i].file, fmt);
      downloadBlob(blob, baseName(files[i].name) + '.' + ext);
      updateFileStatus('img', i, 'done');
    } catch(e) { updateFileStatus('img', i, 'error'); }
    await sleep(100);
  }
  setProgress('img', 100);
  document.getElementById('btn-img').disabled = false;
  showToast(t('toastImgDone', files.length));
}

function imageToFormat(file, fmt) {
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
      c.toBlob(blob => blob ? resolve(blob) : reject(), 'image/' + fmt, getQuality());
    };
    img.onerror = reject; img.src = url;
  });
}

// ═══════════════════════════════
//  PDF → IMG
// ═══════════════════════════════
async function convertPdfToImg() {
  const files = state.pdf2img.files;
  const fmt = state.pdf2img.fmt;
  const ext = fmt === 'jpeg' ? 'jpg' : fmt;
  const scale = getPdfScale();
  showProgress('pdf2img', t('statusConverting'));
  document.getElementById('btn-pdf2img').disabled = true;
  for (let i = 0; i < files.length; i++) {
    updateFileStatus('pdf2img', i, 'converting');
    setProgress('pdf2img', (i / files.length) * 100);
    try {
      const buf = await files[i].file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const name = baseName(files[i].name);
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const vp = page.getViewport({ scale });
        const c = document.createElement('canvas');
        c.width = vp.width; c.height = vp.height;
        const ctx = c.getContext('2d');
        if (fmt === 'jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0,0,c.width,c.height); }
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        const blob = await new Promise(res => c.toBlob(res, 'image/' + fmt, getQuality()));
        const sfx = pdf.numPages > 1 ? `_p${p}` : '';
        downloadBlob(blob, `${name}${sfx}.${ext}`);
        await sleep(60);
      }
      updateFileStatus('pdf2img', i, 'done');
    } catch(e) { updateFileStatus('pdf2img', i, 'error'); }
    await sleep(120);
  }
  setProgress('pdf2img', 100);
  document.getElementById('btn-pdf2img').disabled = false;
  showToast(t('toastPdfDone'));
}

// ═══════════════════════════════
//  WORD → PDF
// ═══════════════════════════════
async function convertWordToPdf() {
  const files = state.word2pdf.files;
  showProgress('word2pdf', t('statusConverting'));
  document.getElementById('btn-word2pdf').disabled = true;
  for (let i = 0; i < files.length; i++) {
    updateFileStatus('word2pdf', i, 'converting');
    setProgress('word2pdf', 80);
    try {
      const buf = await files[i].file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: buf });
      const name = baseName(files[i].name);
      const win = window.open('', '_blank');
      win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${name}</title>
        <style>body{font-family:Georgia,serif;font-size:12pt;line-height:1.6;margin:2.5cm;color:#111}
        h1,h2,h3{font-family:Arial,sans-serif}img{max-width:100%}@media print{body{margin:0}}</style>
        </head><body>${result.value}</body></html>`);
      win.document.close();
      setTimeout(() => { win.print(); win.close(); }, 600);
      updateFileStatus('word2pdf', i, 'done');
    } catch(e) { updateFileStatus('word2pdf', i, 'error'); }
    await sleep(200);
  }
  setProgress('word2pdf', 100);
  document.getElementById('btn-word2pdf').disabled = false;
  showToast(t('toastWordDone'), 'warn');
}

// ═══════════════════════════════
//  VIDEO → GIF
// ═══════════════════════════════
async function convertVideoToGif() {
  const files = state.vid2gif.files;
  if (!files.length) return;
  const vid = document.getElementById('vid-preview');
  const start    = parseFloat(document.getElementById('gif-start').value) || 0;
  const duration = Math.min(parseFloat(document.getElementById('gif-duration').value) || 3, 15);
  const fps      = parseInt(document.getElementById('gif-fps').value) || 10;
  const width    = parseInt(document.getElementById('gif-width').value) || 480;
  const frameCount   = Math.ceil(duration * fps);
  const frameInterval = 1 / fps;

  showProgress('vid2gif', t('statusConverting'));
  document.getElementById('btn-vid2gif').disabled = true;
  document.getElementById('gif-result').style.display = 'none';
  updateFileStatus('vid2gif', 0, 'converting');

  const frames = [];
  const c = document.createElement('canvas');
  const ratio = vid.videoHeight / vid.videoWidth;
  c.width = width; c.height = Math.round(width * ratio);
  const ctx = c.getContext('2d');

  for (let i = 0; i < frameCount; i++) {
    await seekVideo(vid, start + i * frameInterval);
    ctx.drawImage(vid, 0, 0, c.width, c.height);
    frames.push(ctx.getImageData(0, 0, c.width, c.height));
    setProgress('vid2gif', (i / frameCount) * 75);
    await sleep(10);
  }

  setProgress('vid2gif', 80);
  const gifData = encodeGif(frames, c.width, c.height, Math.round(100 / fps));
  gifBlob = new Blob([gifData], { type: 'image/gif' });
  const url = URL.createObjectURL(gifBlob);
  document.getElementById('gif-output').src = url;
  document.getElementById('gif-result').style.display = 'block';

  setProgress('vid2gif', 100);
  updateFileStatus('vid2gif', 0, 'done');
  document.getElementById('btn-vid2gif').disabled = false;
  showToast(t('toastGifDone'));
}

function seekVideo(vid, time) {
  return new Promise(res => {
    vid.currentTime = time;
    vid.onseeked = () => { vid.onseeked = null; res(); };
  });
}

function downloadGif() {
  if (!gifBlob) return;
  const name = state.vid2gif.files[0]?.name || 'video';
  const url = URL.createObjectURL(gifBlob);
  const a = document.createElement('a');
  a.href = url; a.download = baseName(name) + '.gif'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// GIF Encoder
function encodeGif(frames, w, h, delay) {
  const buf = [];
  const push = (...bytes) => bytes.forEach(b => buf.push(b));
  const pushStr = s => { for (let i=0;i<s.length;i++) buf.push(s.charCodeAt(i)); };
  const pushU16 = n => { buf.push(n & 0xff, (n >> 8) & 0xff); };

  pushStr('GIF89a');
  pushU16(w); pushU16(h);
  push(0xf7, 0, 0);

  const palette = buildPalette(frames);
  palette.forEach(c => push(c[0], c[1], c[2]));

  pushStr('\x21\xff\x0bNETSCAPE2.0\x03\x01\x00\x00\x00');

  for (const frame of frames) {
    push(0x21, 0xf9, 0x04, 0x00);
    pushU16(delay);
    push(0x00, 0x00);
    push(0x2c);
    pushU16(0); pushU16(0); pushU16(w); pushU16(h);
    push(0x00);
    const indices = quantizeFrame(frame, palette);
    const lzw = lzwEncode(indices, 8);
    push(0x08);
    for (let i=0; i<lzw.length; i+=255) {
      const chunk = lzw.slice(i, i+255);
      push(chunk.length, ...chunk);
    }
    push(0x00);
  }
  push(0x3b);
  return new Uint8Array(buf);
}

function buildPalette(frames) {
  const palette = [];
  for (let r=0;r<8;r++) for (let g=0;g<8;g++) for (let b=0;b<4;b++) {
    palette.push([Math.round(r*255/7), Math.round(g*255/7), Math.round(b*255/3)]);
  }
  while (palette.length < 256) palette.push([0,0,0]);
  return palette.slice(0, 256);
}

function quantizeFrame(frame, palette) {
  const out = new Uint8Array(frame.width * frame.height);
  for (let i=0;i<frame.data.length;i+=4) {
    const r=frame.data[i], g=frame.data[i+1], b=frame.data[i+2];
    let best=0, bestD=Infinity;
    for (let j=0;j<palette.length;j++) {
      const dr=r-palette[j][0], dg=g-palette[j][1], db=b-palette[j][2];
      const d=dr*dr+dg*dg+db*db;
      if (d<bestD) { bestD=d; best=j; }
    }
    out[i>>2]=best;
  }
  return out;
}

function lzwEncode(indices, minCodeSize) {
  const out = [];
  const clearCode = 1 << minCodeSize;
  const eofCode = clearCode + 1;
  let codeSize = minCodeSize + 1, nextCode = eofCode + 1;
  const table = new Map();
  const initTable = () => {
    table.clear();
    for (let i=0;i<clearCode;i++) table.set(String(i), i);
    codeSize = minCodeSize + 1; nextCode = eofCode + 1;
  };
  let bits = 0, bitsLen = 0;
  const writeBits = code => {
    bits |= code << bitsLen; bitsLen += codeSize;
    while (bitsLen >= 8) { out.push(bits & 0xff); bits >>= 8; bitsLen -= 8; }
  };
  initTable();
  writeBits(clearCode);
  let buf = String(indices[0]);
  for (let i=1;i<indices.length;i++) {
    const next = buf + ',' + indices[i];
    if (table.has(next)) { buf = next; }
    else {
      writeBits(table.get(buf));
      if (nextCode < 4096) { table.set(next, nextCode++); if (nextCode > (1<<codeSize) && codeSize<12) codeSize++; }
      else { writeBits(clearCode); initTable(); }
      buf = String(indices[i]);
    }
  }
  writeBits(table.get(buf));
  writeBits(eofCode);
  if (bitsLen > 0) out.push(bits & 0xff);
  return out;
}

// ═══════════════════════════════
//  BACKGROUND REMOVER
// ═══════════════════════════════
async function removeBackgrounds() {
  const files = state.bgremove.files;
  const tolerance = parseInt(document.getElementById('bg-tolerance').value);
  const previews = document.getElementById('bg-previews');
  previews.innerHTML = '';
  showProgress('bgremove', t('statusConverting'));
  document.getElementById('btn-bgremove').disabled = true;
  for (let i=0; i<files.length; i++) {
    updateFileStatus('bgremove', i, 'converting');
    setProgress('bgremove', (i / files.length) * 100);
    try {
      const canvas = await removeBg(files[i].file, tolerance);
      const name = baseName(files[i].name);
      const wrap = document.createElement('div');
      wrap.className = 'bg-preview-item';
      wrap.style.animationDelay = i * 0.08 + 's';
      const label = document.createElement('div');
      label.className = 'preview-label';
      label.textContent = files[i].name;
      const dlBtn = document.createElement('button');
      dlBtn.className = 'preview-dl';
      dlBtn.textContent = 'DL';
      dlBtn.onclick = () => canvas.toBlob(b => { downloadBlob(b, name+'_nobg.png'); }, 'image/png');
      wrap.appendChild(canvas); wrap.appendChild(label); wrap.appendChild(dlBtn);
      previews.appendChild(wrap);
      canvas.toBlob(blob => { downloadBlob(blob, name + '_nobg.png'); }, 'image/png');
      updateFileStatus('bgremove', i, 'done');
    } catch(e) { updateFileStatus('bgremove', i, 'error'); }
    await sleep(80);
  }
  setProgress('bgremove', 100);
  document.getElementById('btn-bgremove').disabled = false;
  showToast(t('toastBgDone'));
}

function removeBg(file, tolerance) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imgData.data;
      const w = c.width, h = c.height;
      const corners = [
        [data[0],data[1],data[2]],
        [data[(w-1)*4],data[(w-1)*4+1],data[(w-1)*4+2]],
        [data[(h-1)*w*4],data[(h-1)*w*4+1],data[(h-1)*w*4+2]],
        [data[((h-1)*w+(w-1))*4],data[((h-1)*w+(w-1))*4+1],data[((h-1)*w+(w-1))*4+2]]
      ];
      const bgR = Math.round(corners.reduce((a,c)=>a+c[0],0)/4);
      const bgG = Math.round(corners.reduce((a,c)=>a+c[1],0)/4);
      const bgB = Math.round(corners.reduce((a,c)=>a+c[2],0)/4);
      const visited = new Uint8Array(w * h);
      const queue = [];
      const addCorner = (x,y) => { const idx=y*w+x; if(!visited[idx]){visited[idx]=1;queue.push(idx);} };
      addCorner(0,0); addCorner(w-1,0); addCorner(0,h-1); addCorner(w-1,h-1);
      const colorMatch = idx => {
        const p=idx*4;
        return Math.abs(data[p]-bgR)+Math.abs(data[p+1]-bgG)+Math.abs(data[p+2]-bgB)<tolerance*3;
      };
      let head=0;
      while(head<queue.length) {
        const idx=queue[head++];
        const x=idx%w, y=Math.floor(idx/w);
        for(const [nx,ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
          if(nx<0||nx>=w||ny<0||ny>=h) continue;
          const nIdx=ny*w+nx;
          if(!visited[nIdx]&&colorMatch(nIdx)){visited[nIdx]=1;queue.push(nIdx);}
        }
      }
      for(let i=0;i<w*h;i++){if(visited[i])data[i*4+3]=0;}
      for(let i=0;i<w*h;i++){
        if(!visited[i])continue;
        const x=i%w,y=Math.floor(i/w);
        [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].forEach(([nx,ny])=>{
          if(nx<0||nx>=w||ny<0||ny>=h)return;
          const ni=ny*w+nx;
          if(!visited[ni]&&data[ni*4+3]===255)data[ni*4+3]=180;
        });
      }
      ctx.putImageData(imgData,0,0);
      resolve(c);
    };
    img.onerror=reject; img.src=url;
  });
}

// ═══════════════════════════════
//  FAQ
// ═══════════════════════════════
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-question').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
}

// ═══════════════════════════════
//  INIT
// ═══════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  buildFaq();

  // Lang selector watcher
  document.getElementById('cfg-lang').addEventListener('change', function() {
    setLang(this.value);
  });
});


// Enhanced version
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
/* ════════════════════════════════════════════
   URL DOWNLOADER
════════════════════════════════════════════ */

let currentUrlData = null;
let urlHistory = JSON.parse(localStorage.getItem('convrt_url_history') || '[]');

const IMAGE_EXTS = ['jpg','jpeg','png','gif','webp','bmp','svg','avif','tiff','ico'];
const VIDEO_EXTS = ['mp4','webm','mov','avi','mkv','m4v','ogv','flv'];

function detectType(url) {
  const clean = url.split('?')[0].toLowerCase();
  const ext = clean.split('.').pop();
  if (IMAGE_EXTS.includes(ext)) return { type: 'image', ext };
  if (VIDEO_EXTS.includes(ext)) return { type: 'video', ext };
  // Intentar por headers o URL hints
  if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)/i)) return { type: 'image', ext: 'jpg' };
  if (url.match(/\.(mp4|webm|mov|avi|mkv|m4v)/i)) return { type: 'video', ext: 'mp4' };
  return { type: 'unknown', ext: '' };
}

function getFilenameFromUrl(url) {
  try {
    const parts = new URL(url).pathname.split('/');
    const name = parts[parts.length - 1];
    return name || 'descarga';
  } catch {
    return 'descarga';
  }
}

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function urlInputChanged() {
  document.getElementById('url-preview-box').classList.remove('visible');
  document.getElementById('url-cors-notice').classList.remove('visible');
  document.getElementById('url-dl-status').textContent = '';
  currentUrlData = null;
}

async function fetchUrl() {
  const input = document.getElementById('url-input');
  const url = input.value.trim();
  if (!url) return;

  const fetchBtn = document.getElementById('url-fetch-btn');
  const previewBox = document.getElementById('url-preview-box');
  const corsNotice = document.getElementById('url-cors-notice');
  const metaEl = document.getElementById('url-meta');
  const mediaWrap = document.getElementById('url-media-wrap');
  const dlStatus = document.getElementById('url-dl-status');

  // Reset
  previewBox.classList.remove('visible');
  corsNotice.classList.remove('visible');
  mediaWrap.innerHTML = '';
  metaEl.innerHTML = '';
  dlStatus.textContent = '';
  currentUrlData = null;

  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Cargando...';

  const { type, ext } = detectType(url);
  const filename = getFilenameFromUrl(url);

  try {
    const response = await fetch(url, { mode: 'cors' });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const detectedType = blob.type || '';
    const isImage = detectedType.startsWith('image/') || type === 'image';
    const isVideo = detectedType.startsWith('video/') || type === 'video';
    const finalType = isImage ? 'image' : isVideo ? 'video' : type;

    currentUrlData = { blob, objectUrl, filename, type: finalType, size: blob.size, mime: detectedType };

    // Meta info
    metaEl.innerHTML = `
      <div class="url-meta-row">
        <span class="url-meta-label">Tipo</span>
        <span class="url-type-badge ${finalType}">${finalType === 'image' ? '🖼 Imagen' : finalType === 'video' ? '🎬 Video' : '❓ Desconocido'}</span>
      </div>
      <div class="url-meta-row">
        <span class="url-meta-label">Tamaño</span>
        <span class="url-meta-value">${formatBytes(blob.size)}</span>
      </div>
      <div class="url-meta-row">
        <span class="url-meta-label">Formato</span>
        <span class="url-meta-value">${detectedType || ext || '—'}</span>
      </div>
      <div class="url-meta-row">
        <span class="url-meta-label">Archivo</span>
        <span class="url-meta-value">${filename}</span>
      </div>
    `;

    // Preview
    if (isImage) {
      const img = document.createElement('img');
      img.src = objectUrl;
      img.className = 'url-preview-media';
      img.alt = filename;
      mediaWrap.appendChild(img);
    } else if (isVideo) {
      const video = document.createElement('video');
      video.src = objectUrl;
      video.className = 'url-preview-media';
      video.controls = true;
      mediaWrap.appendChild(video);
    }

    previewBox.classList.add('visible');

    // Guardar en historial
    addToHistory(url, finalType);

  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      corsNotice.classList.add('visible');

      // Intentar carga como elemento (para preview aunque no se pueda descargar)
      const { type: t } = detectType(url);
      if (t === 'image') {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'url-preview-media';
        img.alt = filename;
        img.onload = () => {
          metaEl.innerHTML = `
            <div class="url-meta-row">
              <span class="url-meta-label">Tipo</span>
              <span class="url-type-badge image">🖼 Imagen</span>
            </div>
            <div class="url-meta-row">
              <span class="url-meta-label">Archivo</span>
              <span class="url-meta-value">${filename}</span>
            </div>
            <div class="url-meta-row" style="color:var(--warn)">
              <span class="url-meta-label">Nota</span>
              <span>Solo preview — descarga bloqueada por CORS</span>
            </div>
          `;
          mediaWrap.appendChild(img);
          previewBox.classList.add('visible');
          currentUrlData = { url, filename, type: 'image', corsBlocked: true };
        };
        img.onerror = () => {
          showToast('No se pudo cargar el recurso', 'error');
        };
      } else {
        showToast('No se pudo acceder al recurso (CORS)', 'error');
      }
    } else {
      showToast(`Error: ${err.message}`, 'error');
    }
  }

  fetchBtn.disabled = false;
  fetchBtn.textContent = 'Cargar →';
}

async function downloadFromUrl() {
  if (!currentUrlData) return;
  const dlBtn = document.getElementById('url-dl-btn');
  const dlStatus = document.getElementById('url-dl-status');

  if (currentUrlData.corsBlocked) {
    // Intentar con anchor en nueva tab
    const a = document.createElement('a');
    a.href = currentUrlData.url;
    a.download = currentUrlData.filename;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
    dlStatus.textContent = 'Abierto en nueva pestaña';
    return;
  }

  dlBtn.textContent = 'Descargando...';
  dlBtn.style.opacity = '0.6';

  try {
    const a = document.createElement('a');
    a.href = currentUrlData.objectUrl;
    a.download = currentUrlData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    dlStatus.textContent = `✓ ${formatBytes(currentUrlData.size)} descargados`;
    dlStatus.style.color = 'var(--ok)';
    showToast(`Descargado: ${currentUrlData.filename}`);
  } catch (err) {
    showToast('Error al descargar', 'error');
    dlStatus.textContent = 'Error al descargar';
    dlStatus.style.color = 'var(--hot)';
  }

  dlBtn.textContent = '↓ Descargar';
  dlBtn.style.opacity = '1';
}

function addToHistory(url, type) {
  urlHistory = urlHistory.filter(h => h.url !== url);
  urlHistory.unshift({ url, type, ts: Date.now() });
  if (urlHistory.length > 8) urlHistory = urlHistory.slice(0, 8);
  try { localStorage.setItem('convrt_url_history', JSON.stringify(urlHistory)); } catch {}
  renderHistory();
}

function renderHistory() {
  const wrap = document.getElementById('url-history');
  const list = document.getElementById('url-history-list');
  if (!urlHistory.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';
  list.innerHTML = urlHistory.map(h => `
    <div class="url-history-item" onclick="loadFromHistory('${h.url.replace(/'/g,"\\'")}')">
      <span class="hist-type">${h.type === 'image' ? '🖼' : h.type === 'video' ? '🎬' : '🔗'}</span>
      <span class="hist-url">${h.url}</span>
    </div>
  `).join('');
}

function loadFromHistory(url) {
  document.getElementById('url-input').value = url;
  fetchUrl();
}

// Renderizar historial al cargar el panel
document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
});
