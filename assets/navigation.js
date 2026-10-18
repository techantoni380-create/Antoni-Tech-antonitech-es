'use strict';

(() => {
  const header = document.querySelector('[data-adaptive-header]');
  if (!header) return;
  const root = document.documentElement;
  const bar = header.querySelector('.navigation-bar');
  const nav = header.querySelector('.primary-nav');
  const toggle = header.querySelector('.nav-toggle');
  const compactBrand = header.querySelector('.compact-brand');
  const fullBrand = header.querySelector('.header-top .brand');
  const actions = header.querySelector('.compact-actions');
  const upperRows = [...header.children].filter(row => row !== bar);
  const mobile = window.matchMedia('(max-width: 960px)');
  let compact = false;
  let menuOpen = false;
  let frame = 0;

  function setMenu(open, returnFocus = false) {
    menuOpen = Boolean(open && compact && mobile.matches);
    header.classList.toggle('menu-open', menuOpen);
    toggle.setAttribute('aria-expanded', String(menuOpen));
    if (returnFocus && compact && mobile.matches) toggle.focus({preventScroll:true});
  }

  function update() {
    frame = 0;
    // Separate thresholds keep touchpad movement near the top from flickering.
    const next = compact ? window.scrollY > 8 : window.scrollY > 32;
    if (next === compact) return;
    const focused = document.activeElement;
    const focusInUpperRows = upperRows.some(row => row.contains(focused));
    const focusInCompactControls = compactBrand.contains(focused) || actions.contains(focused);
    compact = next;
    header.classList.toggle('is-compact', compact);
    upperRows.forEach(row => {
      row.inert = compact;
      if (compact) row.setAttribute('aria-hidden','true');
      else row.removeAttribute('aria-hidden');
    });
    if (!compact) {
      setMenu(false);
      if (focusInCompactControls) fullBrand.focus({preventScroll:true});
    } else {
      if (focusInUpperRows) compactBrand.focus({preventScroll:true});
      if (mobile.matches && nav.contains(focused)) setMenu(true);
    }
  }

  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function measure() {
    // Transforming the header preserves these dimensions and the page position.
    root.style.setProperty('--header-full-height', `${header.offsetHeight}px`);
    root.style.setProperty('--header-lift', `${bar.offsetTop}px`);
    root.style.setProperty('--nav-row-height', `${bar.offsetHeight}px`);
    update();
  }

  toggle.addEventListener('click', () => {
    setMenu(!menuOpen);
    if (menuOpen) nav.querySelector('a')?.focus({preventScroll:true});
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false, menuOpen);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuOpen) {
      event.preventDefault();
      setMenu(false, true);
    }
  });
  document.addEventListener('pointerdown', event => {
    if (menuOpen && !header.contains(event.target)) setMenu(false, true);
  });
  document.addEventListener('focusin', event => {
    if (!header.contains(event.target)) setMenu(false);
    // Keep keyboard targets visible below the compact bar. Modal dialogs have
    // their own top layer and scrolling, so leave their focus management alone.
    if (!compact || header.contains(event.target) || event.target.closest('dialog')) return;
    requestAnimationFrame(() => {
      if (document.activeElement !== event.target) return;
      const box = event.target.getBoundingClientRect();
      const bottom = header.getBoundingClientRect().bottom;
      if (box.top < bottom + 12 && box.bottom > 0) {
        window.scrollBy({top:box.top - bottom - 12,behavior:'instant'});
      }
    });
  });
  mobile.addEventListener('change', () => {
    const focused = document.activeElement;
    if (mobile.matches && compact && nav.contains(focused)) setMenu(true);
    else {
      setMenu(false);
      if (!mobile.matches && focused === toggle) nav.querySelector('a')?.focus({preventScroll:true});
    }
    measure();
  });
  window.addEventListener('scroll', scheduleUpdate, {passive:true});
  window.addEventListener('resize', measure);
  window.addEventListener('pageshow', measure);
  measure();
  root.classList.add('has-adaptive-header');
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(header);
  document.fonts?.ready.then(measure);
})();
