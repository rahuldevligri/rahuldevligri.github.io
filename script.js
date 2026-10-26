(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('#main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        menuButton.focus();
      }
    });
  }

  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-project]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter || 'all';
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projects.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      card.hidden = selected !== 'all' && !categories.includes(selected);
    });
  }));

  const modalMap = {onboarding:'case-onboarding', book:'case-book', sjlt:'case-sjlt'};
  document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => {
    const dialog = document.getElementById(modalMap[button.dataset.dialog]);
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  }));
  document.querySelectorAll('.case-dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', event => { if (event.key === 'Escape') dialog.close(); });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold: 0.12, rootMargin: '0px 0px -24px 0px'});
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const progress = document.getElementById('progress-bar');
  let ticking = false;
  let maxScroll = 0;
  const measureScrollRange = () => {
    maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  };
  const updateProgress = () => {
    if (progress) {
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
    ticking = false;
  };
  const scheduleProgressUpdate = () => {
    if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
  };
  const measureAndScheduleProgress = () => {
    measureScrollRange();
    scheduleProgressUpdate();
  };
  window.addEventListener('scroll', scheduleProgressUpdate, {passive:true});
  window.addEventListener('resize', measureAndScheduleProgress, {passive:true});
  if ('ResizeObserver' in window) {
    const scrollRangeObserver = new ResizeObserver(measureAndScheduleProgress);
    scrollRangeObserver.observe(document.documentElement);
    if (document.body) scrollRangeObserver.observe(document.body);
  }
  measureScrollRange();
  updateProgress();
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Enable scroll-reveal hiding only after all interactions are initialized.
  // If this script fails to load, content remains visible by default.
  document.documentElement.classList.add('js-ready');
})();
