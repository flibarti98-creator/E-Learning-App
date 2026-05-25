/* ================================================================
   DATA
   Each exercise has:
     title  – card header
     lines  – array of:
       { type:'code', html }          plain highlighted line
       { type:'gap', before, answer, after, hint }
         before/after = highlighted HTML flanking the input
         answer       = correct keyword (case-insensitive)
         hint         = shown after MAX_ATTEMPTS wrong tries
================================================================ */

const MAX_ATTEMPTS = 2;

const EXERCISES = [

  /* ── 0: greet ──────────────────────────────────────────────── */
  {
    title: 'Funkcja powitalna',
    lines: [
      {
        type: 'gap',
        before: '',
        answer: 'fun',
        after: ' <span class="fn">greet</span><span class="pun">(</span>name<span class="pun">:</span> <span class="ty">String</span><span class="pun">):</span> <span class="ty">String</span> <span class="pun">{</span>',
        hint: 'Słowo kluczowe rozpoczynające definicję funkcji.',
      },
      { type: 'code', html: '    <span class="kw">return</span> <span class="str">"Cześć, $name!"</span>' },
      { type: 'code', html: '<span class="pun">}</span>' },
      { type: 'code', html: '' },
      { type: 'code', html: '<span class="kw">fun</span> <span class="fn">main</span><span class="pun">()</span> <span class="pun">{</span>' },
      { type: 'code', html: '    <span class="kw">val</span> msg <span class="op">=</span> <span class="fn">greet</span><span class="pun">(</span><span class="str">"Kotlin"</span><span class="pun">)</span>' },
      { type: 'code', html: '    <span class="fn">println</span><span class="pun">(</span>msg<span class="pun">)</span>' },
      { type: 'code', html: '<span class="pun">}</span>' },
    ],
  },

  /* ── 1: square ─────────────────────────────────────────────── */
  {
    title: 'Kwadrat liczby',
    lines: [
      {
        type: 'gap',
        before: '',
        answer: 'fun',
        after: ' <span class="fn">square</span><span class="pun">(</span>n<span class="pun">:</span> <span class="ty">Int</span><span class="pun">):</span> <span class="ty">Int</span> <span class="pun">{</span>',
        hint: 'Słowo kluczowe do definiowania funkcji w Kotlin.',
      },
      {
        type: 'gap',
        before: '    ',
        answer: 'return',
        after: ' n <span class="op">*</span> n',
        hint: 'Zwraca wartość z funkcji.',
      },
      { type: 'code', html: '<span class="pun">}</span>' },
    ],
  },

  /* ── 2: isPositive ─────────────────────────────────────────── */
  {
    title: 'Czy liczba jest dodatnia?',
    lines: [
      {
        type: 'gap',
        before: '',
        answer: 'fun',
        after: ' <span class="fn">isPositive</span><span class="pun">(</span>n<span class="pun">:</span> <span class="ty">Int</span><span class="pun">):</span> <span class="ty">Boolean</span> <span class="pun">{</span>',
        hint: 'Słowo kluczowe rozpoczynające definicję funkcji.',
      },
      { type: 'code', html: '    <span class="kw">if</span> <span class="pun">(</span>n <span class="op">&gt;</span> <span class="num">0</span><span class="pun">)</span> <span class="pun">{</span>' },
      {
        type: 'gap',
        before: '        ',
        answer: 'return',
        after: ' <span class="kw">true</span>',
        hint: 'Zwraca wartość z funkcji.',
      },
      { type: 'code', html: '    <span class="pun">}</span>' },
      {
        type: 'gap',
        before: '    ',
        answer: 'return',
        after: ' <span class="kw">false</span>',
        hint: 'Zwraca wartość z funkcji.',
      },
      { type: 'code', html: '<span class="pun">}</span>' },
    ],
  },

  /* ── 3: max ────────────────────────────────────────────────── */
  {
    title: 'Maksimum dwóch liczb',
    lines: [
      {
        type: 'gap',
        before: '',
        answer: 'fun',
        after: ' <span class="fn">max</span><span class="pun">(</span>a<span class="pun">:</span> <span class="ty">Int</span><span class="pun">,</span> b<span class="pun">:</span> <span class="ty">Int</span><span class="pun">):</span> <span class="ty">Int</span> <span class="pun">{</span>',
        hint: 'Słowo kluczowe rozpoczynające definicję funkcji.',
      },
      { type: 'code', html: '    <span class="kw">if</span> <span class="pun">(</span>a <span class="op">&gt;</span> b<span class="pun">)</span> <span class="pun">{</span>' },
      {
        type: 'gap',
        before: '        ',
        answer: 'return',
        after: ' a',
        hint: 'Zwraca wartość z funkcji.',
      },
      { type: 'code', html: '    <span class="pun">}</span>' },
      {
        type: 'gap',
        before: '    ',
        answer: 'return',
        after: ' b',
        hint: 'Zwraca wartość z funkcji.',
      },
      { type: 'code', html: '<span class="pun">}</span>' },
    ],
  },
];

