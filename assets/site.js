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
    updateGalleryStatus();
    brandPlayers.forEach(player => player.refreshCaption());
  }

  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));

  // Keep each iframe in its original DOM position so browsing survives expansion.
  document.querySelectorAll('.project-browser').forEach(browser => {
    const slot = browser.parentElement;
    const viewport = browser.querySelector('.browser-viewport');
    const frame = browser.querySelector('iframe');
    const toggle = browser.querySelector('.browser-expand');
    let expanded = false;

    function fitPreview() {
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      if (!width || !height) return;
      const pageWidth = expanded ? width : Math.max(1100, width);
      const scale = width / pageWidth;
      frame.style.width = `${pageWidth}px`;
      frame.style.height = `${Math.ceil(height / scale)}px`;
      frame.style.transform = `scale(${scale})`;
    }

    function setExpanded(next) {
      if (next === expanded) return;
      if (next) slot.style.height = `${browser.getBoundingClientRect().height}px`;
      // Changing dialog mode never moves, replaces or reloads the live iframe.
      browser.close();
      expanded = next;
      browser.classList.toggle('is-expanded', expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
      document.body.classList.toggle('project-preview-open', expanded);
      if (expanded) browser.showModal();
      else {
        browser.show();
        slot.style.height = '';
      }
      fitPreview();
      toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', () => setExpanded(!expanded));
    browser.addEventListener('cancel', event => {
      event.preventDefault();
      setExpanded(false);
    });
    browser.addEventListener('click', event => {
      if (!expanded || event.target !== browser) return;
      const box = browser.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setExpanded(false);
    });
    if ('ResizeObserver' in window) new ResizeObserver(fitPreview).observe(viewport);
    window.addEventListener('resize', fitPreview);
    fitPreview();
  });

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
  const heroVideo = hero?.querySelector('.hero-film');
  const heroFilmLayer = hero?.querySelector('.hero-film-layer');
  const heroServicesImage = hero?.querySelector('.hero-services-art');
  const heroSound = hero?.querySelector('.hero-sound');
  const heroStart = hero?.querySelector('.hero-film-start');
  const slides = [
    { eyebrow: ['ANTONI TECH · EN MOVIMIENTO', 'ANTONI TECH · IN MOTION'],
      es: ['TU IDEA.', 'EN', 'ACCIÓN.'], en: ['YOUR IDEA.', 'IN', 'MOTION.'],
      description: ['Webs, apps y software a medida para empresas de España y otros países.', 'Custom websites, apps and software for businesses in Spain and internationally.'] },
    { eyebrow: ['DESARROLLO WEB · DISEÑO · TECNOLOGÍA', 'WEB DEVELOPMENT · DESIGN · TECHNOLOGY'],
      es: ['DISEÑO.', 'CÓDIGO.', 'IMPACTO.'], en: ['DESIGN.', 'CODE.', 'IMPACT.'],
      description: ['Webs, apps móviles y software a medida para dar forma a tu próximo proyecto.', 'Websites, mobile apps and custom software to bring your next project to life.'] },
    { eyebrow: ['SOLUCIONES DIGITALES · FREELANCE', 'DIGITAL SOLUTIONS · FREELANCE'],
      es: ['WEB.', 'APPS.', 'SOFTWARE.'], en: ['WEB.', 'APPS.', 'SOFTWARE.'],
      description: ['Diseño y desarrollo soluciones digitales a medida para tu negocio.', 'I design and develop digital solutions tailored to your business.'] }
  ];
  let activeSlide = 0;
  let slideshowTimer = null;
  let imageRemaining = 8000;
  let imageTimerStartedAt = null;
  let paused = reducedMotion.matches || Boolean(navigator.connection?.saveData);
  let heroVisible = true;
  let videoFailed = false;
  let playbackRequest = 0;

  function updateHeroSound() {
    if (!heroSound) return;
    const label = language === 'es'
      ? (heroVideo.muted ? 'Activar sonido' : 'Silenciar')
      : (heroVideo.muted ? 'Enable sound' : 'Mute');
    heroSound.querySelector('[data-hero-sound-label]').textContent = label;
    heroSound.setAttribute('aria-label',label);
    heroSound.setAttribute('aria-pressed',String(!heroVideo.muted));
  }
  function updateMotionLabel() {
    if (!motionButton) return;
    const label = language === 'es'
      ? (paused ? 'REANUDAR PRESENTACIÓN' : 'PAUSAR PRESENTACIÓN')
      : (paused ? 'RESUME SLIDESHOW' : 'PAUSE SLIDESHOW');
    motionButton.querySelector('.sr-only').textContent = label;
    motionButton.lastElementChild.textContent = ['I','II','III'][activeSlide];
    motionButton.title = label;
    motionButton.setAttribute('aria-label', label);
    motionButton.setAttribute('aria-pressed', String(paused));
    document.body.classList.toggle('motion-paused', paused);
    updateHeroSound();
  }
  function writeSlideText(element, es, en) {
    element.dataset.es = es;
    element.dataset.en = en;
    element.textContent = language === 'es' ? es : en;
  }
  function clearImageTimer(preserve = true) {
    window.clearTimeout(slideshowTimer);
    slideshowTimer = null;
    if (preserve && imageTimerStartedAt !== null) {
      imageRemaining = Math.max(0,imageRemaining - (performance.now() - imageTimerStartedAt));
    }
    imageTimerStartedAt = null;
  }
  function syncHeroLayout() {
    if (!hero) return;
    const bottom = hero.querySelector('.hero-bottom');
    hero.style.setProperty('--hero-footer-height',`${bottom.offsetHeight}px`);
  }
  function renderSlide(index, announce = false) {
    if (!hero) return;
    clearImageTimer(false);
    playbackRequest++;
    heroVideo.pause();
    activeSlide = (index + slides.length) % slides.length;
    if (activeSlide === 0 && videoFailed) activeSlide = 1;
    imageRemaining = 8000;
    const film = activeSlide === 0;
    hero.classList.toggle('is-film',film);
    hero.classList.toggle('is-services',activeSlide === 2);
    document.body.classList.toggle('hero-light',activeSlide === 2);
    heroFilmLayer.inert = !film;
    heroFilmLayer.setAttribute('aria-hidden',String(!film));
    heroServicesImage.setAttribute('aria-hidden',String(activeSlide !== 2));
    heroStart.hidden = true;
    if (film) { try { heroVideo.currentTime = 0; } catch (_) {} }
    const slide = slides[activeSlide];
    writeSlideText(hero.querySelector('[data-hero-eyebrow]'), ...slide.eyebrow);
    hero.querySelectorAll('[data-hero-line]').forEach((line, i) => writeSlideText(line, slide.es[i], slide.en[i]));
    writeSlideText(hero.querySelector('[data-hero-description]'), ...slide.description);
    slideButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeSlide)));
    updateMotionLabel();
    if (announce) document.getElementById('slide-status').textContent = language === 'es'
      ? `Presentación ${activeSlide + 1} de 3: ${slide.es.join(' ')}`
      : `Slide ${activeSlide + 1} of 3: ${slide.en.join(' ')}`;
    syncHeroLayout();
    scheduleSlideshow();
  }
  function scheduleSlideshow() {
    clearImageTimer(true);
    const request = ++playbackRequest;
    if (!hero || paused || document.hidden || !heroVisible) {
      heroVideo?.pause();
      return;
    }
    if (activeSlide === 0) {
      if (heroVideo.ended) { renderSlide(1); return; }
      heroVideo.play().then(() => {
        if (request !== playbackRequest) return;
        heroStart.hidden = true;
      }).catch(() => {
        if (request !== playbackRequest || activeSlide !== 0) return;
        paused = true;
        heroStart.hidden = false;
        updateMotionLabel();
      });
      return; // Only the ended event advances the film, never an 8-second timer.
    }
    imageTimerStartedAt = performance.now();
    slideshowTimer = window.setTimeout(() => {
      slideshowTimer = null;
      imageTimerStartedAt = null;
      renderSlide(activeSlide + 1);
    },imageRemaining);
  }
  function setPaused(next) {
    paused = next;
    updateMotionLabel();
    scheduleSlideshow();
  }
  motionButton?.addEventListener('click', () => {
    const next = !paused;
    setPaused(next);
    document.body.classList.toggle('logo-paused',next);
  });
  slideButtons.forEach(button => button.addEventListener('click', () => {
    paused = false;
    updateMotionLabel();
    renderSlide(Number(button.dataset.slide),true);
  }));
  hero?.addEventListener('focusin',event => {
    if (!event.target.closest('.hero-controls,.hero-film-layer')) setPaused(true);
  });
  document.addEventListener('visibilitychange',scheduleSlideshow);
  reducedMotion.addEventListener('change',event => { if (event.matches) setPaused(true); });
  window.addEventListener('resize',syncHeroLayout);
  heroSound?.addEventListener('click',() => {
    heroVideo.muted = !heroVideo.muted;
    updateHeroSound();
  });
  heroStart?.addEventListener('click',() => setPaused(false));
  if (heroVideo) {
    heroVideo.controls = false;
    heroVideo.loop = false;
    heroVideo.addEventListener('ended',() => {
      if (activeSlide === 0 && !paused && !document.hidden && heroVisible) renderSlide(1);
    });
    heroVideo.addEventListener('error',() => {
      videoFailed = true;
      if (activeSlide === 0) renderSlide(1,true);
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      scheduleSlideshow();
    },{threshold:.15}).observe(hero);
    if ('ResizeObserver' in window) new ResizeObserver(syncHeroLayout).observe(hero.querySelector('.hero-bottom'));
    syncHeroLayout();
  }

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

  // The gallery moves only on request; live iframe browsing is never interrupted.
  const projectGallery = document.getElementById('project-gallery');
  const galleryCards = projectGallery ? [...projectGallery.querySelectorAll('.project-card')] : [];
  const galleryPrevious = document.querySelector('[data-project-prev]');
  const galleryNext = document.querySelector('[data-project-next]');
  function galleryState() {
    const visible = Number(getComputedStyle(projectGallery).getPropertyValue('--gallery-visible')) || 1;
    const step = galleryCards.length > 1 ? galleryCards[1].offsetLeft - galleryCards[0].offsetLeft : projectGallery.clientWidth;
    const lastStart = Math.max(0, galleryCards.length - visible);
    const first = Math.max(0, Math.min(lastStart, Math.round(projectGallery.scrollLeft / Math.max(1, step))));
    return { first, visible, lastStart };
  }
  function updateGalleryStatus() {
    if (!projectGallery || !galleryCards.length) return;
    const { first, visible, lastStart } = galleryState();
    const last = Math.min(first + visible, galleryCards.length);
    galleryPrevious.disabled = first === 0;
    galleryNext.disabled = first === lastStart;
    const startText = String(first + 1).padStart(2, '0');
    const endText = String(last).padStart(2, '0');
    document.querySelector('[data-project-range]').textContent = first + 1 === last ? startText : `${startText}–${endText}`;
    const status = document.getElementById('gallery-status');
    const description = language === 'es'
      ? `Proyectos ${first + 1}${last > first + 1 ? ` a ${last}` : ''} de ${galleryCards.length}.`
      : `Projects ${first + 1}${last > first + 1 ? ` to ${last}` : ''} of ${galleryCards.length}.`;
    if (status.textContent !== description) status.textContent = description;
  }
  function moveGallery(direction) {
    const { first, lastStart } = galleryState();
    const target = direction === 'first' ? 0 : direction === 'last' ? lastStart : Math.max(0, Math.min(lastStart, first + direction));
    projectGallery.scrollTo({
      left: galleryCards[target].offsetLeft - galleryCards[0].offsetLeft,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  }
  if (projectGallery && galleryCards.length) {
    galleryPrevious.addEventListener('click', () => moveGallery(-1));
    galleryNext.addEventListener('click', () => moveGallery(1));
    let galleryFrame = null;
    projectGallery.addEventListener('scroll', () => {
      if (galleryFrame !== null) return;
      galleryFrame = requestAnimationFrame(() => { galleryFrame = null; updateGalleryStatus(); });
    }, { passive: true });
    projectGallery.addEventListener('keydown', event => {
      if (event.target !== projectGallery) return;
      const direction = { ArrowLeft: -1, ArrowRight: 1, Home: 'first', End: 'last' }[event.key];
      if (direction === undefined) return;
      event.preventDefault();
      moveGallery(direction);
    });
    if ('ResizeObserver' in window) new ResizeObserver(updateGalleryStatus).observe(projectGallery);
    window.addEventListener('resize', updateGalleryStatus);
    updateGalleryStatus();
  }

  // Only the current brand film loads; manual pause survives scrolling away.
  const brandPlayers = [...document.querySelectorAll('[data-brand-showreel]')].map(figure => {
    const video = figure.querySelector('video');
    const clips = [...figure.querySelectorAll('[data-brand-playlist] a')];
    const title = figure.querySelector('[data-brand-title]');
    const count = figure.querySelector('[data-brand-count]');
    const notice = figure.querySelector('[data-brand-notice]');
    const playButton = figure.querySelector('[data-brand-play]');
    const soundButton = figure.querySelector('[data-brand-sound]');
    const fullscreenButton = figure.querySelector('[data-brand-fullscreen]');
    let index = 0;
    let visible = !('IntersectionObserver' in window);
    let wantsPlayback = !reducedMotion.matches && !navigator.connection?.saveData;
    let ignoredPauseEvents = 0;
    let revision = 0;
    video.loop = false;
    video.muted = true;
    video.controls = false;
    figure.querySelector('[data-brand-toolbar]').hidden = false;
    fullscreenButton.hidden = !figure.requestFullscreen || !document.fullscreenEnabled;

    function refreshControls() {
      const playing = !video.paused && !video.ended;
      const silent = video.muted || video.volume === 0;
      const fullscreen = document.fullscreenElement === figure;
      playButton.dataset.playing = String(playing);
      playButton.setAttribute('aria-label', language === 'es' ? (playing ? 'Pausar vídeo' : 'Reproducir vídeo') : (playing ? 'Pause video' : 'Play video'));
      soundButton.dataset.muted = String(silent);
      soundButton.setAttribute('aria-pressed', String(!silent));
      soundButton.setAttribute('aria-label', language === 'es' ? (silent ? 'Activar sonido' : 'Silenciar vídeo') : (silent ? 'Turn sound on' : 'Mute video'));
      fullscreenButton.setAttribute('aria-label', language === 'es' ? (fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa') : (fullscreen ? 'Exit fullscreen' : 'Fullscreen'));
    }
    function refreshCaption() {
      title.textContent = clips[index].dataset[language];
      count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(clips.length).padStart(2, '0')}`;
      refreshControls();
    }
    function pauseInternally() {
      if (!video.paused) {
        ignoredPauseEvents += 1;
        video.pause();
      }
    }
    function playIfVisible() {
      if (!wantsPlayback || !visible || document.hidden) return;
      const attempt = revision;
      const playing = video.play();
      playing?.catch(error => {
        // Autoplay restrictions leave the custom Play button available.
        if (attempt === revision && error.name === 'NotAllowedError') {
          wantsPlayback = false;
          refreshControls();
        }
      });
    }
    function selectClip(next, fromUser = false) {
      pauseInternally();
      revision += 1;
      index = (next + clips.length) % clips.length;
      if (fromUser) wantsPlayback = true;
      notice.hidden = true;
      video.src = clips[index].href;
      video.load();
      refreshCaption();
      playIfVisible();
    }
    video.addEventListener('play', () => {
      wantsPlayback = true;
      if (!visible || document.hidden) pauseInternally();
      refreshControls();
    });
    video.addEventListener('pause', () => {
      if (ignoredPauseEvents > 0) ignoredPauseEvents -= 1;
      else if (!video.ended) wantsPlayback = false;
      refreshControls();
    });
    video.addEventListener('ended', () => selectClip(index + 1));
    video.addEventListener('error', () => {
      wantsPlayback = false;
      notice.hidden = false;
      pauseInternally();
    });
    figure.querySelector('[data-brand-prev]').addEventListener('click', () => selectClip(index - 1, true));
    figure.querySelector('[data-brand-next]').addEventListener('click', () => selectClip(index + 1, true));
    playButton.addEventListener('click', () => {
      if (video.paused || video.ended) {
        wantsPlayback = true;
        playIfVisible();
      } else {
        wantsPlayback = false;
        video.pause();
      }
      refreshControls();
    });
    soundButton.addEventListener('click', () => {
      const silent = video.muted || video.volume === 0;
      if (video.volume === 0) video.volume = 1;
      video.muted = !silent;
      refreshControls();
    });
    video.addEventListener('volumechange', refreshControls);
    document.addEventListener('fullscreenchange', refreshControls);
    fullscreenButton.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement === figure) await document.exitFullscreen();
        else await figure.requestFullscreen();
      } catch (_) { /* The player remains usable if fullscreen is unavailable. */ }
      refreshControls();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) playIfVisible();
        else pauseInternally();
      }, { threshold: 0 }).observe(video);
    } else playIfVisible();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseInternally();
      else playIfVisible();
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        wantsPlayback = false;
        pauseInternally();
      }
    });
    refreshCaption();
    return { refreshCaption };
  });

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
  renderSlide(0);
})();
