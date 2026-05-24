/* ================================================================
   DATA — exercises with code lines and gap definitions.

   Each exercise has:
     title   – displayed in the card header
     lines   – array of line descriptors:
               { type: 'code', html }   → rendered as-is (highlighted HTML)
               { type: 'gap',  before, answer, after, hint }
                 before / after → highlighted HTML flanking the input
                 answer         → correct keyword (trimmed, case-insensitive check)
                 hint           → shown after MAX_ATTEMPTS wrong tries
================================================================ */

const MAX_ATTEMPTS = 2; // wrong tries before hint appears

const EXERCISES = [
  /* ── 0: greet ───────────────────────────────────────────────── */
  {
    title: 'Funkcja powitalna',
    lines: [
      {
        type: 'gap',
        before: '',
        answer: 'fun',
        after: ' <span class="fn">greet</span><span class="pun">(</span><span class="ty">name</span><span class="pun">:</span> <span class="ty">String</span><span class="pun">)</span><span class="pun">:</span> <span class="ty">String</span> <span class="pun">{</span>',
        hint: 'Słowo kluczowe rozpoczynające definicję funkcji.',
      },
      { type: 'code', html: '    <span class="kw">return</span> <span class="str">"Cześć, $name!"</span>' },
      { type: 'code', html: '<span class="pun">}</span>' },
      { type: 'code', html: '' },
      { type: 'code', html: '<span class="kw">fun</span> <span class="fn">main</span><span class="pun">()</span> <span class="pun">{</span>' },
      {
        type: 'gap',
        before: '    <span class="kw">val</span> msg <span class="op">=</span> <span class="fn">greet</span><span class="pun">(</span><span class="str">"Kotlin"</span><span class="pun">)</span>',
        answer: '',
        _skip: true, // line has no gap — rendered as plain code
      },
      { type: 'code', html: '    <span class="fn">println</span><span class="pun">(</span>msg<span class="pun">)</span>' },
      { type: 'code', html: '<span class="pun">}</span>' },
    ],
  },

  /* ── 1: square ──────────────────────────────────────────────── */
  {
    title: 'Kwadrat liczby',
    lines: [
      {
        type: 'gap',
        before: '',
        answer: 'fun',
        after: ' <span class="fn">square</span><span class="pun">(</span>n<span class="pun">:</span> <span class="ty">Int</span><span class="pun">)</span><span class="pun">:</span> <span class="ty">Int</span> <span class="pun">{</span>',
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

  /* ── 2: isPositive ──────────────────────────────────────────── */
  {
    title: 'Czy liczba jest dodatnia?',
    lines: [
      {
        type: 'gap',
        before: '',
        answer: 'fun',
        after: ' <span class="fn">isPositive</span><span class="pun">(</span>n<span class="pun">:</span> <span class="ty">Int</span><span class="pun">)</span><span class="pun">:</span> <span class="ty">Boolean</span> <span class="pun">{</span>',
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

  /* ── 3: max ─────────────────────────────────────────────────── */
  {
    title: 'Maksimum dwóch liczb',
    lines: [
      {
        type: 'gap',
        before: '',
        answer: 'fun',
        after: ' <span class="fn">max</span><span class="pun">(</span>a<span class="pun">:</span> <span class="ty">Int</span><span class="pun">,</span> b<span class="pun">:</span> <span class="ty">Int</span><span class="pun">)</span><span class="pun">:</span> <span class="ty">Int</span> <span class="pun">{</span>',
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
// Per-exercise: { gaps: [{attempts, solved}], allSolved }
const state = EXERCISES.map(ex => {
  const gaps = ex.lines
    .filter(l => l.type === 'gap' && !l._skip)
    .map(() => ({ attempts: 0, solved: false }));
  return { gaps, allSolved: false };
});

let totalScore  = 0;
const maxScore  = state.reduce((s, ex) => s + ex.gaps.length, 0);

/* ================================================================
   BUILD DOM
================================================================ */
function buildAll() {
  const container = document.getElementById('exercises');
  EXERCISES.forEach((ex, exIdx) => {
    container.appendChild(buildCard(ex, exIdx));
  });
  updateScoreBar();
}

function buildCard(ex, exIdx) {
  const card = document.createElement('div');
  card.className = 'exercise';
  card.id = `ex-${exIdx}`;

  /* header */
  card.innerHTML = `
    <div class="exercise__header">
      <div class="exercise__num">${exIdx + 1}</div>
      <span class="exercise__title">${ex.title}</span>
      <span class="exercise__badge" id="badge-${exIdx}">Oczekuje</span>
    </div>`;

  /* code snippet */
  const body = document.createElement('div');
  body.className = 'exercise__body';

  const snippet = document.createElement('div');
  snippet.className = 'code-snippet';

  let gapIdx = 0;
  ex.lines.forEach((line, lineIdx) => {
    const row = document.createElement('div');

    if (line.type === 'code' || line._skip) {
      row.innerHTML = line.html || (line._skip ? line.before : '');
    } else {
      // gap line
      const localGapIdx = gapIdx++;
      const inputId = `gap-${exIdx}-${localGapIdx}`;

      const before = document.createElement('span');
      before.innerHTML = line.before;

      const input = document.createElement('input');
      input.type        = 'text';
      input.className   = 'gap';
      input.id          = inputId;
      input.dataset.ex  = exIdx;
      input.dataset.gap = localGapIdx;
      input.dataset.answer = line.answer;
      input.dataset.hint   = line.hint || '';
      input.autocomplete   = 'off';
      input.spellcheck     = false;
      input.setAttribute('aria-label', `Luka ${localGapIdx + 1} w ćwiczeniu ${exIdx + 1}`);
      // dynamic width
      input.style.width = Math.max(line.answer.length + 1, 5) + 'ch';
      input.addEventListener('input', () => {
        input.style.width = Math.max(input.value.length + 1, 5) + 'ch';
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') checkGap(exIdx, localGapIdx);
      });

      const after = document.createElement('span');
      after.innerHTML = line.after;

      row.appendChild(before);
      row.appendChild(input);
      row.appendChild(after);
    }

    snippet.appendChild(row);
  });

  body.appendChild(snippet);
  card.appendChild(body);

  /* per-gap feedback rows */
  const feedbackWrap = document.createElement('div');
  feedbackWrap.className = 'exercise__footer';
  for (let g = 0; g < state[exIdx].gaps.length; g++) {
    const fb   = document.createElement('div');
    fb.className = 'feedback';
    fb.id = `fb-${exIdx}-${g}`;

    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.id = `hint-${exIdx}-${g}`;
    // find the hint text for this gap
    const gapLines = ex.lines.filter(l => l.type === 'gap' && !l._skip);
    hint.textContent = '💡 Podpowiedź: ' + (gapLines[g]?.hint || '');

    feedbackWrap.appendChild(fb);
    feedbackWrap.appendChild(hint);
  }
  card.appendChild(feedbackWrap);

  /* actions */
  const actions = document.createElement('div');
  actions.className = 'exercise__actions';
  actions.innerHTML = `
    <div class="attempts-indicator" id="dots-${exIdx}"></div>
    <button class="btn btn--ghost" onclick="resetExercise(${exIdx})">Resetuj</button>
    <button class="btn btn--primary" onclick="checkAll(${exIdx})">Sprawdź</button>`;
  card.appendChild(actions);

  updateDots(exIdx);
  return card;
}

/* ================================================================
   CHECK LOGIC
================================================================ */
function checkGap(exIdx, gapIdx) {
  const st    = state[exIdx];
  const gapSt = st.gaps[gapIdx];
  if (gapSt.solved) return;

  const input  = document.getElementById(`gap-${exIdx}-${gapIdx}`);
  const fb     = document.getElementById(`fb-${exIdx}-${gapIdx}`);
  const hint   = document.getElementById(`hint-${exIdx}-${gapIdx}`);
  const answer = input.dataset.answer.trim();
  const given  = input.value.trim();

  if (!given) return;

  if (given.toLowerCase() === answer.toLowerCase()) {
    // correct
    gapSt.solved = true;
    input.classList.remove('incorrect');
    input.classList.add('correct');
    input.value = answer; // normalise case
    showFeedback(fb, true, '✓ Poprawnie!');
    hint.classList.remove('show');
    totalScore++;
    updateScoreBar();
    checkExerciseDone(exIdx);
  } else {
    // wrong
    gapSt.attempts++;
    input.classList.remove('correct');
    input.classList.add('incorrect');
    void input.offsetWidth; // retrigger animation
    showFeedback(fb, false, `✗ Nieprawidłowo. Spróbuj jeszcze raz.`);

    if (gapSt.attempts >= MAX_ATTEMPTS) {
      hint.classList.add('show');
      input.classList.add('hint-shown');
    }
  }

  updateDots(exIdx);
}

function checkAll(exIdx) {
  const ex = EXERCISES[exIdx];
  let gapIdx = 0;
  ex.lines.forEach(line => {
    if (line.type === 'gap' && !line._skip) {
      checkGap(exIdx, gapIdx++);
    }
  });
}

function checkExerciseDone(exIdx) {
  const st = state[exIdx];
  if (st.gaps.every(g => g.solved)) {
    st.allSolved = true;
    const card  = document.getElementById(`ex-${exIdx}`);
    const badge = document.getElementById(`badge-${exIdx}`);
    card.classList.add('solved');
    badge.textContent = 'Ukończono';
  }
}

/* ================================================================
   RESET
================================================================ */
function resetExercise(exIdx) {
  const ex  = EXERCISES[exIdx];
  const st  = state[exIdx];

  // subtract previously earned points
  const earned = st.gaps.filter(g => g.solved).length;
  totalScore = Math.max(0, totalScore - earned);

  // reset state
  st.gaps.forEach(g => { g.attempts = 0; g.solved = false; });
  st.allSolved = false;

  // reset DOM
  const card  = document.getElementById(`ex-${exIdx}`);
  const badge = document.getElementById(`badge-${exIdx}`);
  card.classList.remove('solved', 'errored');
  badge.textContent = 'Oczekuje';

  let gapIdx = 0;
  ex.lines.forEach(line => {
    if (line.type === 'gap' && !line._skip) {
      const input = document.getElementById(`gap-${exIdx}-${gapIdx}`);
      const fb    = document.getElementById(`fb-${exIdx}-${gapIdx}`);
      const hint  = document.getElementById(`hint-${exIdx}-${gapIdx}`);
      input.value = '';
      input.className = 'gap';
      input.style.width = Math.max(line.answer.length + 1, 5) + 'ch';
      fb.className   = 'feedback';
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
  const st     = state[exIdx];
  const totalA = st.gaps.reduce((s, g) => s + g.attempts, 0);
  wrap.innerHTML = '';
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const dot = document.createElement('span');
    dot.className = 'attempts-dot' + (i < totalA ? ' used' : '');
    wrap.appendChild(dot);
  }
}

function updateScoreBar() {
  const fill = document.getElementById('score-fill');
  const val  = document.getElementById('score-value');
  fill.style.width = (totalScore / maxScore * 100) + '%';
  val.textContent  = `${totalScore} / ${maxScore}`;
  // bump animation
  val.classList.remove('bump');
  void val.offsetWidth;
  val.classList.add('bump');
}

/* ================================================================
   INIT
================================================================ */
document.addEventListener('DOMContentLoaded', buildAll);