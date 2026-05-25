/* ================================================================
   CONFIG & MAPY OCEN (Skala 5-stopniowa)
================================================================ */
const GRADES = [
  { threshold: 95, title: "Genialnie! 👑", desc: "Jesteś absolutnym mistrzem Kotlina. Kod nie ma przed Tobą tajemnic!" },
  { threshold: 85, title: "Wspaniale! ⭐", desc: "Wykazałeś się doskonałą znajomością funkcji i struktur języka." },
  { threshold: 70, title: "Dobra robota! 👍", desc: "Stabilny, solidny wynik. Znasz fundamenty programowania w Kotlinie." },
  { threshold: 50, title: "Może być lepiej 📑", desc: "Udało Ci się zaliczyć większość zadań, ale warto przejrzeć materiały ponownie." },
  { threshold: 0,  title: "Powtórz materiał 📚", desc: "Wynik poniżej 50%. Nie poddawaj się! Przejdź teorię jeszcze raz i spróbuj ponownie." }
];

/* Definicje maksymalnych punktów dla modułów projektu */
const MAX_SCORES = {
  quiz: 5,     // Przyjmujemy standardowe 5 pytań w module Quiz
  bloczki: 3,  // 3 zadania widoczne w bloczki.js (sumOfList, isEven, factorial)
  kod: 4       // Punkty za uzupełnianie luk w kod.js
};

/* ================================================================
   STATE / DATA RETRIEVAL
================================================================ */
function getScores() {
  return {
    quiz: parseInt(localStorage.getItem('kotlin_learn_quiz_score')) || 0,
    bloczki: parseInt(localStorage.getItem('kotlin_learn_bloczki_score')) || 0,
    kod: parseInt(localStorage.getItem('kotlin_learn_kod_score')) || 0
  };
}

/* ================================================================
   LOGIC & UI ANIMATION
================================================================ */
function calculateAndRender() {
  const scores = getScores();
  
  // Agregacja punktacji
  const totalEarned = scores.quiz + scores.bloczki + scores.kod;
  const totalMax = MAX_SCORES.quiz + MAX_SCORES.bloczki + MAX_SCORES.kod;
  const percentage = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

  // Renderowanie rozbicia szczegółowego
  document.getElementById('score-quiz').textContent = `${scores.quiz} / ${MAX_SCORES.quiz}`;
  document.getElementById('score-bloczki').textContent = `${scores.bloczki} / ${MAX_SCORES.bloczki}`;
  document.getElementById('score-kod').textContent = `${scores.kod} / ${MAX_SCORES.kod}`;

  // Wyświetlenie łącznej liczby punktów
  document.getElementById('score-total-text').textContent = `${totalEarned} / ${totalMax} punktów`;

  // Dopasowanie oceny słownej na podstawie progu procentowego
  const evaluation = GRADES.find(g => percentage >= g.threshold);
  document.getElementById('summary-grade-title').textContent = evaluation.title;
  document.getElementById('summary-grade-desc').textContent = evaluation.desc;

  // Animowanie paska postępu (Fill-up)
  setTimeout(() => {
    const fillEl = document.getElementById('summary-progress-fill');
    if (fillEl) fillEl.style.width = `${percentage}%`;
  }, 150);

  // Animowany licznik procentów (od 0% do wyniku)
  animatePercentCounter(percentage);
}

function animatePercentCounter(targetPercent) {
  const percentEl = document.getElementById('score-percentage-text');
  let current = 0;
  if (targetPercent === 0) {
    percentEl.textContent = "0%";
    return;
  }
  const duration = 1000; // 1 sekunda animacji licznika
  const stepTime = Math.max(Math.floor(duration / targetPercent), 15);
  
  const timer = setInterval(() => {
    current++;
    percentEl.textContent = `${current}%`;
    if (current >= targetPercent) {
      clearInterval(timer);
    }
  }, stepTime);
}

/* ================================================================
   RESTART SYSTEM (Czyszczenie stanu aplikacji)
================================================================ */
function restartApplication() {
  if (confirm("Czy na pewno chcesz zresetować wszystkie postępy i zacząć naukę od nowa?")) {
    // Czyszczenie kluczy punktacyjnych powiązanych z modułami
    localStorage.removeItem('kotlin_learn_quiz_score');
    localStorage.removeItem('kotlin_learn_bloczki_score');
    localStorage.removeItem('kotlin_learn_kod_score');
    
    // Przekierowanie użytkownika na stronę główną (Menu)
    window.location.href = "../index.html";
  }
}

/* ================================================================
   INITIALIZATION
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  calculateAndRender();
  
  const restartBtn = document.getElementById('btn-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartApplication);
  }
});