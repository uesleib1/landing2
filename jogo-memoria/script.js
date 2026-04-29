// ==========================
// ELEMENTOS
// ==========================
const gameBoard = document.getElementById("gameBoard");
const startScreen = document.getElementById("startScreen");
const winScreen = document.getElementById("winScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const homeBtn = document.getElementById("homeBtn");

const movesDisplay = document.getElementById("moves");
const matchesDisplay = document.getElementById("matches");

const gameStats = document.querySelector(".game-stats");

// PROGRESSO DE FASE
const levelText = document.getElementById("levelText");
const progressFill = document.getElementById("progressFill");
const levelProgress = document.querySelector(".level-progress");

// MODAL PRÓXIMA FASE
const nextLevelModal = document.getElementById("nextLevelModal");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const menuBtn = document.getElementById("menuBtn");

// MODAIS INFO
const quemSomosBtn = document.getElementById("quemSomosBtn");
const fitoBtn = document.getElementById("fitoBtn");

const quemSomosModal = document.getElementById("quemSomosModal");
const fitoModal = document.getElementById("fitoModal");

// STREAK POPUP
const streakPopup = document.getElementById("streakPopup");

// SONS
const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");

// CARTAS
const cardsArray = [
  "trach.jpg","mona.jpg","tetra.jpg","tabe.jpg",
  "phacu.jpg","micra.jpg","cosm.jpg","auct.jpg",
  "meris.jpg","spir.jpg","doli.jpg","xant.jpg"
];

// FASES
const levels = [
  { pairs: 3 },
  { pairs: 6 },
  { pairs: 8 },
  { pairs: 10 },
  { pairs: 12 },
  { pairs: 15 },
  { pairs: 18 },
  { pairs: 21 },
  { pairs: 24 }
];

let currentLevel = 0;
let gameCards = [];

// ESTADO
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let matches = 0;
let moves = 0;

// 🔥 STREAK
let streak = 0;

// ==========================
// STREAK MESSAGE
// ==========================
function showStreakMessage(streak) {
  let text = "";

  if (streak === 2) {
    text = "🔥 INCRÍVEL!";
  } 
  else if (streak === 3) {
    text = "💚 FITOPLÂNCTON EM BLOOM!";
  } 
  else {
    return;
  }

  streakPopup.textContent = text;
  streakPopup.classList.add("show");

  setTimeout(() => {
    streakPopup.classList.remove("show");
  }, 900);
}

// ==========================
// PROGRESS BAR UPDATE
// ==========================
function updateLevelUI() {
  const total = levels.length;
  const current = currentLevel + 1;

  levelText.textContent = `Fase ${current} de ${total}`;

  const percent = (current / total) * 100;
  progressFill.style.width = `${percent}%`;
}

// ==========================
// START GAME
// ==========================
startBtn.addEventListener("click", () => {
  currentLevel = 0;
  startScreen.classList.remove("active");
  startGame();
});

// ==========================
// RESTART GAME
// ==========================
restartBtn.addEventListener("click", () => {
  currentLevel = 0;
  winScreen.classList.remove("active");
  startGame();
});

// ==========================
// HOME BUTTON
// ==========================
homeBtn.addEventListener("click", () => {
  resetAll();
  startScreen.classList.add("active");
});

// ==========================
// MODAIS INFO
// ==========================
quemSomosBtn.addEventListener("click", () => {
  quemSomosModal.classList.add("active");
});

fitoBtn.addEventListener("click", () => {
  fitoModal.classList.add("active");
});

document.querySelectorAll(".closeBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".overlay").classList.remove("active");
  });
});

document.querySelectorAll(".overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
});

// ==========================
// NEXT LEVEL
// ==========================
nextLevelBtn.addEventListener("click", () => {
  nextLevelModal.classList.remove("active");
  startGame();
});

menuBtn.addEventListener("click", () => {
  resetAll();
  startScreen.classList.add("active");
});

// ==========================
// START GAME
// ==========================
function startGame() {
  const level = levels[currentLevel];
  const pairs = level.pairs;

  document.body.classList.add("game-active");

  gameStats.style.display = "flex";
  homeBtn.style.display = "block";
  levelProgress.style.display = "flex";

  gameBoard.innerHTML = "";

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  matches = 0;
  moves = 0;
  streak = 0;

  movesDisplay.textContent = moves;
movesDisplay.classList.add("stat-animate");

setTimeout(() => {
 movesDisplay.classList.remove("stat-animate");
}, 250);

matchesDisplay.textContent = matches;
matchesDisplay.classList.add("stat-animate");

setTimeout(() => {
  matchesDisplay.classList.remove("stat-animate");
}, 250);

  generateGameCards(pairs);
  setBoardLayout(pairs * 2);

  gameCards.forEach(img => {
    gameBoard.appendChild(createCard(img));
  });

  updateLevelUI();
}

// ==========================
// CARTAS
// ==========================
function generateGameCards(pairs) {
  const shuffled = [...cardsArray].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, pairs);

  gameCards = [...selected, ...selected];
  shuffle(gameCards);
}

// ==========================
// GRID
// ==========================
function getGridColumns(totalCards) {
  if (totalCards <= 6) return 3;
  if (totalCards <= 12) return 4;
  if (totalCards <= 20) return 5;
  if (totalCards <= 30) return 6;
  return 7;
}

function setBoardLayout(totalCards) {
  gameBoard.style.gridTemplateColumns =
    `repeat(${getGridColumns(totalCards)}, 1fr)`;
}

// ==========================
// CREATE CARD
// ==========================
function createCard(img) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.image = img;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <img src="img/${img}">
      </div>
      <div class="card-back">
        <img src="img/verso.jpg">
      </div>
    </div>
  `;

  card.addEventListener("click", handleClick);
  return card;
}

// ==========================
// CLICK
// ==========================
function handleClick() {
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains("matched")) return;

  this.classList.add("flipped");

  flipSound.currentTime = 0;
  flipSound.play().catch(() => {});

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  moves++;
  movesDisplay.textContent = moves;

  setTimeout(checkMatch, 300);
}

// ==========================
// CHECK MATCH
// ==========================
function checkMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;

  if (isMatch) {
    matchSound.play().catch(() => {});

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matches++;
    matchesDisplay.textContent = matches;

    streak++;
    showStreakMessage(streak);

    resetTurn();
    checkWin();

  } else {
    streak = 0;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 800);
  }
}

// ==========================
// WIN CHECK
// ==========================
function checkWin() {
  const totalMatched = document.querySelectorAll(".card.matched").length;
  const totalCards = gameCards.length;

  if (totalMatched === totalCards) {
    setTimeout(() => {

      currentLevel++;

      closeAllOverlays();

      if (currentLevel >= levels.length) {
        winScreen.classList.add("active");
      } else {
        nextLevelModal.classList.add("active");
      }

    }, 600);
  }
}

// ==========================
// RESET TURN
// ==========================
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// ==========================
// RESET ALL
// ==========================
function resetAll() {
  document.body.classList.remove("game-active");

  gameBoard.innerHTML = "";

  gameStats.style.display = "none";
  homeBtn.style.display = "none";
  levelProgress.style.display = "none";

  nextLevelModal.classList.remove("active");
  winScreen.classList.remove("active");

  resetTurn();

  matches = 0;
  moves = 0;
  currentLevel = 0;
  streak = 0;

  updateLevelUI();
}

// ==========================
// CLOSE OVERLAYS
// ==========================
function closeAllOverlays() {
  document.querySelectorAll(".overlay").forEach(o => {
    o.classList.remove("active");
  });
}

// ==========================
// SHUFFLE
// ==========================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}