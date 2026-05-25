/* ================================================================
   DATA — each exercise defines lines (in correct order) plus a
   render function that emits highlighted HTML for display.
================================================================ */
 
const EXERCISES = [
  /* 0 — sumOfList */
  {
    lines: [
      { id:'e0l0', text:`fun sumOfList(numbers: List<Int>): Int {` },
      { id:'e0l1', text:`    var sum = 0` },
      { id:'e0l2', text:`    for (n in numbers) {` },
      { id:'e0l3', text:`        sum += n` },
      { id:'e0l4', text:`    }` },
      { id:'e0l5', text:`    return sum` },
      { id:'e0l6', text:`}` },
    ]
  },
  /* 1 — isEven */
  {
    lines: [
      { id:'e1l0', text:`fun isEven(n: Int): Boolean {` },
      { id:'e1l1', text:`    if (n % 2 == 0) {` },
      { id:'e1l2', text:`        return true` },
      { id:'e1l3', text:`    } else {` },
      { id:'e1l4', text:`        return false` },
      { id:'e1l5', text:`    }` },
      { id:'e1l6', text:`}` },
    ]
  },
  /* 2 — factorial */
  {
    lines: [
      { id:'e2l0', text:`fun factorial(n: Int): Long {` },
      { id:'e2l1', text:`    if (n <= 1) return 1L` },
      { id:'e2l2', text:`    return n * factorial(n - 1)` },
      { id:'e2l3', text:`}` },
    ]
  },
];
 
/* ================================================================
   SYNTAX HIGHLIGHT — very lightweight tokeniser
================================================================ */
function highlight(raw) {
  // escape HTML first
  let s = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // strings
  s = s.replace(/(".*?"|'.*?')/g, '<span class="str">$1</span>');
  // comments
  s = s.replace(/(\/\/.*$)/gm, '<span class="cm">$1</span>');
  // keywords
  const kws = ['fun','val','var','if','else','return','for','in','true','false','while','when','null'];
  kws.forEach(k => {
    s = s.replace(new RegExp(`\\b(${k})\\b`, 'g'), '<span class="kw">$1</span>');
  });
  // types (capitalised words)
  s = s.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, '<span class="ty">$1</span>');
  // numbers
  s = s.replace(/\b(\d+[Ll]?)\b/g, '<span class="num">$1</span>');
  return s;
}
 
/* ================================================================
   STATE
================================================================ */
let solved = [false, false, false];
 
// Shuffled starting order (Fisher–Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
 
/* ================================================================
   DOM BUILDING
================================================================ */
function buildBlock(line, inDrop) {
  const el = document.createElement('div');
  el.className = 'code-block';
  el.dataset.id = line.id;
  el.innerHTML = highlight(line.text);
  attachDrag(el);
  attachTouch(el);
  return el;
}
 
function buildAll() {
  EXERCISES.forEach((ex, i) => {
    const pool = document.getElementById(`source-${i}`);
    pool.innerHTML = '';
    shuffle(ex.lines).forEach(line => {
      pool.appendChild(buildBlock(line, false));
    });
    const drop = document.getElementById(`drop-${i}`);
    drop.innerHTML = '';
  });
  updateProgress();
}
 
/* ================================================================
   HTML5 DRAG AND DROP
================================================================ */
let dragEl = null;
 
function attachDrag(el) {
  el.draggable = true;
  el.addEventListener('dragstart', onDragStart);
  el.addEventListener('dragend',   onDragEnd);
}
 
function onDragStart(e) {
  dragEl = e.currentTarget;
  dragEl.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragEl.dataset.id);
}
 
function onDragEnd(e) {
  if (dragEl) dragEl.classList.remove('dragging');
  removeIndicators();
  dragEl = null;
  document.querySelectorAll('.source-pool, .drop-zone').forEach(z => z.classList.remove('drag-over'));
}
 
