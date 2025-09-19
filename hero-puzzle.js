const TASK_DESCRIPTION_TEXTS = {
  0: '타임어택 5회 플레이',
  1: '타임어택 25점 이상',
  2: '타임어택 15콤보 달성',
  3: '타임어택 모든 문제 정답',
  4: '타임어택 누적 100점 이상',
  5: 'OX퀴즈 5회 플레이',
  6: 'OX퀴즈 25점 이상',
  7: 'OX퀴즈 15콤보 달성',
  8: 'OX퀴즈 모든 문제 정답',
  9: 'OX퀴즈 누적 100점 이상',
  10: '연결게임 5회 플레이',
  11: '연결게임 100점 이상',
  12: '연결게임 모든 문제 정답',
  13: '연결게임 20콤보 달성',
  14: '연결게임 누적 500점 이상',
  18: '도전! 역사왕! 5회 플레이',
  19: '도전! 역사왕! 누적 50점 이상',
  20: '도전! 역사왕! 모든 문제 정답',
  21: '도전! 역사왕! 누적 플레이 시간 10분 이상',
  27: '위인퀴즈 5회 플레이',
  28: '위인퀴즈 누적 정답수 100개 달성',
  29: '위인퀴즈 누적 150점 이상',
  30: '위인퀴즈 콤보 10 이상',
  31: '위인퀴즈 모든 문제 정답',
  32: '닮은 위인 찾기 5회 사진 업로드',
  33: '닮은 위인 찾기 누적 플레이 시간 10분 이상',
  34: '닮은 위인 찾기 결과 페이지 5분이상 보기',
  35: '닮은 위인 찾기 5회 이상 반복',
  36: '닮은 위인 찾기 같은 위인 보기',
  37: '위인 퍼즐 3x3 클리어',
  38: '위인 퍼즐 4x4 클리어',
  39: '위인 퍼즐 5x5 클리어',
  40: '위인 퍼즐 5분 내 클리어',
  41: '위인 퍼즐 힌트없이 클리어',
  42: '위인 퍼즐 50회 이하 이동으로 클리어',
  43: '연습모드 객관식 5분이상 보기',
  44: '연습모드 주관식 5분이상 보기',
  45: '연습모드 그림퀴즈 5분이상 보기',
  46: '연습모드 20회 검색하기',
  50: '오늘의 사건 같은 카드 2번 이상 보기',
  51: '오늘의 사건 누적 10분 사용',
  52: '오늘의 사건 10회 보기',
  53: '오늘의 위인 같은 카드 2번 이상 보기',
  54: '오늘의 위인 누적 10분 사용',
  55: '오늘의 위인 10회 보기',
  56: '오늘의 유물 같은 카드 2번 이상 보기',
  57: '오늘의 유물 누적 10분 사용',
  58: '오늘의 유물 10회 보기'
};
const CHARACTER_TASKS = {
  "별별이": [0, 1, 2, 5, 6, 10, 18, 29, 32, 43, 50, 56],
  "북북이": [3, 4, 7, 9, 13, 14, 37, 38, 39, 44, 45, 57],
  "패패":   [11, 12, 20, 28, 30, 31, 33, 35, 36, 40, 41, 55],
  "반반이": [8, 19, 21, 34, 42, 46, 51, 52, 53, 54, 58]
};
const puzzleScreen = document.getElementById("puzzle-screen");
const startModal = document.getElementById("start-modal");
const resultModal = document.getElementById("result-modal");

let gridSize = 5;
let tiles = [];
let emptyTile;
let imageURL = "";
let currentFigure = null;

let elapsedSeconds = 0;
let moveCount = 0;
let timerInterval;

let hintMode = false;
let hintSelected = [];
let hintCount = 3; 

function selectDifficulty(size) {
   const audio = new Audio("/sound/click.wav");
      audio.play().catch(() => {});
  gridSize = size;
  emptyTile = gridSize * gridSize - 1;
  startModal.style.display = "none";
  loadRandomFigureAndStart();
}

function loadRandomFigureAndStart() {
  const data = heroPuzzleData; 
  const random = data[Math.floor(Math.random() * data.length)];
  currentFigure = random;
  imageURL = random.imgPath;  

  countdownAndStart(); 
}

function startGame() {
    playRandomBGM(); 
    puzzleScreen.style.display = "grid";
  generateTiles();
  shuffleTiles();
  renderTiles();

  elapsedSeconds = 0;
  moveCount = 0;
  updatePuzzleInfo();
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updatePuzzleInfo();
  }, 1000);
}

function generateTiles() {
  tiles = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    tiles.push(i);
  }
  emptyTile = tiles.length - 1;
}

function shuffleTiles() {
  for (let i = 0; i < 300; i++) {
    const emptyIndex = tiles.indexOf(emptyTile);
    const movable = getMovableTiles(emptyIndex);
    const randIndex = Math.floor(Math.random() * movable.length);
    const target = movable[randIndex];
    swapTiles(emptyIndex, target);
  }
}

