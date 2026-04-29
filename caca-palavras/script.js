// ===============================
// INÍCIO SEGURO (CORREÇÃO PRINCIPAL)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // BANCO DE PALAVRAS
  // ===============================
  const wordSets = [
    "ALGAS", "OCEANO", "LAGO", "ÁGUA", "VIDA", "RIO", "LAGOA", "OXIGÊNIO",
    "FLUTUANTE", "PLANCTON", "REPRESA", "MACRÓFITA", "TROFIA",
    "FITOPLÂNCTON", "CLOROFILA", "MICROALGA", "DIATOMÁCEA",
    "DIVERSIDADE", "BIOINDICADOR", "CIANOTOXINA", "TURBIDEZ",
    "CIANOBACTÉRIA", "EUGLENÓFITA", "SEDIMENTAÇÃO", "UNICELULAR",
    "DESMÍDIA", "COLONIAL", "SUBMERSA"
  ];

  const facts = [
    "Fitoplâncton produz mais de 50% do oxigênio do planeta",
    "Diatomáceas possuem parede de sílica",
    "O Fitoplâncton é a base da cadeia alimentar aquática",
    "Cianobactérias são organismos fotossintéticos muito antigos",
    "Fitoplâncton vive principalmente na superfície da água",
    "A proliferação de fitoplâncton pode mudar a cor da água",
    "Alguns tipos de fitoplâncton brilham no escuro",
    "Diatomáceas ajudam na formação de sedimentos marinhos",
    "Algas microscópicas podem se multiplicar rapidamente",
    "O fitoplâncton é fundamental para os ecossistemas aquáticos",
    "Chamado de floresta invisível dos oceanos"
  ];

  let usedFacts = [];

  // ===============================
  // ELEMENTOS DOM (AGORA SEGURO)
  // ===============================
  const introScreen = document.getElementById("introScreen");
  const closeIntro = document.getElementById("closeIntro");
  const startBtn = document.getElementById("startBtn");

  const gridElement = document.getElementById("grid");
  const wordList = document.getElementById("wordList");

  const directions = [
    [0, 1], [0, -1],
    [1, 0], [-1, 0],
    [1, 1], [1, -1],
    [-1, 1], [-1, -1]
  ];

  // ===============================
  // CONTROLE DE JOGO
  // ===============================
  let rows = 11;
  let cols = 8;

  let grid = [];
  let words = [];
  let wordPositions = {};
  let isSelecting = false;
  let selectedCells = [];

  // ===============================
  // 🔥 START GAME (CORRIGIDO)
  // ===============================
  closeIntro.addEventListener("click", startGame);
  startBtn.addEventListener("click", startGame);

  function startGame() {
    introScreen.classList.add("hidden");
    initGame();
  }

  // ===============================
  // INICIALIZA JOGO
  // ===============================
  function initGame() {

    let success = false;

    while (!success) {
      words = getRandomWords(wordSets, 5);
      createEmptyGrid();
      success = tryPlaceAllWords();
    }

    fillEmptyCells();
    renderGrid();
    renderWords();
  }

  function getRandomWords(array, count) {
    return [...array].sort(() => Math.random() - 0.5).slice(0, count);
  }

  function createEmptyGrid() {
    grid = Array(rows).fill().map(() => Array(cols).fill(""));
    wordPositions = {};
  }

  function tryPlaceAllWords() {

    for (const word of words) {

      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 2000) {

        const dir = directions[Math.floor(Math.random() * directions.length)];

        const maxRow = dir[0] === 0 ? rows : rows - word.length;
        const maxCol = dir[1] === 0 ? cols : cols - word.length;

        const row = Math.floor(Math.random() * maxRow);
        const col = Math.floor(Math.random() * maxCol);

        if (canPlaceWord(word, row, col, dir[0], dir[1])) {
          placeWord(word, row, col, dir[0], dir[1]);
          placed = true;
        }

        attempts++;
      }

      if (!placed) return false;
    }

    return true;
  }

  function canPlaceWord(word, row, col, dr, dc) {
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;

      if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
      if (grid[r][c] !== "" && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  function placeWord(word, row, col, dr, dc) {

    wordPositions[word] = [];

    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;

      grid[r][c] = word[i];
      wordPositions[word].push([r, c]);
    }
  }

  function fillEmptyCells() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  function renderGrid() {
    gridElement.innerHTML = "";
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {

        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = grid[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;

        cell.addEventListener("pointerdown", startSelect);
        cell.addEventListener("pointermove", moveSelect);
        cell.addEventListener("pointerup", endSelect);

        gridElement.appendChild(cell);
      }
    }
  }

  function renderWords() {
    wordList.innerHTML = "";

    words.forEach(word => {
      const div = document.createElement("div");
      div.classList.add("word");
      div.textContent = word;
      div.dataset.word = word;
      wordList.appendChild(div);
    });
  }

  function startSelect(e) {
    isSelecting = true;
    selectedCells = [];
    clearSelection();
    addCell(e.target);
  }

  function moveSelect(e) {
    if (!isSelecting) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);

    if (element && element.classList.contains("cell")) {
      addCell(element);
    }
  }

  function endSelect() {
    isSelecting = false;
    checkWord();

    setTimeout(() => {
      clearSelection();
      selectedCells = [];
    }, 80);
  }

  function addCell(cell) {
    if (!cell.classList.contains("cell")) return;
    if (selectedCells.includes(cell)) return;

    cell.classList.add("selected");
    selectedCells.push(cell);
  }

  function clearSelection() {
    document.querySelectorAll(".cell.selected").forEach(c => {
      c.classList.remove("selected");
    });
  }

  function getSelectedPositions() {
    return selectedCells.map(c => [
      parseInt(c.dataset.row),
      parseInt(c.dataset.col)
    ]);
  }

  function comparePositions(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) {
        return false;
      }
    }
    return true;
  }

  function checkWord() {

    if (selectedCells.length === 0) return;

    const selectedPos = getSelectedPositions();
    let found = null;

    for (const word of words) {
      const correct = wordPositions[word];
      if (!correct) continue;

      if (
        comparePositions(selectedPos, correct) ||
        comparePositions(selectedPos, [...correct].reverse())
      ) {
        found = word;
        break;
      }
    }

    if (found) {

      const wordDiv = document.querySelector(`[data-word="${found}"]`);

      if (wordDiv && !wordDiv.classList.contains("found")) {
        wordDiv.classList.add("found");

        selectedCells.forEach(cell => {
          cell.classList.add("found");
          cell.classList.remove("selected");
        });

        showFact();
        checkWin();
      }
    }
  }

  function showFact() {

    if (usedFacts.length === facts.length) usedFacts = [];

    let availableFacts = facts.filter(f => !usedFacts.includes(f));

    const random = availableFacts[Math.floor(Math.random() * availableFacts.length)];

    usedFacts.push(random);

    const sound = document.getElementById("soundCorrect");
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }

    document.getElementById("infoText").textContent = random;
    document.getElementById("infoPopup").classList.remove("hidden");

    setTimeout(() => {
      document.getElementById("infoPopup").classList.add("hidden");
    }, 2500);
  }

  function checkWin() {

    const total = document.querySelectorAll(".word").length;
    const found = document.querySelectorAll(".word.found").length;

    if (total === found) {
      setTimeout(() => {
        document.getElementById("winScreen").classList.remove("hidden");
      }, 200);
    }
  }

  function resetGame() {

  // 🔥 esconde tela de vitória
  document.getElementById("winScreen").classList.add("hidden");

  // 🔥 limpa seleção visual
  document.querySelectorAll(".cell").forEach(c => {
    c.classList.remove("selected", "found");
  });

  document.querySelectorAll(".word").forEach(w => {
    w.classList.remove("found");
  });

  // 🔥 reseta variáveis
  isSelecting = false;
  selectedCells = [];
  words = [];
  wordPositions = {};

  // 🔥 gera novo jogo
  let success = false;

  while (!success) {
    words = getRandomWords(wordSets, 5);
    createEmptyGrid();
    success = tryPlaceAllWords();
  }

  fillEmptyCells();
  renderGrid();
  renderWords();
}

  document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
});

});