/* ================================================================
   STATE
================================================================ */
const state = EXERCISES.map(ex => {
  const gaps = ex.lines
    .filter(l => l.type === 'gap')
    .map(() => ({ attempts: 0, solved: false }));
  return { gaps, allSolved: false };
});

let totalScore = 0;
const maxScore = state.reduce((s, ex) => s + ex.gaps.length, 0);

/* ================================================================
   BUILD DOM
================================================================ */
function buildAll() {
  const container = document.getElementById('exercises');
  EXERCISES.forEach((ex, exIdx) => container.appendChild(buildCard(ex, exIdx)));
  updateScoreBar();
}

function buildCard(ex, exIdx) {
  const card = document.createElement('div');
  card.className = 'exercise';
  card.id = `ex-${exIdx}`;

  /* header */
  const header = document.createElement('div');
  header.className = 'exercise__header';
  header.innerHTML = `
    <div class="exercise__num">${exIdx + 1}</div>
    <span class="exercise__title">${ex.title}</span>
    <span class="exercise__badge" id="badge-${exIdx}">Oczekuje</span>`;
  card.appendChild(header);

  /* code snippet */
  const body = document.createElement('div');
  body.className = 'exercise__body';
  const snippet = document.createElement('div');
  snippet.className = 'code-snippet';

  let gapIdx = 0;
  ex.lines.forEach(line => {
    const row = document.createElement('div');

    if (line.type === 'code') {
      row.innerHTML = line.html;
    } else {
      /* gap line */
      const localIdx = gapIdx++;
      const inputId  = `gap-${exIdx}-${localIdx}`;

      if (line.before) {
        const b = document.createElement('span');
        b.innerHTML = line.before;
        row.appendChild(b);
      }

      const input = document.createElement('input');
      input.type          = 'text';
      input.className     = 'gap';
      input.id            = inputId;
      input.dataset.ex    = exIdx;
      input.dataset.gap   = localIdx;
      input.dataset.answer = line.answer;
      input.dataset.hint  = line.hint || '';
      input.autocomplete  = 'off';
      input.spellcheck    = false;
      input.setAttribute('aria-label', `Luka ${localIdx + 1} w ćwiczeniu ${exIdx + 1}`);
      input.style.width   = Math.max(line.answer.length + 2, 6) + 'ch';
      input.addEventListener('input', () => {
        input.style.width = Math.max(input.value.length + 2, 6) + 'ch';
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') checkGap(exIdx, localIdx);
      });
      row.appendChild(input);

      if (line.after) {
        const a = document.createElement('span');
        a.innerHTML = line.after;
        row.appendChild(a);
      }
    }

    snippet.appendChild(row);
  });

  body.appendChild(snippet);
  card.appendChild(body);

  /* feedback + hint rows (one pair per gap) */
  const footerEl = document.createElement('div');
  footerEl.className = 'exercise__footer';
  const gapLines = ex.lines.filter(l => l.type === 'gap');
  gapLines.forEach((gl, g) => {
    const fb = document.createElement('div');
    fb.className = 'feedback';
    fb.id = `fb-${exIdx}-${g}`;

    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.id = `hint-${exIdx}-${g}`;
    hint.textContent = '💡 Podpowiedź: ' + (gl.hint || '');

    footerEl.appendChild(fb);
    footerEl.appendChild(hint);
  });
  card.appendChild(footerEl);

  /* actions */
  const actions = document.createElement('div');
  actions.className = 'exercise__actions';
  actions.innerHTML = `
    <div class="attempts-indicator" id="dots-${exIdx}"></div>
    <button class="btn btn--ghost"   onclick="resetExercise(${exIdx})">Resetuj</button>
    <button class="btn btn--primary" onclick="checkAll(${exIdx})">Sprawdź</button>`;
  card.appendChild(actions);

  updateDots(exIdx);
  return card;
}