function setupZones() {
  document.querySelectorAll('.source-pool, .drop-zone').forEach(zone => {
    zone.addEventListener('dragover',  onDragOver);
    zone.addEventListener('dragleave', onDragLeave);
    zone.addEventListener('drop',      onDrop);
  });
}
 
function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const zone = e.currentTarget;
  zone.classList.add('drag-over');
 
  if (zone.classList.contains('drop-zone')) {
    showIndicator(zone, e.clientY);
  }
}
 
function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
    removeIndicators();
  }
}
 
function onDrop(e) {
  e.preventDefault();
  const zone = e.currentTarget;
  zone.classList.remove('drag-over');
  removeIndicators();
 
  if (!dragEl) return;
 
  if (zone.classList.contains('source-pool')) {
    zone.appendChild(dragEl);
  } else {
    // drop-zone: insert at correct position
    const after = getDropTarget(zone, e.clientY);
    if (after) zone.insertBefore(dragEl, after);
    else zone.appendChild(dragEl);
  }
  dragEl.classList.remove('dragging');
}
 
function getDropTarget(container, y) {
  const blocks = [...container.querySelectorAll('.code-block:not(.dragging)')];
  return blocks.find(b => {
    const rect = b.getBoundingClientRect();
    return y < rect.top + rect.height / 2;
  }) || null;
}
 
/* ─── drop indicator ─────────────────────────────────────────── */
function showIndicator(zone, clientY) {
  removeIndicators();
  const after = getDropTarget(zone, clientY);
  const ind = document.createElement('div');
  ind.className = 'drop-indicator';
  if (after) zone.insertBefore(ind, after);
  else zone.appendChild(ind);
}
function removeIndicators() {
  document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
}
 
/* ================================================================
   TOUCH DRAG (mobile)
================================================================ */
let touchBlock = null;
let ghost = null;
let touchOffX = 0, touchOffY = 0;
 
function attachTouch(el) {
  el.addEventListener('touchstart', onTouchStart, { passive: false });
}
 
function onTouchStart(e) {
  const orig = e.currentTarget;
  touchBlock = orig;
  const rect = orig.getBoundingClientRect();
  const touch = e.touches[0];
  touchOffX = touch.clientX - rect.left;
  touchOffY = touch.clientY - rect.top;
 
  ghost = orig.cloneNode(true);
  ghost.className = 'code-block ghost';
  ghost.style.width = rect.width + 'px';
  ghost.style.left  = (touch.clientX - touchOffX) + 'px';
  ghost.style.top   = (touch.clientY - touchOffY) + 'px';
  document.body.appendChild(ghost);
  orig.classList.add('dragging');
 
  document.addEventListener('touchmove',  onTouchMove,  { passive: false });
  document.addEventListener('touchend',   onTouchEnd,   { passive: false });
  document.addEventListener('touchcancel',onTouchEnd,   { passive: false });
}
 
function onTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  ghost.style.left = (touch.clientX - touchOffX) + 'px';
  ghost.style.top  = (touch.clientY - touchOffY) + 'px';
 
  // highlight hovered zone
  ghost.style.display = 'none';
  const underEl = document.elementFromPoint(touch.clientX, touch.clientY);
  ghost.style.display = '';
 
  document.querySelectorAll('.source-pool, .drop-zone').forEach(z => z.classList.remove('drag-over'));
  const zone = underEl && underEl.closest('.source-pool, .drop-zone');
  if (zone) {
    zone.classList.add('drag-over');
    if (zone.classList.contains('drop-zone')) showIndicator(zone, touch.clientY);
    else removeIndicators();
  } else {
    removeIndicators();
  }
}
 