function getMovableTiles(emptyIndex) {
  const row = Math.floor(emptyIndex / gridSize);
  const col = emptyIndex % gridSize;
  const moves = [];

  if (row > 0) moves.push(emptyIndex - gridSize);
  if (row < gridSize - 1) moves.push(emptyIndex + gridSize);
  if (col > 0) moves.push(emptyIndex - 1);
  if (col < gridSize - 1) moves.push(emptyIndex + 1);

  return moves;
}

function swapTiles(i, j) {
  [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
}

function renderTiles() {
  document.querySelectorAll("#puzzle-screen .tile").forEach(tile => tile.remove());

  puzzleScreen.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  puzzleScreen.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  tiles.forEach((tile, index) => {
    const div = document.createElement("div");
    div.className = "tile";

    if (tile === emptyTile) {
      div.style.background = "none";
    } else {
      const row = Math.floor(tile / gridSize);
      const col = tile % gridSize;
      div.style.backgroundImage = `url(${imageURL})`;
      div.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
      div.style.backgroundPosition = `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`;
    }

    div.onclick = () => {
       const audio = new Audio("/sound/click.wav");
      audio.play().catch(() => {});
      if (hintMode) {
        handleHintClick(index, div);
      } else {
        tryMove(index);
      }
    };

    puzzleScreen.appendChild(div);
  });

  const hintMessage = document.getElementById("hint-message");
  if (hintMessage) {
    hintMessage.style.display = "none";
  }
}

function tryMove(clickedIndex) {
  const emptyIndex = tiles.indexOf(emptyTile);
  const valid = getMovableTiles(emptyIndex);

  if (valid.includes(clickedIndex)) {
    swapTiles(clickedIndex, emptyIndex);
    moveCount++;
    renderTiles();
    updatePuzzleInfo();
    checkWin();
  }
}

function updatePuzzleInfo() {
  document.getElementById("elapsed-time").textContent = `⏱ 경과 시간: ${elapsedSeconds}초`;
  document.getElementById("move-count").textContent = `🔁 이동 수: ${moveCount}회`;
  document.getElementById("hint-remaining").textContent = `💡 힌트: ${hintCount}회`;
}

function checkWin() {
  const lastIndex = tiles.length - 1;

  const isSolved = tiles.slice(0, lastIndex).every((tile, index) => tile === index) &&
                   tiles[lastIndex] === emptyTile;

  console.log("🧩 퍼즐 상태:", tiles);
  console.log("🧩 퍼즐 완성 여부:", isSolved);


  if (isSolved) {
    clearInterval(timerInterval);
      checkAchievements_PUZZLE({
    gridSize: gridSize,
    elapsedTime: elapsedSeconds,
    hintUsed: hintCount < 3,
    moveCount: moveCount
  });
    setTimeout(() => {
      const hintsUsed = 3 - hintCount;

      document.getElementById("result-text").innerHTML =
        `🎉 퍼즐 완성!<br><strong>${currentFigure.name}</strong><br><br>` +
        `⏱ 경과 시간: ${elapsedSeconds}초<br>` +
        `🔁 이동 수: ${moveCount}회<br>` +
        `💡 힌트 사용: ${hintsUsed}회`;

      const resultSound = new Audio("/sound/game_over.wav");
      resultSound.play().catch(() => {});

      resultModal.style.display = "flex";
    }, 300);
  }
}


function activateHintMode() {
  hintMode = !hintMode;  

  const hintMessage = document.getElementById('hint-message');

  if (hintMode) {
    hintMessage.style.display = 'block';
  } else {
    hintMessage.style.display = 'none';
    selectedTiles = [];  
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.classList.remove('selected'));
  }
}



function handleHintClick(index, div) {
  if (hintSelected.includes(index)) {
    hintSelected = hintSelected.filter(i => i !== index);
    div.classList.remove("selected");
    return;
  }

  hintSelected.push(index);
  div.classList.add("selected");

  if (hintSelected.length === 2) {
    swapTiles(hintSelected[0], hintSelected[1]);
    moveCount++;
    hintMode = false;
    hintSelected = [];
    hintCount--;

    renderTiles();
    updatePuzzleInfo();
    checkWin();

    if (hintCount <= 0) {
      const btn = document.querySelector("button[onclick='activateHintMode()']");
      if (btn) btn.disabled = true;
    }
  }
}
function endGameImmediately() {
  clearInterval(timerInterval);
  document.getElementById("result-text").innerHTML =
    `🎉 퍼즐 완성!<br><strong>${currentFigure?.name || '위인 이름'}</strong><br><br>` +
    `⏱ 경과 시간: ${elapsedSeconds}초<br>` +
    `🔁 이동 수: ${moveCount}회`;

  document.getElementById("result-modal").style.display = "flex";
}

