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

console.log("✅ JS 로딩됨");
const screen = document.getElementById('connect-screen');
const gameArea = document.getElementById('game-area');
const countdownEl = document.getElementById('countdown');
const modal = document.getElementById('modal-container');
const startBtn = document.getElementById('start-btn');

function playSound(name) {
  const audio = new Audio(`/sound/${name}.wav`);
  audio.volume = 0.6;
  audio.play().catch(e => {
    console.warn("🔇 효과음 재생 실패:", e);
  });
}

const bg1 = '/image/connect_game1.png';
const bg2 = '/image/connect_game2.png';
const correctBg = '/image/connect_game3.png';
const wrongBg = '/image/connect_game4.png';

let bgToggle = true;
let bgInterval;
let selectedTiles = [];
let tileData = [];
let timeLeft = 100;
let score = 0;
let previousScore = 0;
let combo = 0;
let maxCombo = 0;
let timerInterval;
let wrongCount = 0; 


function startBackgroundLoop() {
  bgInterval = setInterval(() => {
    screen.style.backgroundImage = `url(${bgToggle ? bg1 : bg2})`;
    bgToggle = !bgToggle;
  }, 600);
}

function stopBackgroundLoop() {
  clearInterval(bgInterval);
}

function showCountdown(callback) {
  const countdownEl = document.getElementById("countdown");
  const blurEl = document.getElementById("blur-overlay");

  let count = 3;

  playSound("count"); 

  countdownEl.textContent = count;
  countdownEl.style.display = "block";
  countdownEl.style.animation = "none";
  void countdownEl.offsetWidth;
  countdownEl.style.animation = "countdown-bounce 1s ease";

  if (blurEl) blurEl.style.display = "block";

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else if (count === 0) {
      countdownEl.textContent = "시작!";
    } else {
      clearInterval(interval);
      countdownEl.style.display = "none";
      if (blurEl) blurEl.style.display = "none";
      callback(); 
    }

    countdownEl.style.animation = "none";
    void countdownEl.offsetWidth;
    countdownEl.style.animation = "countdown-bounce 1s ease";
  }, 1000);
}

function showCorrectFeedback(callback) {
  stopBackgroundLoop();
  screen.style.backgroundImage = `url(${correctBg})`;

  playSound("correct");

  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "<div>⭕<br>정답입니다!</div>";
  overlay.style.display = "block";
  overlay.classList.add("overlay-pop");

  setTimeout(() => {
    overlay.classList.remove("overlay-pop");
    overlay.innerHTML = "";
    overlay.style.display = "none";
    startBackgroundLoop();

    if (typeof callback === "function") {
      callback();
    }
  }, 800);
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createTiles(pairs) {
  const samplePairs = shuffle(pairs).slice(0, 15);
  const flatTiles = samplePairs.flatMap(pair => pair.items.map(item => ({
    ...item,
    pairId: pair.pairId
  })));

  tileData = shuffle(flatTiles);
  console.log("타일 수:", tileData.length);

  tileData.forEach(data => {
    const div = document.createElement('div');
    div.classList.add('tile');
    div.textContent = data.text;
    div.dataset.id = data.id;
    div.dataset.pairId = data.pairId;
    div.addEventListener('click', onTileClick);
    gameArea.appendChild(div);
  });
}

let isProcessing = false;

let comboTimer = null;

function onTileClick(e) {
  if (isProcessing) return;

  const tile = e.currentTarget;
  if (tile.classList.contains('matched')) return;

   playSound("click");

  if (selectedTiles.includes(tile)) {
    tile.classList.remove('selected');
    selectedTiles = selectedTiles.filter(t => t !== tile);
    return;
  }

  tile.classList.add('selected');
  selectedTiles.push(tile);

  if (selectedTiles.length === 2) {
    const [first, second] = selectedTiles;
    const pairMatch = first.dataset.pairId === second.dataset.pairId && first.dataset.id !== second.dataset.id;

    if (pairMatch) {
      isProcessing = true;
      score += 10;
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      updateStatusDisplay();
      updateScoreDisplay();
      if (combo >= 2) showComboText(combo);

      if (comboTimer) clearTimeout(comboTimer);
      comboTimer = setTimeout(() => {
        combo = 0;
        updateStatusDisplay();
      }, 3000);

     showCorrectFeedback(() => {
  first.textContent = '';
  second.textContent = '';
  first.classList.add('matched');
  second.classList.add('matched');
  first.style.pointerEvents = 'none';
  second.style.pointerEvents = 'none';

  const matchedCount = document.querySelectorAll('.tile.matched').length;
  const allMatched = matchedCount === tileData.length;
  if (allMatched) {
    if (timeLeft > 0) {
      setTimeout(() => {
        selectedTiles = [];
        resetGameTiles();  
      }, 500);
    } else {
      clearInterval(timerInterval);
      showResultModal();
    }
  }

  selectedTiles = [];
  isProcessing = false;
});

    } else {
      isProcessing = true;
      wrongCount++; 
      if (comboTimer) clearTimeout(comboTimer); 
      combo = 0;
      updateStatusDisplay();
      showWrongFeedback(() => {
        first.classList.remove('selected');
        second.classList.remove('selected');
        selectedTiles = [];
        isProcessing = false;
      });
    }
  }
}

function updateScoreDisplay() {
  const scoreEl = document.getElementById("score"); 
  if (!scoreEl) return;

  if (score !== previousScore) {
    scoreEl.textContent = `⭐ 점수: ${score}점`;
    scoreEl.classList.add("pop-score");
    setTimeout(() => scoreEl.classList.remove("pop-score"), 300);
    previousScore = score;
  }
}
function startTimer() {
  updateStatusDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateStatusDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResultModal();
    }
  }, 800);
}

