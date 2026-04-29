// ===============================
// INÍCIO SEGURO (CORREÇÃO PRINCIPAL)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // BANCO DE PALAVRAS
  // ===============================
  const wordSets = [
    "ALGAS", "OCEANO", "LAGO", "ÁGUA", "VIDA", "RIO", "PEIXE", "LAGOA","NÉCTON", "OXIGÊNIO","FOZ",
    "FLUTUANTE", "PLANCTON", "REPRESA", "MACRÓFITA", "TROFIA", "TURVO", "LÊNTICO", "FLUVIAL", "AÇUDE", "LÓTICO", "ESTUÁRIO",
    "FITOPLÂNCTON", "CLOROFILA", "MICROALGA", "DIATOMÁCEA", "RIACHO",
    "DIVERSIDADE", "BIOINDICADOR", "CIANOTOXINA", "TURBIDEZ",
    "CIANOBACTÉRIA", "EUGLENA", "COPÉPODE", "UNICELULAR",
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
    "Chamado de floresta invisível dos oceanos",
    "O plâncton é essencial para a vida aquática",
    "O fitoplâncton realiza fotossíntese na água",
    "Rios transportam nutrientes para lagos e oceanos",
    "Lagos podem ser ambientes de água parada",
    "Estuários misturam água doce e salgada",
    "A luz influencia o crescimento das algas",
    "Temperatura da água afeta os organismos",
    "Sedimentos acumulam matéria orgânica",
    "Zonas profundas têm menos luz",
    "O oxigênio dissolve-se na água",
    "A turbidez indica partículas em suspensão",
    "Macrófitas são plantas aquáticas",
    "O ciclo da água mantém os ecossistemas",
    "A biodiversidade é alta em ambientes aquáticos",
    "Peixes dependem do oxigênio dissolvido",
    "A eutrofização causa excesso de algas",
    "Nutrientes em excesso alteram o ecossistema",
    "O nécton nada livremente na coluna d’água",
    "O bentos vive no fundo dos ambientes aquáticos"
  ];

  let usedFacts = [];

  // ===============================
  // ELEMENTOS DOM
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
  
  // NOVAS VARIÁVEIS PARA SELEÇÃO SEQUENCIAL
  let isSelecting = false;
  let isDragging = false;
  let dragStartPos = null;
  let selectedCells = [];
  let currentDirection = null;
  let currentWordBeingFormed = null;

  // ===============================
  // START GAME
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
      words = getRandomWords(wordSets, 4);
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

  // ===============================
  // NOVO SISTEMA DE SELEÇÃO (ARRasto + CLIQUE SEQUENCIAL)
  // ===============================

  function resetSelection() {
    clearSelection();
    selectedCells = [];
    currentDirection = null;
    currentWordBeingFormed = null;
  }

  // Verifica se a célula (row, col) é uma vizinha válida da última célula selecionada
  // em qualquer uma das 8 direções (ortogonal ou diagonal)
  function isValidNextCell(row, col) {
    if (selectedCells.length === 0) return true;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    const lastRow = parseInt(lastCell.dataset.row);
    const lastCol = parseInt(lastCell.dataset.col);
    
    const dr = row - lastRow;
    const dc = col - lastCol;
    
    // Permite qualquer movimento de uma casa em linha, coluna ou diagonal
    if (Math.abs(dr) > 1 || Math.abs(dc) > 1 || (dr === 0 && dc === 0)) {
      return false;
    }
    
    // Se ainda não definimos a direção, tentamos determiná-la a partir da primeira e segunda células
    if (currentDirection === null) {
      currentDirection = [dr, dc];
      const firstCell = selectedCells[0];
      const firstRow = parseInt(firstCell.dataset.row);
      const firstCol = parseInt(firstCell.dataset.col);
      
      // Procura qual palavra tem a primeira célula e a mesma direção
      for (const word of words) {
        const wordDiv = document.querySelector(`[data-word="${word}"]`);
        if (wordDiv && wordDiv.classList.contains("found")) continue;
        const positions = wordPositions[word];
        if (!positions || positions.length < 2) continue;
        if (positions[0][0] === firstRow && positions[0][1] === firstCol) {
          const expDr = positions[1][0] - positions[0][0];
          const expDc = positions[1][1] - positions[0][1];
          if (expDr === dr && expDc === dc) {
            currentWordBeingFormed = word;
            break;
          }
        }
      }
    }
    
    // Com palavra e direção definidas, verifica se a próxima célula é a esperada
    if (currentWordBeingFormed) {
      const nextIndex = selectedCells.length;
      const positions = wordPositions[currentWordBeingFormed];
      if (nextIndex >= positions.length) return false;
      return (row === positions[nextIndex][0] && col === positions[nextIndex][1]);
    }
    
    return false;
  }

  function addCell(cell) {
    if (!cell.classList.contains("cell")) return;
    // Permite selecionar células já encontradas (found) – elas podem pertencer a outra palavra
    // Apenas impede que a mesma célula seja adicionada duas vezes na seleção atual
    if (selectedCells.some(c => c === cell)) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    if (!isValidNextCell(row, col)) {
      resetSelection();
      return;
    }
    
    cell.classList.add("selected");
    selectedCells.push(cell);
    checkWord();
  }

  function startSelect(e) {
    e.preventDefault();
    const cell = e.target;
    if (!cell.classList.contains("cell")) return;
    
    isSelecting = true;
    isDragging = false;
    dragStartPos = { x: e.clientX, y: e.clientY };
    
    // Se a célula já é a última selecionada, ignora (evita reset desnecessário)
    if (selectedCells.length > 0 && selectedCells[selectedCells.length - 1] === cell) return;
    
    if (selectedCells.length === 0) {
      // Primeira célula: sempre pode (mesmo se já estiver found)
      resetSelection(); // garante estado limpo
      cell.classList.add("selected");
      selectedCells.push(cell);
    } else {
      addCell(cell);
    }
  }

  function moveSelect(e) {
    if (!isSelecting) return;
    
    if (!isDragging && dragStartPos) {
      const dx = e.clientX - dragStartPos.x;
      const dy = e.clientY - dragStartPos.y;
      if (Math.hypot(dx, dy) > 5) {
        isDragging = true;
      }
    }
    
    if (isDragging) {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && element.classList.contains("cell")) {
        addCell(element);
      }
    }
  }

  function endSelect() {
    if (!isSelecting) return;
    isSelecting = false;
    isDragging = false;
    dragStartPos = null;
    // Não limpamos a seleção para permitir cliques sequenciais
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

  function comparePositionsOrdered(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) return false;
    }
    return true;
  }

  // ===============================
  // VERIFICA PALAVRA FINAL (APENAS ORDEM CORRETA)
  // ===============================
  function checkWord() {
    if (selectedCells.length === 0) return;
    
    const selectedPos = getSelectedPositions();
    let foundWord = null;
    
    for (const word of words) {
      const wordDiv = document.querySelector(`[data-word="${word}"]`);
      if (wordDiv && wordDiv.classList.contains("found")) continue;
      const correctPositions = wordPositions[word];
      if (!correctPositions) continue;
      
      if (comparePositionsOrdered(selectedPos, correctPositions)) {
        foundWord = word;
        break;
      }
    }
    
    if (foundWord) {
      const wordDiv = document.querySelector(`[data-word="${foundWord}"]`);
      if (wordDiv && !wordDiv.classList.contains("found")) {
        wordDiv.classList.add("found");
        
        selectedCells.forEach(cell => {
          cell.classList.add("found");
          cell.classList.remove("selected");
        });
        
        showFact();
        checkWin();
        resetSelection();
      }
    }
  }

  // ===============================
  // RESTO (SEM ALTERAÇÃO)
  // ===============================
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
    document.getElementById("winScreen").classList.add("hidden");
    document.querySelectorAll(".cell").forEach(c => {
      c.classList.remove("selected", "found");
    });
    document.querySelectorAll(".word").forEach(w => {
      w.classList.remove("found");
    });
    resetSelection();
    isSelecting = false;
    isDragging = false;
    dragStartPos = null;
    selectedCells = [];
    currentDirection = null;
    currentWordBeingFormed = null;
    words = [];
    wordPositions = {};
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

  document.getElementById("restartBtn").addEventListener("click", resetGame);

});