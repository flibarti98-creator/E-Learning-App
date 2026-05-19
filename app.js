/**
 * app.js — Logika nawigacji i interakcji
 * Moduły:
 *   1. Hamburger menu (mobile toggle)
 *   2. Scroll: navbar shadow + aktywny link
 *   3. Smooth close po kliknięciu linka (mobile)
 */

(function () {
  'use strict';

  /* ── Elementy DOM ─────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('navMenu');
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('[id^="modul-"]');

  /* ── 1. Hamburger toggle ─────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Zamknij menu po kliknięciu linka (mobile) */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Zamknij menu po kliknięciu poza nim */
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('is-open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── 2. Navbar scroll shadow ─────────────── */
  const onScroll = () => {
    const scrolled = window.scrollY > 10;
    navbar.classList.toggle('navbar--scrolled', scrolled);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // sprawdź od razu przy ładowaniu

  /* ── 3. Aktywny link na podstawie sekcji ─── */
  let activeLinkIndex = -1;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id; // np. "modul-1"
          const moduleNum = id.split('-')[1]; // "1"

          navLinks.forEach((link, i) => {
            const match = link.dataset.module === moduleNum;
            link.classList.toggle('is-active', match);
          });
        }
      });
    },
    {
      rootMargin: '-50% 0px -50% 0px', // aktywuje w połowie viewportu
      threshold: 0,
    }
  );

  sections.forEach(section => observer.observe(section));

  /* ── 4. Keyboard: ESC zamyka menu ────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus(); // zwróć focus do przycisku
    }
  });

  /* ── 5. Log startowy (debug) ─────────────── */
  console.log(
    '%cAppModules v1.0 gotowy ◈',
    'color: #d4ff00; background: #0e0e0e; padding: 4px 10px; border-radius: 4px; font-weight: bold;'
  );
})();