function updateStatusDisplay() {
  document.getElementById('timer').textContent = `⏱ 남은 시간: ${timeLeft}초`;
  document.getElementById('score').textContent = `⭐ 점수: ${score}점`;
  document.getElementById('combo').textContent = `🔥 콤보: ${combo}`;
}

function showComboText(combo) {
  if (combo < 2) return;

  const comboText = document.getElementById("combo-text");
  comboText.textContent = `${combo} COMBO!`;

  comboText.classList.remove("correct-pop");
  void comboText.offsetWidth; 
  comboText.classList.add("correct-pop");

  comboText.style.display = "block";

  setTimeout(() => {
    comboText.style.display = "none";
  }, 1000);
}


function showResultModal() {
  playSound("game_over");  
  checkAchievements_CONNECT({
  score,
  combo,
  mistakeCount: wrongCount
});
  const resultText = `총 점수: ${score}점\n최고 콤보: ${maxCombo}`;
  document.getElementById("result-text").textContent = resultText;
  document.getElementById("result-modal").style.display = "flex";
}
document.getElementById("retry-btn").onclick = () => {
  playSound("click");
  setTimeout(() => {
    location.reload();
  }, 300);
};
document.getElementById("menu-btn").onclick = () => {
  playSound("click");
  setTimeout(() => {
    location.href = "menu.html";
  }, 300);
};

startBtn.addEventListener('click', () => {
    playSound("click");
  modal.style.display = 'none';
  showCountdown(() => {
    playRandomBGM(); 
    startBackgroundLoop();
    startTimer();
   createTiles(quizData);
  });
});
function showWrongFeedback(callback) {
  stopBackgroundLoop();
  screen.style.backgroundImage = `url(${wrongBg})`;

  playSound("wrong"); 


  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "<div>❌<br>오답입니다!</div>";
  overlay.style.display = "block";
  overlay.classList.add("overlay-pop");

  setTimeout(() => {
    overlay.classList.remove("overlay-pop");
    overlay.innerHTML = "";
    overlay.style.display = "none";
    startBackgroundLoop();

    if (typeof callback === "function") {
      callback();
    }
  }, 800);
}
function resetGameTiles() {
  gameArea.innerHTML = '';
 createTiles(quizData);
}
document.getElementById("menu-btn-start").addEventListener("click", () => {
  playSound("click");

  setTimeout(() => {
    localStorage.removeItem("selectedCharacter");
    localStorage.removeItem("selectedMode");
    localStorage.removeItem("nextGame");
    window.location.href = "menu.html";
  }, 300);
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
function checkAchievements_CONNECT({score, combo, mistakeCount}) {
  let playCount = parseInt(localStorage.getItem("connect_play_count") || "0");
  playCount++;
  localStorage.setItem("connect_play_count", playCount);
  if (playCount >= 5) completeTask(10);  

  if (score >= 100) completeTask(11);   

  if (mistakeCount === 0) completeTask(12); 

  if (combo >= 20) completeTask(13);   

  let totalScore = parseInt(localStorage.getItem("connect_score_total") || "0");
  totalScore += score;
  localStorage.setItem("connect_score_total", totalScore);
  if (totalScore >= 500) completeTask(14);  
}
function completeTask(id) {
  const character = localStorage.getItem('selectedCharacter');
  if (!character) return;

  const data = JSON.parse(localStorage.getItem('achievements') || "{}");

  if (!data[character]) {
    data[character] = {};
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

  const taskIDs = CHARACTER_TASKS[character] || [];

  if (character && saved[character]) {
    const count = taskIDs.filter(id => saved[character][id]).length;
    summaryBox.textContent = `도전과제 ${count} / ${taskIDs.length}개 완료`;
  } else {
    summaryBox.textContent = `도전과제 0 / ${taskIDs.length}개 완료`;
  }
});
function checkGlobalEnding() {
  const character = localStorage.getItem("selectedCharacter");
  if (!character) return;

  if (localStorage.getItem("endingShown") === "true") return;

  const saved = JSON.parse(localStorage.getItem("achievements") || "{}");
  const completed = saved[character] || [];

 const totalCount = Object.keys(TASK_DESCRIPTION_TEXTS).length;

const taskIDs = CHARACTER_TASKS[character] || [];
const isAllDone = taskIDs.every(id => completed[id] === true);
if (isAllDone) {
  localStorage.setItem("endingShown", "true");
  window.location.href = "ending.html";
}
}
function delayStart(mainFunction, delay = 1000) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      mainFunction();
    }, delay);
  });
}

if (typeof loadQuestion === "function") {
  delayStart(loadQuestion);
} else if (typeof startGame === "function") {
  delayStart(startGame);
} else if (typeof initGame === "function") {
  delayStart(initGame);
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".unit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const file = btn.dataset.file;
      if (!file) {
        console.error("❌ 단원 버튼에 data-file이 없습니다.");
        return;
      }
      const script = document.createElement("script");
      script.src = `/data/${file}`;
      script.onload = () => {
        console.log("✅ 단원 문제 로딩 성공:", file);
        startGameWithLoadedData();  // 문제 배열이 window.quizData에 들어 있다고 가정
      };
      script.onerror = () => {
        console.error("❌ 단원 문제 로딩 실패:", file);
      };
      document.body.appendChild(script);

      document.getElementById("unit-modal").style.display = "none";
      playSound("click");
    });
  });
});
