/**
 * navbar.js — Wstrzykuje navbar i obsługuje jego logikę
 * Uruchamiaj na każdej podstronie przez <script src="../js/navbar.js">
 * Wymaga atrybutu data-page="nazwa" na <body>
 */

(function () {
  'use strict';

  const PAGES = [
    { num: '01', label: 'Teoria',    href: 'teoria.html',      key: 'teoria'    },
    { num: '02', label: 'Quiz',      href: 'quiz.html',        key: 'quiz'      },
    { num: '03', label: 'Bloczki',   href: 'bloczki.html',     key: 'bloczki'   },
    { num: '04', label: 'Kod',       href: 'kod.html',         key: 'kod'       },
    { num: '05', label: 'Fiszki',    href: 'fiszki.html',      key: 'fiszki'    },
    { num: '06', label: 'Podsumowanie', href: 'podsumowanie.html', key: 'podsumowanie' },
  ];

  /* ── Generuj HTML navbara ── */
  const currentPage = document.body.dataset.page || '';

  const linksHTML = PAGES.map(p => `
    <a href="${p.href}" class="nav-link${currentPage === p.key ? ' is-active' : ''}" data-page="${p.key}">
      <span class="nav-link__num">${p.num}</span>
      <span class="nav-link__label">${p.label}</span>
    </a>
  `).join('');

  const navbarHTML = `
    <header class="navbar" id="navbar">
      <a href="../index.html" class="navbar__brand">
        <span class="navbar__logo">◈</span>
        <span class="navbar__name">Kotlin Learn</span>
      </a>
      <button class="navbar__hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="navbar__nav" id="navMenu" role="navigation" aria-label="Główna nawigacja">
        ${linksHTML}
      </nav>
    </header>
  `;

  /* ── Wstaw na początku body ── */
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);

  /* ── Logika hamburgera ── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

  /* ── Scroll shadow ── */
  const onScroll = () => navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();