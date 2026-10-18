'use strict';

(() => {
  const root = document.documentElement;
  let language = 'es';
  try { language = localStorage.getItem('antoni-language') === 'en' ? 'en' : 'es'; } catch (_) {}

  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'es';
    root.lang = language;
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
      const value = element.dataset[language];
      if (element.dataset.i18nAttr) element.setAttribute(element.dataset.i18nAttr, value);
      else element.textContent = value;
    });
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    document.querySelectorAll('.brand[aria-label]').forEach(brand => brand.setAttribute('aria-label', language === 'es' ? 'Antoni Tech · Inicio' : 'Antoni Tech · Home'));
    try { localStorage.setItem('antoni-language', language); } catch (_) {}
    const formStatus = document.getElementById('form-status');
    if (formStatus) formStatus.textContent = '';
    document.querySelectorAll('[data-whatsapp]').forEach(link => {
      link.href = language === 'es' ? link.dataset.urlEs : link.dataset.urlEn;
    });
    updateFilterStatus();
    updateMotionLabel();
  }

  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));

  const videoDialog = document.getElementById('video-dialog');
  const video = document.getElementById('brand-video');
  let lastVideoTrigger = null;
  document.querySelectorAll('.video-trigger').forEach(trigger => trigger.addEventListener('click', () => {
    lastVideoTrigger = trigger;
    videoDialog.showModal();
    document.body.classList.add('modal-open');
    video.currentTime = 0;
    video.play().catch(() => {});
  }));
  videoDialog.querySelector('.video-close').addEventListener('click', () => videoDialog.close());
  videoDialog.addEventListener('click', event => {
    if (event.target === videoDialog) {
      const box = videoDialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) videoDialog.close();
    }
  });
  videoDialog.addEventListener('close', () => {
    video.pause();
    document.body.classList.remove('modal-open');
    lastVideoTrigger?.focus();
  });

  const motionButton = document.querySelector('.motion-toggle');
  const hero = document.querySelector('.hero');
  const slideButtons = [...document.querySelectorAll('[data-slide]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [
    { eyebrow: ['DESARROLLO WEB · DISEÑO · TECNOLOGÍA', 'WEB DEVELOPMENT · DESIGN · TECHNOLOGY'],
      es: ['DISEÑO.', 'CÓDIGO.', 'IMPACTO.'], en: ['DESIGN.', 'CODE.', 'IMPACT.'],
      description: ['Webs, apps móviles y software a medida para dar forma a tu próximo proyecto.', 'Websites, mobile apps and custom software to bring your next project to life.'] },
    { eyebrow: ['WEBS · TIENDAS ONLINE · DISEÑO A MEDIDA', 'WEBSITES · ONLINE STORES · CUSTOM DESIGN'],
      es: ['TU WEB.', 'TU MARCA.', 'TU ESTILO.'], en: ['YOUR WEB.', 'YOUR BRAND.', 'YOUR STYLE.'],
      description: ['Una web a tu medida, pensada para presentar tu negocio y conectar con tus clientes.', 'A website tailored to you, designed to introduce your business and connect with your customers.'] },
    { eyebrow: ['APPS MÓVILES · SOFTWARE · AUTOMATIZACIÓN', 'MOBILE APPS · SOFTWARE · AUTOMATION'],
      es: ['CONECTA.', 'OPTIMIZA.', 'AVANZA.'], en: ['CONNECT.', 'SIMPLIFY.', 'GROW.'],
      description: ['Aplicaciones web y móviles, software e integraciones para simplificar el trabajo de tu negocio.', 'Web and mobile apps, software and integrations to simplify the way your business works.'] }
  ];
  let activeSlide = 0;
  let slideshowTimer = null;
  let paused = reducedMotion.matches;
  function updateMotionLabel() {
    if (!motionButton) return;
    const label = language === 'es'
      ? (paused ? 'REANUDAR PRESENTACIÓN' : 'PAUSAR PRESENTACIÓN')
      : (paused ? 'RESUME SLIDESHOW' : 'PAUSE SLIDESHOW');
    motionButton.querySelector('.sr-only').textContent = label;
    motionButton.lastElementChild.textContent = paused ? '▷' : 'Ⅱ';
    motionButton.setAttribute('aria-label', label);
    motionButton.setAttribute('aria-pressed', String(paused));
    document.body.classList.toggle('motion-paused', paused);
  }
  function writeSlideText(element, es, en) {
    element.dataset.es = es;
    element.dataset.en = en;
    element.textContent = language === 'es' ? es : en;
  }
  function renderSlide(index, announce = false) {
    if (!hero) return;
    activeSlide = (index + slides.length) % slides.length;
    const slide = slides[activeSlide];
    writeSlideText(hero.querySelector('[data-hero-eyebrow]'), ...slide.eyebrow);
    hero.querySelectorAll('[data-hero-line]').forEach((line, i) => writeSlideText(line, slide.es[i], slide.en[i]));
    writeSlideText(hero.querySelector('[data-hero-description]'), ...slide.description);
    slideButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeSlide)));
    if (announce) document.getElementById('slide-status').textContent = language === 'es'
      ? `Presentación ${activeSlide + 1} de 3: ${slide.es.join(' ')}`
      : `Slide ${activeSlide + 1} of 3: ${slide.en.join(' ')}`;
  }
  function scheduleSlideshow() {
    window.clearInterval(slideshowTimer);
    slideshowTimer = null;
    if (hero && !paused && !document.hidden) slideshowTimer = window.setInterval(() => renderSlide(activeSlide + 1), 8000);
  }
  function setPaused(next) {
    paused = next;
    updateMotionLabel();
    scheduleSlideshow();
  }
  motionButton?.addEventListener('click', () => {
    const next = !paused;
    setPaused(next);
    document.body.classList.toggle('logo-paused', next);
  });
  slideButtons.forEach(button => button.addEventListener('click', () => {
    setPaused(true);
    renderSlide(Number(button.dataset.slide), true);
  }));
  hero?.addEventListener('focusin', event => {
    if (!motionButton.contains(event.target)) setPaused(true);
  });
  hero?.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setPaused(true);
  });
  document.addEventListener('visibilitychange', scheduleSlideshow);
  reducedMotion.addEventListener('change', event => setPaused(event.matches));

  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.all-work .project-card')];
  function updateFilterStatus() {
    const status = document.getElementById('filter-status');
    if (!status) return;
    const count = cards.filter(card => !card.hidden).length;
    status.textContent = language === 'es' ? `${count} proyectos visibles` : `${count} projects shown`;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
    updateFilterStatus();
  }));

  const form = document.getElementById('contact-form');
  if (form) {
    const requestedService = new URLSearchParams(window.location.search).get('servicio');
    const service = form.elements.namedItem('service');
    if ([...service.options].some(option => option.value === requestedService)) service.value = requestedService;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const name = form.elements.namedItem('name').value.trim();
      const email = form.elements.namedItem('email').value.trim();
      const message = form.elements.namedItem('message').value.trim();
      if (!name || message.length < 10) {
        document.getElementById('form-status').textContent = language === 'es' ? 'Añade tu nombre y al menos diez caracteres sobre tu proyecto.' : 'Add your name and at least ten characters about your project.';
        return;
      }
      const serviceName = service.selectedOptions[0].textContent;
      const subject = language === 'es' ? `Nuevo proyecto: ${serviceName}` : `New project: ${serviceName}`;
      const body = language === 'es'
        ? `Hola, Yonathan.\n\nSoy ${name}.\nCorreo: ${email}\nServicio: ${serviceName}\n\n${message}\n\nEnviado desde Antoni Tech.`
        : `Hi Yonathan,\n\nI’m ${name}.\nEmail: ${email}\nService: ${serviceName}\n\n${message}\n\nSent from Antoni Tech.`;
      const whatsapp = event.submitter?.value === 'whatsapp';
      const destination = whatsapp
        ? `https://wa.me/34635977484?text=${encodeURIComponent(body)}`
        : `mailto:techantoni380@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      document.getElementById('form-status').textContent = language === 'es'
        ? `Tu mensaje está preparado. Revisa y confirma el envío en ${whatsapp ? 'WhatsApp' : 'tu aplicación de correo'}.`
        : `Your message is ready. Review and confirm sending in ${whatsapp ? 'WhatsApp' : 'your email app'}.`;
      if (whatsapp) window.open(destination, '_blank', 'noopener,noreferrer');
      else window.location.href = destination;
    });
  }
  setLanguage(language);
  scheduleSlideshow();
})();