function onTouchEnd(e) {
  document.removeEventListener('touchmove',  onTouchMove);
  document.removeEventListener('touchend',   onTouchEnd);
  document.removeEventListener('touchcancel',onTouchEnd);
 
  const touch = (e.changedTouches || e.touches)[0];
  ghost.style.display = 'none';
  const underEl = document.elementFromPoint(touch.clientX, touch.clientY);
  ghost.style.display = '';
  ghost.remove();
 
  if (touchBlock) touchBlock.classList.remove('dragging');
  removeIndicators();
  document.querySelectorAll('.source-pool, .drop-zone').forEach(z => z.classList.remove('drag-over'));
 
  const zone = underEl && underEl.closest('.source-pool, .drop-zone');
  if (zone && touchBlock) {
    if (zone.classList.contains('source-pool')) {
      zone.appendChild(touchBlock);
    } else {
      const after = getDropTarget(zone, touch.clientY);
      if (after) zone.insertBefore(touchBlock, after);
      else zone.appendChild(touchBlock);
    }
  }
 
  touchBlock = null;
  ghost = null;
}
 
/* ================================================================
   CHECK / RESET
================================================================ */
function check(i) {
  const ex   = EXERCISES[i];
  const drop = document.getElementById(`drop-${i}`);
  const card = document.getElementById(`ex-${i}`);
  const fb   = document.getElementById(`fb-${i}`);
  const badge= document.getElementById(`badge-${i}`);
 
  const placed = [...drop.querySelectorAll('.code-block')].map(el => el.dataset.id);
 
  // must have placed ALL lines
  if (placed.length !== ex.lines.length) {
    showFeedback(fb, false, 'Przeciągnij wszystkie linie do strefy przed sprawdzeniem.');
    flashCard(card, false);
    badge.textContent = 'Błąd';
    return;
  }
 
  const correct = ex.lines.every((line, idx) => line.id === placed[idx]);
 
  if (correct) {
    showFeedback(fb, true, '✓ Świetnie! Kolejność jest poprawna.');
    card.classList.remove('errored');
    card.classList.add('solved');
    badge.textContent = 'Ukończono';
    solved[i] = true;
    // disable further drags on solved exercise
    drop.querySelectorAll('.code-block').forEach(el => { el.draggable = false; el.style.cursor = 'default'; });
  } else {
    showFeedback(fb, false, '✗ Kolejność jest nieprawidłowa. Spróbuj ponownie.');
    card.classList.remove('solved');
    card.classList.add('errored');
    badge.textContent = 'Błąd';
    solved[i] = false;
    // re-trigger shake
    void card.offsetWidth;
    card.classList.add('errored');
  }
 
  updateProgress();
}
 
function reset(i) {
  solved[i] = false;
  const card  = document.getElementById(`ex-${i}`);
  const pool  = document.getElementById(`source-${i}`);
  const drop  = document.getElementById(`drop-${i}`);
  const fb    = document.getElementById(`fb-${i}`);
  const badge = document.getElementById(`badge-${i}`);
 
  card.classList.remove('solved','errored');
  badge.textContent = 'Oczekuje';
  fb.className = 'feedback';
  fb.textContent = '';
 
  // move everything back to pool, shuffle
  const allBlocks = [
    ...drop.querySelectorAll('.code-block'),
    ...pool.querySelectorAll('.code-block'),
  ];
  pool.innerHTML = '';
  drop.innerHTML = '';
 
  shuffle(allBlocks).forEach(el => {
    el.draggable = true;
    el.style.cursor = '';
    attachDrag(el);
    pool.appendChild(el);
  });
 
  updateProgress();
}
 
function showFeedback(el, ok, msg) {
  el.className = 'feedback show ' + (ok ? 'success' : 'error');
  el.textContent = msg;
}
 
function updateProgress() {
  const n = solved.filter(Boolean).length;
  const total = EXERCISES.length;
  document.getElementById('progress-fill').style.width = (n / total * 100) + '%';
  document.getElementById('progress-text').textContent = `${n} / ${total} ukończone`;
}
 
/* ================================================================
   INIT
================================================================ */
buildAll();
setupZones();