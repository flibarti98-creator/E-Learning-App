/**
 * teoria.js — Logika symulatora funkcji opisOsoby
 */
(function () {
  'use strict';

  const simRun    = document.getElementById('simRun');
  const simResult = document.getElementById('simResult');
  const simOutput = document.getElementById('simOutput');
  const simImie   = document.getElementById('sim-imie');
  const simWiek   = document.getElementById('sim-wiek');
  const simJezyk  = document.getElementById('sim-jezyk');

  if (!simRun) return;

  function runSimulator() {
    const imie  = simImie.value.trim()   || 'Anna';
    const wiek  = parseInt(simWiek.value) || 22;
    const jezyk = simJezyk.value.trim()  || 'Kotlin';

    simResult.textContent = '...';
    simOutput.classList.add('is-running');

    setTimeout(() => {
      simResult.textContent = `"${imie} ma ${wiek} lat i uczy się ${jezyk}."`;
      simOutput.classList.remove('is-running');
    }, 420);
  }

  simRun.addEventListener('click', runSimulator);

  [simImie, simWiek, simJezyk].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runSimulator();
    });
  });

  console.log('%cteoria.js gotowy', 'color:#d4ff00;background:#0e0e0e;padding:3px 8px;border-radius:3px;');
})();