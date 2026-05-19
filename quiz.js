/**
 * quiz.js — Logika quizu ABCD (Kotlin — Funkcje)
 * Moduł: 02 · Quiz
 *
 * Funkcje:
 *   - Renderowanie pytań jedno po drugim
 *   - Sprawdzanie odpowiedzi + feedback wizualny
 *   - Zliczanie punktów (live counter)
 *   - Pasek postępu
 *   - Ekran wyniku końcowego
 *   - Restart quizu
 */

(function () {
  'use strict';

  /* ── BAZA PYTAŃ ──────────────────────────────────────────── */
  const QUESTIONS = [
    {
      text: 'Jak deklaruje się funkcję w Kotlinie?',
      difficulty: 'Łatwe',
      options: [
        'function greet() { }',
        'fun greet() { }',
        'def greet() { }',
        'func greet() { }',
      ],
      correct: 1, // indeks (0-based) poprawnej odpowiedzi
      explanation: '✓ W Kotlinie funkcje deklaruje się słowem kluczowym <strong>fun</strong>, np. <code>fun greet() { }</code>.',
      wrongExplanation: '✗ Błąd! Kotlin używa słowa <strong>fun</strong>, nie <code>function</code>, <code>def</code> ani <code>func</code>.',
    },
    {
      text: 'Co zwróci poniższa funkcja?\n<code>fun add(a: Int, b: Int) = a + b</code>',
      difficulty: 'Łatwe',
      options: [
        'Nic — brakuje słowa kluczowego return',
        'Sumę a i b jako Int',
        'Błąd kompilacji',
        'Zawsze 0',
      ],
      correct: 1,
      explanation: '✓ Poprawnie! To tzw. <strong>wyrażeniowa forma funkcji</strong> (single-expression). Kotlin automatycznie wydedukuje typ zwracany jako <code>Int</code>.',
      wrongExplanation: '✗ Błąd. Gdy funkcja ma ciało w postaci wyrażenia (<code>= a + b</code>), Kotlin automatycznie zwraca jego wynik — nie potrzeba <code>return</code>.',
    },
    {
      text: 'Która opcja poprawnie definiuje funkcję z domyślną wartością parametru?',
      difficulty: 'Średnie',
      options: [
        'fun greet(name: String = "Kotlin") { }',
        'fun greet(name: String := "Kotlin") { }',
        'fun greet(name = "Kotlin": String) { }',
        'fun greet(String name = "Kotlin") { }',
      ],
      correct: 0,
      explanation: '✓ Tak! Domyślna wartość w Kotlinie: <strong>parametr: Typ = wartość</strong>, np. <code>name: String = "Kotlin"</code>.',
      wrongExplanation: '✗ Niezgodnie ze składnią. Poprawna forma to <code>name: String = "Kotlin"</code> — typ przed znakiem równości.',
    },
    {
      text: 'Co oznacza słowo kluczowe <code>Unit</code> jako typ zwracany funkcji?',
      difficulty: 'Średnie',
      options: [
        'Funkcja może zwrócić dowolną wartość',
        'Funkcja nigdy nie zakończy działania',
        'Funkcja nie zwraca żadnej wartości (odpowiednik void)',
        'Funkcja jest prywatna',
      ],
      correct: 2,
      explanation: '✓ Dokładnie! <strong>Unit</strong> w Kotlinie odpowiada <code>void</code> w Javie — funkcja nic nie zwraca. Typ Unit można pominąć w deklaracji.',
      wrongExplanation: '✗ Błąd. <code>Unit</code> oznacza brak wartości zwracanej — to kotlinowy odpowiednik <code>void</code> z Javy.',
    },
    {
      text: 'Jak wywołać funkcję z nazwanym argumentem w Kotlinie?',
      difficulty: 'Trudne',
      options: [
        'greet(name = "Anna")',
        'greet("Anna": name)',
        'greet(name: "Anna")',
        'greet<name>("Anna")',
      ],
      correct: 0,
      explanation: '✓ Świetnie! Nazwane argumenty w Kotlinie: <strong>nazwaParametru = wartość</strong>, np. <code>greet(name = "Anna")</code>.',
      wrongExplanation: '✗ Niepoprawnie. Kotlin używa składni <code>nazwaParametru = wartość</code> dla nazwanych argumentów — ze znakiem <code>=</code>.',
    },
  ];

  const LETTERS = ['A', 'B', 'C', 'D'];

  const RESULTS = [
    { min: 5, icon: '🏆', title: 'Mistrz Kotlina!',      msg: 'Bezbłędny wynik! Znasz funkcje w Kotlinie jak własną kieszeń.' },
    { min: 4, icon: '🎯', title: 'Świetna robota!',       msg: 'Prawie doskonałość. Przejrzyj jedno zagadnienie i będziesz na szczycie.' },
    { min: 3, icon: '📚', title: 'Niezłe podstawy!',      msg: 'Większość opanowana. Powtórz tematy, w których popełniłeś błędy.' },
    { min: 1, icon: '💡', title: 'Jeszcze trochę pracy',  msg: 'Wróć do sekcji "Teoria" i spróbuj ponownie — dasz radę!' },
    { min: 0, icon: '😅', title: 'Zacznij od teorii',     msg: 'Zerowy wynik to dobry punkt startowy. Przejrzyj materiał i spróbuj jeszcze raz.' },
  ];

  /* ── STAN APLIKACJI ───────────────────────────────────────── */
  let state = {
    current: 0,
    score: 0,
    answered: false,
  };

  /* ── ELEMENTY DOM ─────────────────────────────────────────── */
  const els = {
    card:         document.getElementById('quizCard'),
    question:     document.getElementById('quizQuestion'),
    questionNum:  document.getElementById('questionNum'),
    questionBadge:document.getElementById('questionBadge'),
    questionText: document.getElementById('questionText'),
    options:      document.getElementById('quizOptions'),
    feedback:     document.getElementById('quizFeedback'),
    nextBtn:      document.getElementById('nextBtn'),
    progressFill: document.getElementById('progressFill'),
    progressLabel:document.getElementById('progressLabel'),
    scoreValue:   document.getElementById('scoreValue'),
    scoreTotal:   document.getElementById('scoreTotal'),
    scoreLive:    document.getElementById('scoreLive'),
    result:       document.getElementById('quizResult'),
    resultIcon:   document.getElementById('resultIcon'),
    resultTitle:  document.getElementById('resultTitle'),
    resultPts:    document.getElementById('resultPts'),
    resultMsg:    document.getElementById('resultMsg'),
    retryBtn:     document.getElementById('retryBtn'),
  };

  /* ── INICJALIZACJA ────────────────────────────────────────── */
  function init() {
    state = { current: 0, score: 0, answered: false };
    els.scoreTotal.textContent = QUESTIONS.length;
    els.scoreValue.textContent = '0';
    els.result.hidden = true;
    els.card.hidden = false;
    els.scoreLive.hidden = false;
    renderQuestion();
  }

  /* ── RENDER PYTANIA ───────────────────────────────────────── */
  function renderQuestion() {
    const q   = QUESTIONS[state.current];
    const idx = state.current;

    state.answered = false;

    // Animacja wejścia
    els.card.classList.remove('quiz-card--entering');
    void els.card.offsetWidth; // reflow
    els.card.classList.add('quiz-card--entering');

    // Meta
    els.questionNum.textContent   = String(idx + 1).padStart(2, '0');
    els.questionBadge.textContent = q.difficulty;

    // Treść pytania (obsługuje HTML, np. <code>)
    els.questionText.innerHTML = q.text.replace(/\n/g, '<br>');

    // Opcje
    els.options.innerHTML = '';
    q.options.forEach((opt, i) => {
      const li  = document.createElement('li');
      li.setAttribute('role', 'listitem');

      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.setAttribute('aria-label', `Odpowiedź ${LETTERS[i]}: ${opt}`);
      btn.innerHTML = `
        <span class="quiz-option__letter">${LETTERS[i]}</span>
        <span class="quiz-option__text">${opt}</span>
        <span class="quiz-option__icon" aria-hidden="true"></span>
      `;
      btn.addEventListener('click', () => handleAnswer(i));

      li.appendChild(btn);
      els.options.appendChild(li);
    });

    // Feedback — wyczyść
    els.feedback.textContent = '';
    els.feedback.className   = 'quiz-feedback';

    // Przycisk Następne
    els.nextBtn.disabled = true;
    const isLast = idx === QUESTIONS.length - 1;
    els.nextBtn.innerHTML = isLast
      ? 'Zobacz wynik ◈'
      : 'Następne <span>→</span>';

    // Postęp
    updateProgress(idx);
  }

  /* ── OBSŁUGA ODPOWIEDZI ───────────────────────────────────── */
  function handleAnswer(chosenIdx) {
    if (state.answered) return;
    state.answered = true;

    const q       = QUESTIONS[state.current];
    const correct = chosenIdx === q.correct;
    const btns    = els.options.querySelectorAll('.quiz-option');

    // Zablokuj wszystkie opcje
    btns.forEach((btn, i) => {
      btn.disabled = true;
      const icon = btn.querySelector('.quiz-option__icon');

      if (i === q.correct) {
        btn.classList.add('quiz-option--correct');
        icon.textContent = '✓';
      } else if (i === chosenIdx && !correct) {
        btn.classList.add('quiz-option--wrong');
        icon.textContent = '✗';
      } else {
        btn.classList.add('quiz-option--disabled');
      }
    });

    // Punkty
    if (correct) {
      state.score++;
      els.scoreValue.textContent = state.score;
    }

    // Feedback tekstowy
    els.feedback.innerHTML   = correct ? q.explanation : q.wrongExplanation;
    els.feedback.className   = `quiz-feedback quiz-feedback--${correct ? 'correct' : 'wrong'}`;

    // Shake przy błędzie
    if (!correct) {
      els.card.classList.remove('quiz-card--shake');
      void els.card.offsetWidth;
      els.card.classList.add('quiz-card--shake');
    }

    // Odblokuj Następne
    els.nextBtn.disabled = false;

    // Postęp (po odpowiedzi +1)
    updateProgress(state.current + 1);
  }

  /* ── POSTĘP ───────────────────────────────────────────────── */
  function updateProgress(answeredCount) {
    const pct = Math.round((answeredCount / QUESTIONS.length) * 100);
    els.progressFill.style.width  = `${pct}%`;
    els.progressLabel.textContent =
      answeredCount >= QUESTIONS.length
        ? 'Koniec!'
        : `Pytanie ${answeredCount + 1} z ${QUESTIONS.length}`;
  }

  /* ── NASTĘPNE PYTANIE / WYNIK ─────────────────────────────── */
  function goNext() {
    state.current++;
    if (state.current < QUESTIONS.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  /* ── WYNIK KOŃCOWY ────────────────────────────────────────── */
  function showResult() {
    els.card.hidden      = true;
    els.scoreLive.hidden = true;
    els.result.hidden    = false;

    const pts    = state.score;
    const result = RESULTS.find(r => pts >= r.min);

    els.resultIcon.textContent  = result.icon;
    els.resultTitle.textContent = result.title;
    els.resultPts.textContent   = pts;
    els.resultMsg.textContent   = result.msg;

    // Aktualizuj pasek do 100%
    els.progressFill.style.width  = '100%';
    els.progressLabel.textContent = 'Koniec!';
  }

  /* ── ZDARZENIA ────────────────────────────────────────────── */
  els.nextBtn.addEventListener('click', () => {
    if (!state.answered) return; // zabezpieczenie
    goNext();
  });

  els.retryBtn.addEventListener('click', init);

  /* ── START ────────────────────────────────────────────────── */
  init();

  console.log(
    '%cKotlin Quiz załadowany ◈',
    'color: #d4ff00; background: #0e0e0e; padding: 4px 10px; border-radius: 4px; font-weight: bold;'
  );

})();