function countdownAndStart() {
  const countdownEl = document.getElementById("countdown");
  let count = 3;
   const countdownSound = new Audio("/sound/count.wav");
  countdownSound.play().catch(() => {});

  countdownEl.style.display = "block";
  countdownEl.textContent = count;

  countdownEl.style.animation = "none";
  void countdownEl.offsetWidth; 
  countdownEl.style.animation = "countdown-bounce 1s ease";

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
      countdownEl.style.animation = "none";
      void countdownEl.offsetWidth;
      countdownEl.style.animation = "countdown-bounce 1s ease";
    } else if (count === 0) {
      countdownEl.textContent = "시작!";
      countdownEl.style.animation = "none";
      void countdownEl.offsetWidth;
      countdownEl.style.animation = "countdown-bounce 1s ease";
    } else {
      clearInterval(interval);
      countdownEl.style.display = "none";
      startGame();
    }
  }, 1000);
}
document.addEventListener("click", (e) => {
  if (
    e.target.tagName === "BUTTON" &&
    !e.target.classList.contains("no-click-sound")
  ) {
    const audio = new Audio("/sound/click.wav");
    audio.play().catch((err) => {
      console.warn("🔇 버튼 클릭 사운드 실패:", err);
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const retryBtn = document.getElementById("retry-btn");
  const menuBtn = document.getElementById("menu-btn");

  if (retryBtn) {
    retryBtn.onclick = () => {
      const audio = new Audio("/sound/click.wav");
      audio.play().catch(() => {});
      setTimeout(() => {
        location.reload();
      }, 300);
    };
  }

  if (menuBtn) {
    menuBtn.onclick = () => {
      const audio = new Audio("/sound/click.wav");
      audio.play().catch(() => {});
      setTimeout(() => {
        location.href = "/menu.html"; 
      }, 300);
    };
  }
});
function playRandomBGM() {
  const bgmList = [
    "/sound/music/bgm1.mp3", 
    "/sound/music/bgm2.mp3", 
    "/sound/music/bgm3.mp3", 
    "/sound/music/bgm4.mp3", 
    "/sound/music/bgm5.mp3", 
    "/sound/music/bgm6.mp3", 
    "/sound/music/bgm7.mp3", 
    "/sound/music/bgm8.mp3", 
    "/sound/music/bgm9.mp3"  
  ];

  const randomIndex = Math.floor(Math.random() * bgmList.length);
  const bgm = new Audio(bgmList[randomIndex]);
  bgm.loop = true;
  bgm.volume = 0.5;
  bgm.play().catch(() => {});
  window.bgm = bgm; 
}
function checkAchievements_PUZZLE({ gridSize, elapsedTime, hintUsed, moveCount }) {
  const keyMap = {
    3: "puzzle_3x3",
    4: "puzzle_4x4",
    5: "puzzle_5x5"
  };
  const key = keyMap[gridSize];
  if (key) {
    let count = parseInt(localStorage.getItem(key) || "0");
    count++;
    localStorage.setItem(key, count);
    if (gridSize === 3 && count >= 5) completeTask(37); 
    if (gridSize === 4 && count >= 5) completeTask(38); 
    if (gridSize === 5 && count >= 5) completeTask(39); 
  }

  
  if (elapsedTime <= 300) completeTask(40);

  
  if (!hintUsed) completeTask(41);

  
  if (moveCount <= 50) completeTask(42);
}
function completeTask(id) {
  const character = localStorage.getItem('selectedCharacter');
  if (!character) return;

  const data = JSON.parse(localStorage.getItem('achievements') || "{}");

  if (!data[character]) {
    data[character] = {};
    const taskIDs = CHARACTER_TASKS[character] || [];
    taskIDs.forEach(tid => {
      data[character][tid] = false;
    });
  }

  if (data[character][id]) return;

  data[character][id] = true;
  localStorage.setItem('achievements', JSON.stringify(data));
  console.log(`✅ [${character}] 도전과제 ${id} 저장 완료`);

  const popup = document.getElementById('achievement-popup');
  if (popup) {
    popup.style.display = 'block';
    popup.textContent = `🎉 도전과제 ${id} 달성!`;
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000);  
  }

  checkGlobalEnding();
}
document.addEventListener("DOMContentLoaded", function () {
  const summaryBox = document.getElementById("achievement-summary");
  if (!summaryBox) return;

  const character = localStorage.getItem("selectedCharacter");
  const saved = JSON.parse(localStorage.getItem("achievements") || "{}");

  if (character) {
    const taskIDs = CHARACTER_TASKS[character] || [];
    const completedCount = taskIDs.filter(id => saved[character] && saved[character][id]).length;
    summaryBox.textContent = `도전과제 ${completedCount} / ${taskIDs.length}개 완료`;
  } else {
    summaryBox.textContent = `도전과제 0 / 0개 완료`;
  }
});
function checkGlobalEnding() {
  const character = localStorage.getItem("selectedCharacter");
  if (!character) return;
  if (localStorage.getItem("endingShown") === "true") return;

  const saved = JSON.parse(localStorage.getItem("achievements") || "{}");
  const taskIDs = CHARACTER_TASKS[character] || [];
  const completed = saved[character] || {};

  const isAllDone = taskIDs.every(id => completed[id]);
  if (isAllDone) {
    localStorage.setItem("endingShown", "true");
    window.location.href = "ending.html";
  }
}
