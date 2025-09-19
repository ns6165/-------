console.log("✅ JS 로딩됨");
const screen = document.getElementById('connect-screen');
const gameArea = document.getElementById('game-area');
const countdownEl = document.getElementById('countdown');
const modal = document.getElementById('modal-container');

const bg1 = './image/connect_game1.png';
const bg2 = './image/connect_game2.png';
const correctBg = './image/connect_game3.png';
const wrongBg = './image/connect_game4.png';

const clickSound = new Audio("./sound/click.wav");
const correctSound = new Audio("./sound/correct.wav");
const wrongSound = new Audio("./sound/wrong.wav");
const countSound = new Audio("./sound/count.wav");
const resultSound = new Audio("./sound/game_over.wav");

let bgToggle = true;
let bgInterval;
let selectedTiles = [];
let tileData = [];

let timeLeft = 60;
let score = 0;
let previousScore = 0;
let combo = 0;
let maxCombo = 0;
let timerInterval;
let gameStarted = false;

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
  countSound.play().catch(() => {}); 


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
       console.log("✅ 콜백 실행됨! 👇👇👇");
      callback(); 
    }

   
    countdownEl.style.animation = "none";
    void countdownEl.offsetWidth;
    countdownEl.style.animation = "countdown-bounce 1s ease";
  }, 1000);
}

function showCorrectFeedback(callback) {
  correctSound.cloneNode().play().catch(() => {}); 
  stopBackgroundLoop();
  screen.style.backgroundImage = `url(${correctBg})`;

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
    gameArea.innerHTML = '';  
  tileData = [];            
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
   clickSound.play().catch(() => {}); 
  if (isProcessing) return;

  const tile = e.currentTarget;
  if (tile.classList.contains('matched')) return;

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
  socket.emit("correctMatch");  

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
      socket.emit("endGame");
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
  stopBackgroundLoop();
  resultSound.play().catch(() => {}); 
  const resultText = `총 점수: ${score}점\n최고 콤보: ${maxCombo}`;
  document.getElementById("result-text").textContent = resultText;
  document.getElementById("result-modal").style.display = "flex";
  localStorage.setItem("gameEnded", "true");  
}
document.getElementById("retry-btn").onclick = () => {
  const clickSound = new Audio("./sound/click.wav");
  clickSound.play().catch(() => {});

  const nickname = localStorage.getItem("nickname");
  const code = localStorage.getItem("code");

  if (nickname && code && typeof socket !== "undefined") {
    socket.emit("join", { nickname, code });
  }

  setTimeout(() => {
    localStorage.removeItem("gameEnded");
    window.location.href = "./entry-page.html";
  }, 300);  
};
const menuBtn = document.getElementById("menu-btn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const clickSound = new Audio("./sound/click.wav");
    clickSound.play().catch(() => {});
    setTimeout(() => {
      window.location.href = "./menu.html";
    }, 500);
  });
} else {
  console.error("❌ menu-btn 요소를 찾을 수 없습니다.");
}
const socket = io("https://card-match-game-server.onrender.com");

socket.on("startGame", () => {
  if (gameStarted || localStorage.getItem("gameEnded") === "true") return;
  gameStarted = true;

  console.log("🟢 startGame 수신");
  modal.style.display = "none";

  showCountdown(() => {
  playRandomBGM();
    startBackgroundLoop();
    startTimer();
    fetch('https://card-match-game-server.onrender.com/data/connect-game.json')
      .then(res => res.json())
      .then(data => createTiles(data));
  });
});
function showWrongFeedback(callback) {
  wrongSound.cloneNode().play().catch(() => {});    
  stopBackgroundLoop();
  screen.style.backgroundImage = `url(${wrongBg})`;

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
 fetch('https://card-match-game-server.onrender.com/data/connect-game.json')
    .then(res => res.json())
    .then(data => createTiles(data));
}
socket.on("connect", () => {
  console.log("✅ 소켓 연결됨:", socket.id);

  socket.emit("join", {
    nickname: localStorage.getItem("nickname") || "손님",
    code: localStorage.getItem("code") || "기본"
  });

  setTimeout(() => {
    socket.emit("requestStartStatus");
  }, 1000);
});
function playRandomBGM() {
  const bgmList = [
    "./sound/music/bgm1.mp3", 
    "./sound/music/bgm2.mp3", 
    "./sound/music/bgm3.mp3", 
    "./sound/music/bgm4.mp3", 
    "./sound/music/bgm5.mp3", 
    "./sound/music/bgm6.mp3", 
    "./sound/music/bgm7.mp3", 
    "./sound/music/bgm8.mp3", 
    "./sound/music/bgm9.mp3"  
  ];

  const randomIndex = Math.floor(Math.random() * bgmList.length);
  const bgm = new Audio(bgmList[randomIndex]);
  bgm.loop = true;
  bgm.volume = 0.5;
  bgm.play().catch(() => {});
  window.bgm = bgm; 
}
