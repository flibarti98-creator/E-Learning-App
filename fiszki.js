/* ================================================================
   DATA — Definicje fiszek (8 pojęć) z podświetleniem składni
================================================================ */
const FLASHCARDS = [
  {
    concept: "Słowo kluczowe fun",
    content: `
      <p>Służy do deklarowania nowej funkcji w języku Kotlin.</p>
      <pre><span class="kw">fun</span> <span class="fn">greet</span>(): <span class="ty">String</span> {
    <span class="kw">return</span> <span class="str">"Hello!"</span>
}</pre>`
  },
  {
    concept: "Typ zwracany (Return type)",
    content: `
      <p>Określany po dwukropku na końcu sygnatury funkcji. Jeśli funkcja nie zwraca żadnej sensownej wartości, używamy typu <code>Unit</code> (można go pominąć w zapisie).</p>
      <pre><span class="kw">fun</span> <span class="fn">printMsg</span>(msg: <span class="ty">String</span>): <span class="ty">Unit</span> {
    println(msg)
}</pre>`
  },
  {
    concept: "Parametry domyślne",
    content: `
      <p>Argumenty funkcji mogą posiadać wartości domyślne. Dzięki temu możemy je pominąć podczas wywoływania funkcji.</p>
      <pre><span class="kw">fun</span> <span class="fn">connect</span>(timeout: <span class="ty">Int</span> <span class="op">=</span> <span class="num">5000</span>) { ... }

<span class="cm">// Można wywołać bez podawania parametru:</span>
<span class="fn">connect</span>()</pre>`
  },
  {
    concept: "Nazwane argumenty",
    content: `
      <p>Przy wywoływaniu funkcji można jawnie użyć nazw parametrów. Poprawia to czytelność i pozwala zmienić kolejność przekazywanych argumentów.</p>
      <pre><span class="fn">formatString</span>(
    text <span class="op">=</span> <span class="str">"Kotlin"</span>,
    uppercase <span class="op">=</span> <span class="kw">true</span>
)</pre>`
  },
  {
    concept: "Single-expression function",
    content: `
      <p>Jeśli funkcja składa się tylko z jednego wyrażenia, można pominąć klamry oraz instrukcję <code>return</code>, a ciało funkcji przypisać znakiem <code>=</code>.</p>
      <pre><span class="kw">fun</span> <span class="fn">square</span>(x: <span class="ty">Int</span>) <span class="op">=</span> x <span class="op">*</span> x</pre>`
  },
  {
    concept: "Funkcje rozszerzające",
    content: `
      <p>Pozwalają dodać nowe metody do istniejących już klas, bez dziedziczenia i bez używania wzorców projektowych takich jak Dekorator.</p>
      <pre><span class="kw">fun</span> <span class="ty">String</span>.<span class="fn">removeFirstLast</span>(): <span class="ty">String</span> {
    <span class="kw">return</span> <span class="kw">this</span>.substring(<span class="num">1</span>, <span class="kw">this</span>.length <span class="op">-</span> <span class="num">1</span>)
}</pre>`
  },
  {
    concept: "Funkcje wyższego rzędu",
    content: `
      <p>Higher-order functions to funkcje, które przyjmują inne funkcje jako argumenty lub je zwracają.</p>
      <pre><span class="kw">fun</span> <span class="fn">calculate</span>(x: <span class="ty">Int</span>, operation: (Int) -> <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">return</span> operation(x)
}</pre>`
  },
  {
    concept: "Wyrażenia lambda",
    content: `
      <p>Anonimowe funkcje (bloki kodu), które można przekazywać jako zmienne i zwięźle wywoływać w kodzie.</p>
      <pre><span class="kw">val</span> multiply <span class="op">=</span> { a: <span class="ty">Int</span>, b: <span class="ty">Int</span> -> a <span class="op">*</span> b }
      
<span class="kw">val</span> result <span class="op">=</span> <span class="fn">multiply</span>(<span class="num">3</span>, <span class="num">4</span>)</pre>`
  }
];

/* ================================================================
   STATE
================================================================ */
let currentIndex = 0;
const learnedSet = new Set();

/* ================================================================
   DOM ELEMENTS
================================================================ */
const flashcard      = document.getElementById('flashcard');
const conceptEl      = document.getElementById('card-concept');
const definitionEl   = document.getElementById('card-definition');
const badgeFront     = document.getElementById('badge-front');
const badgeBack      = document.getElementById('badge-back');

const btnPrev        = document.getElementById('btn-prev');
const btnNext        = document.getElementById('btn-next');
const btnLearn       = document.getElementById('btn-learn');

const progressFill   = document.getElementById('progress-fill');
const progressText   = document.getElementById('progress-text');

/* ================================================================
   LOGIC
================================================================ */
function renderCard(index) {
  const cardData = FLASHCARDS[index];
  
  // Update texts
  conceptEl.textContent = cardData.concept;
  definitionEl.innerHTML = cardData.content;
  
  // Update Buttons States
  btnPrev.disabled = index === 0;
  btnNext.disabled = index === FLASHCARDS.length - 1;

  // Update "Learned" state
  if (learnedSet.has(index)) {
    flashcard.classList.add('is-learned');
    badgeFront.textContent = 'Nauczone';
    badgeBack.textContent = 'Nauczone';
    btnLearn.classList.add('is-active');
    btnLearn.textContent = 'Wróć do powtórek';
  } else {
    flashcard.classList.remove('is-learned');
    badgeFront.textContent = 'Do nauki';
    badgeBack.textContent = 'Do nauki';
    btnLearn.classList.remove('is-active');
    btnLearn.textContent = '✓ Oznacz jako nauczone';
  }

  // Ensure card is not flipped when navigating
  flashcard.classList.remove('is-flipped');
}

function updateProgress() {
  const total = FLASHCARDS.length;
  const learnedCount = learnedSet.size;
  const percentage = (learnedCount / total) * 100;
  
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${learnedCount} / ${total} nauczone`;
}

function toggleLearned() {
  if (learnedSet.has(currentIndex)) {
    learnedSet.delete(currentIndex);
  } else {
    learnedSet.add(currentIndex);
  }
  updateProgress();
  renderCard(currentIndex);
}

/* ================================================================
   EVENT LISTENERS
================================================================ */
flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('is-flipped');
});

btnNext.addEventListener('click', () => {
  if (currentIndex < FLASHCARDS.length - 1) {
    currentIndex++;
    renderCard(currentIndex);
  }
});

btnPrev.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderCard(currentIndex);
  }
});

btnLearn.addEventListener('click', toggleLearned);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && !btnNext.disabled) {
    currentIndex++;
    renderCard(currentIndex);
  } else if (e.key === 'ArrowLeft' && !btnPrev.disabled) {
    currentIndex--;
    renderCard(currentIndex);
  } else if (e.key === ' ' || e.key === 'Enter') {
    // Prevent scrolling when pressing Spacebar to flip
    if(e.key === ' ') e.preventDefault(); 
    flashcard.classList.toggle('is-flipped');
  }
});

/* ================================================================
   INIT
================================================================ */
renderCard(currentIndex);
updateProgress();