/* ================================================================
   CHECK
================================================================ */
function checkGap(exIdx, gapIdx) {
  const gapSt = state[exIdx].gaps[gapIdx];
  if (gapSt.solved) return;

  const input  = document.getElementById(`gap-${exIdx}-${gapIdx}`);
  const fb     = document.getElementById(`fb-${exIdx}-${gapIdx}`);
  const hint   = document.getElementById(`hint-${exIdx}-${gapIdx}`);
  const answer = input.dataset.answer.trim();
  const given  = input.value.trim();
  if (!given) return;

  if (given.toLowerCase() === answer.toLowerCase()) {
    gapSt.solved = true;
    input.classList.remove('incorrect');
    input.classList.add('correct');
    input.value = answer;
    showFeedback(fb, true, '✓ Poprawnie!');
    hint.classList.remove('show');
    totalScore++;
    updateScoreBar();
    checkExerciseDone(exIdx);
  } else {
    gapSt.attempts++;
    input.classList.remove('correct');
    // re-trigger shake
    input.classList.remove('incorrect');
    void input.offsetWidth;
    input.classList.add('incorrect');
    showFeedback(fb, false, '✗ Nieprawidłowo. Spróbuj jeszcze raz.');
    if (gapSt.attempts >= MAX_ATTEMPTS) {
      hint.classList.add('show');
      input.classList.add('hint-shown');
    }
  }
  updateDots(exIdx);
}

function checkAll(exIdx) {
  let gapIdx = 0;
  EXERCISES[exIdx].lines.forEach(line => {
    if (line.type === 'gap') checkGap(exIdx, gapIdx++);
  });
}

function checkExerciseDone(exIdx) {
  if (state[exIdx].gaps.every(g => g.solved)) {
    state[exIdx].allSolved = true;
    document.getElementById(`ex-${exIdx}`).classList.add('solved');
    document.getElementById(`badge-${exIdx}`).textContent = 'Ukończono';
  }
}

/* ================================================================
   RESET
================================================================ */
function resetExercise(exIdx) {
  const ex = EXERCISES[exIdx];
  const st = state[exIdx];

  totalScore = Math.max(0, totalScore - st.gaps.filter(g => g.solved).length);
  st.gaps.forEach(g => { g.attempts = 0; g.solved = false; });
  st.allSolved = false;

  document.getElementById(`ex-${exIdx}`).classList.remove('solved', 'errored');
  document.getElementById(`badge-${exIdx}`).textContent = 'Oczekuje';

  let gapIdx = 0;
  ex.lines.forEach(line => {
    if (line.type === 'gap') {
      const input = document.getElementById(`gap-${exIdx}-${gapIdx}`);
      const fb    = document.getElementById(`fb-${exIdx}-${gapIdx}`);
      const hint  = document.getElementById(`hint-${exIdx}-${gapIdx}`);
      input.value = '';
      input.className = 'gap';
      input.style.width = Math.max(line.answer.length + 2, 6) + 'ch';
      fb.className = 'feedback';
      fb.textContent = '';
      hint.classList.remove('show');
      gapIdx++;
    }
  });

  updateDots(exIdx);
  updateScoreBar();
}

/* ================================================================
   UI HELPERS
================================================================ */
function showFeedback(el, ok, msg) {
  el.className   = 'feedback show ' + (ok ? 'success' : 'error');
  el.textContent = msg;
}

function updateDots(exIdx) {
  const wrap   = document.getElementById(`dots-${exIdx}`);
  const totalA = state[exIdx].gaps.reduce((s, g) => s + g.attempts, 0);
  wrap.innerHTML = '';
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const dot = document.createElement('span');
    dot.className = 'attempts-dot' + (i < totalA ? ' used' : '');
    wrap.appendChild(dot);
  }
}

function updateScoreBar() {
  document.getElementById('score-fill').style.width =
    (maxScore > 0 ? totalScore / maxScore * 100 : 0) + '%';
  document.getElementById('score-value').textContent = `${totalScore} / ${maxScore}`;
  const val = document.getElementById('score-value');
  val.classList.remove('bump');
  void val.offsetWidth;
  val.classList.add('bump');
}

/* ================================================================
   INIT
================================================================ */
buildAll();