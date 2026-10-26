(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
  const emptyState = document.querySelector('#filter-empty');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !expanded);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        menuToggle.focus();
      }
    });
  }

  function applyFilter(filter) {
    let visibleCount = 0;
    projectCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(/\s+/);
      const visible = filter === 'all' || categories.includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (emptyState) emptyState.hidden = visibleCount > 0;
    const count = document.querySelector('.toolbar-count');
    if (count) count.textContent = String(visibleCount).padStart(2, '0');
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyFilter(filter);
    });
  });

  const openButtons = document.querySelectorAll('[data-open-dialog]');
  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.openDialog);
      if (dialog instanceof HTMLDialogElement && typeof dialog.showModal === 'function') {
        dialog.showModal();
        const closeButton = dialog.querySelector('.dialog-close');
        if (closeButton) closeButton.focus();
      }
    });
  });

  document.querySelectorAll('.project-dialog').forEach((dialog) => {
    dialog.querySelectorAll('.dialog-close').forEach((button) => {
      button.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  document.querySelectorAll('.profile-avatar img, .about-avatar img').forEach((avatar) => {
    avatar.addEventListener('error', () => {
      avatar.hidden = true;
      const fallback = avatar.nextElementSibling;
      if (fallback) fallback.style.display = 'grid';
    });
  });


  // Interactive system map: each mode represents a real pattern from the public work/resume.
  const flowButtons = [...document.querySelectorAll('[data-flow]')];
  const systemMap = document.querySelector('.system-map[data-mode]');
  const flowData = {
    identity: {
      core: 'IDENTITY<br>FLOW', footer: 'Trust boundaries', index: '01 — SSO', summary: 'Signed assertion → validated session',
      nodes: {
        api: ['⇄', 'Service Provider', 'AuthnRequest · SAML'],
        auth: ['⌑', 'Identity Provider', 'Signed response'],
        event: ['✓', 'Assertion check', 'X.509 · Signature'],
        data: ['▤', 'Session & logout', 'Redis · SLO']
      }
    },
    events: {
      core: 'EVENT<br>FLOW', footer: 'Asynchronous hand-off', index: '02 — KAFKA', summary: 'Producer → topic → consumer → persistence',
      nodes: {
        api: ['↥', 'Event producer', 'Employee-created'],
        auth: ['⌁', 'Kafka topic', 'Ordered event stream'],
        event: ['⇄', 'Consumer service', 'Validate payload'],
        data: ['▤', 'Persistence', 'JPA · PostgreSQL']
      }
    },
    policy: {
      core: 'RULES<br>ENGINE', footer: 'Business policy path', index: '03 — SPEL', summary: 'Booking request → rules → decision → partner',
      nodes: {
        api: ['⇄', 'Booking request', 'Flight · Hotel · Bus'],
        auth: ['⌘', 'Policy rules', 'SpEL evaluation'],
        event: ['✓', 'Policy decision', 'Approve · Review'],
        data: ['↗', 'Partner action', 'Yatra · Paxes']
      }
    }
  };
  function selectFlow(mode) {
    const data = flowData[mode];
    if (!data || !systemMap) return;
    systemMap.dataset.mode = mode;
    const coreLabel = systemMap.querySelector('[data-core-label]');
    if (coreLabel) coreLabel.innerHTML = data.core;
    const footer = document.querySelector('[data-flow-footer]');
    const index = document.querySelector('[data-flow-index]');
    const summary = document.querySelector('[data-flow-summary]');
    if (footer) footer.textContent = data.footer;
    if (index) index.textContent = data.index;
    if (summary) summary.textContent = data.summary;
    Object.entries(data.nodes).forEach(([key, values]) => {
      const node = systemMap.querySelector(`[data-map-node="${key}"]`);
      if (!node) return;
      const icon = node.querySelector('[data-node-icon]');
      const title = node.querySelector('[data-node-title]');
      const detail = node.querySelector('[data-node-detail]');
      if (icon) icon.textContent = values[0];
      if (title) title.textContent = values[1];
      if (detail) detail.textContent = values[2];
    });
    flowButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.flow === mode)));
  }
  flowButtons.forEach((button) => button.addEventListener('click', () => selectFlow(button.dataset.flow)));

  // A short phrase rotation adds personality without changing the heading for assistive tech.
  const rotator = document.querySelector('[data-rotator]');
  const phrases = ['behind the experience.', 'between every service.', 'after every request.', 'that keep data moving.'];
  if (rotator && !reducedMotion) {
    let phraseIndex = 0;
    window.setInterval(() => {
      rotator.classList.add('is-changing');
      window.setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        rotator.textContent = phrases[phraseIndex];
        rotator.classList.remove('is-changing');
      }, 280);
    }, 3200);
  }

  // Scroll progress and current-section navigation are passive, single-page enhancements.
  const progressFill = document.querySelector('.scroll-progress span');
  let scrollQueued = false;
  function updateScrollChrome() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    if (progressFill) progressFill.style.transform = `scaleX(${progress})`;
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScrollChrome);
  }, {passive: true});
  updateScrollChrome();

  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const navSections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && navSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-20% 0px -65% 0px', threshold: 0});
    navSections.forEach((section) => sectionObserver.observe(section));
  }

  // Fine-pointer spotlights are confined to cards and the system panel; touch devices skip them.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.project-card, .learning-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${event.clientX - box.left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - box.top}px`);
      }, {passive: true});
    });
  }

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
