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
const bgFrames = ["/image/final1.png", "/image/final2.png", "/image/final3.png"];
const wrongFrame = "/image/final5.png";
const correctFrame = "/image/final4.png";
const clickSound = new Audio("/sound/click.wav");
const resultSound = new Audio("/sound/game_over.wav");
const correctSound = new Audio("/sound/correct.wav");
const wrongSound = new Audio("/sound/wrong.wav");
const countdownSound = new Audio("/sound/count.wav");

let bgIndex = 0;
let quizInterval;
let quizData = [];
let current = 0;
let score = 0;
let answering = true;
let timeLeft = 100;
let timerInterval;
let totalSolved = 0;
let subTimer;
let subTimeout;
let gameEnded = false;
let elapsedSeconds = 0;
let startTime = 0;


const quizScreen = document.getElementById("quiz-screen");
const overlay = document.getElementById("overlay");
const countdown = document.getElementById("countdown");

let previousScore = 0;

function updateTimeAndScoreDisplay() {
  document.getElementById("time-display").textContent = `⏱ 남은 시간: ${timeLeft}초`;

  const scoreEl = document.getElementById("text-score-display");
  if (score !== previousScore) {
    scoreEl.textContent = `⭐ 점수: ${score}점`;
    scoreEl.classList.add("pop-score");
    setTimeout(() => scoreEl.classList.remove("pop-score"), 300);
    previousScore = score;
  }
}

function startTimer() {
  updateTimeAndScoreDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimeAndScoreDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(subTimer);
      clearTimeout(subTimeout);
      gameEnded = true;

      document.getElementById("question").textContent = "";
      stopBackgroundLoop();

      showResultModal(`총 ${quizData.length}문제 중 ${score}개 정답!`);
    }
  }, 1000);
}

function startBackgroundLoop() {
  quizScreen.style.backgroundImage = `url(${bgFrames[bgIndex]})`;
  quizInterval = setInterval(() => {
    bgIndex = (bgIndex + 1) % bgFrames.length;
    quizScreen.style.backgroundImage = `url(${bgFrames[bgIndex]})`;
  }, 600);
}

function stopBackgroundLoop() {
  clearInterval(quizInterval);
}
function showCountdown(callback) {
  const countdownEl = document.getElementById("countdown");
  const blurEl = document.getElementById("blur-overlay");

  let count = 3;
  let playedOnce = false; 

  countdownEl.textContent = count;
  countdownEl.style.display = "flex";
  if (blurEl) blurEl.style.display = "block";

  const interval = setInterval(() => {
    
    if (!playedOnce) {
      const countdownSound = new Audio("/sound/count.wav");
      countdownSound.play().catch(() => {});
      playedOnce = true;
    }

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

    count--;
  }, 1000);
}


function loadQuestion() {
  const q = quizData[current];
  document.getElementById("question").textContent = `Q${current + 1}. ${q.question}`;
  document.getElementById("answer-input").value = "";
  answering = true;

  clearInterval(subTimer);
  clearTimeout(subTimeout);

  let perQuestionTime = 10;
  const subDisplay = document.getElementById("sub-time-display");
  subDisplay.textContent = `⌛ 문제 제한: ${perQuestionTime}초`;

  const countdownEl = document.getElementById("question-countdown");
  countdownEl.style.display = "none";
  countdownEl.textContent = "";

  subTimer = setInterval(() => {
    perQuestionTime--;
    subDisplay.textContent = `⌛ 문제 제한: ${perQuestionTime}초`;
    if (perQuestionTime <= 5) {
      countdownEl.textContent = perQuestionTime;
      countdownEl.style.display = "block";
    } else {
      countdownEl.style.display = "none";
    }
  }, 1000);

  subTimeout = setTimeout(() => {
    if (!answering || gameEnded) return;
    clearInterval(subTimer);
    countdownEl.style.display = "none";
    checkAnswer("", true);
  }, 10000);
}

function checkAnswer(userInput, isAuto = false) {
  if (!answering) return;
  answering = false;

  const q = quizData[current];
  const isCorrect = !isAuto && userInput.trim() === q.answer.trim();

  totalSolved++;
  stopBackgroundLoop();
  quizScreen.style.backgroundImage = `url(${isCorrect ? correctFrame : wrongFrame})`;

  if (isCorrect) {
  correctSound.play().catch(() => {});
  score++;
  updateTimeAndScoreDisplay();
  overlay.innerHTML = "<div>⭕<br>정답입니다!</div>";
  quizScreen.classList.add("correct-pop");
  setTimeout(() => quizScreen.classList.remove("correct-pop"), 300);
} else {
  wrongSound.play().catch(() => {});
  overlay.innerHTML = "<div>❌<br>오답입니다!</div>";
  quizScreen.classList.add("shake");
  setTimeout(() => quizScreen.classList.remove("shake"), 300);
  clearInterval(timerInterval);
  clearInterval(subTimer);
  clearTimeout(subTimeout);
  showResultModal(`오답입니다! 정답은 "${q.answer}"였습니다.`);
  return;
}


  setTimeout(() => {
    overlay.innerHTML = "";
    startBackgroundLoop();
    nextQuestion();
  }, 1300);
}

function nextQuestion() {
  current++;
  if (current < quizData.length) {
    loadQuestion();
  } else {
    document.getElementById("question").textContent = "퀴즈 완료!";
    stopBackgroundLoop();
    clearInterval(timerInterval);
    showResultModal(`총 ${quizData.length}문제 중 ${score}개 정답! 🎉`);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
window.onload = () => {

 

  document.getElementById("submit-btn").onclick = () => {
    const userInput = document.getElementById("answer-input").value.trim();
    checkAnswer(userInput);
  };
};
document.addEventListener("click", (e) => {
  if (
    e.target.tagName === "BUTTON" &&
    !["menu-btn", "menu-btn-start"].includes(e.target.id)
  ) {
    clickSound.currentTime = 0;
    clickSound.play().catch((err) => {
      console.warn("🔇 버튼 클릭 사운드 실패:", err);
    });
  }
});

function showResultModal(text) {
  document.getElementById("result-text").textContent = text;

  const endTime = Date.now();
  elapsedSeconds = Math.floor((endTime - startTime) / 1000);

  checkAchievements_CHALLENGE({
    score: score,
    totalQuestions: quizData.length,
    correctCount: score,
    totalTime: elapsedSeconds
  });

  document.getElementById("result-modal").style.display = "flex";
  resultSound.play().catch(() => {});
}


const retryBtn = document.getElementById("retry-btn");
if (retryBtn) {
  retryBtn.onclick = () => {
    
    clickSound.play().catch((err) => {
      console.warn("🔇 다시하기 사운드 실패:", err);
    });

    setTimeout(() => {
      location.reload();
    }, 500); 
  };
}

const startBtn = document.getElementById("start-btn");
if (startBtn) {
  startBtn.onclick = () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    if (!quizData || quizData.length === 0) {
      alert("⚠ 단원을 먼저 선택해 주세요!");
      return;
    }

    document.getElementById("modal-container").style.display = "none";
    document.getElementById("quiz-screen").style.display = "flex";

    showCountdown(() => {
      startTime = Date.now();
      playRandomBGM();
      loadQuestion();             
      startBackgroundLoop();
      startTimer();
    });
  };
}



const menuBtn = document.getElementById("menu-btn");
if (menuBtn) {
  menuBtn.onclick = (e) => {
    e.stopPropagation(); 
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
    setTimeout(() => {
      location.href = "/menu.html";
    }, 400);
  };
}

const modalMenuBtn = document.getElementById("menu-btn-start");
if (modalMenuBtn) {
  modalMenuBtn.onclick = (e) => {
    e.stopPropagation();  
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
    setTimeout(() => {
      location.href = "/menu.html";
    }, 400);
  };
}

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
function checkAchievements_CHALLENGE({ score, totalQuestions, correctCount, totalTime }) {
  let playCount = parseInt(localStorage.getItem("challenge_play_count") || "0");
  playCount++;
  localStorage.setItem("challenge_play_count", playCount);
  if (playCount >= 5) completeTask(18);

  let totalScore = parseInt(localStorage.getItem("challenge_score_total") || "0");
  totalScore += score;
  localStorage.setItem("challenge_score_total", totalScore);
  if (totalScore >= 50) completeTask(19);

  if (correctCount === totalQuestions) completeTask(20);

  let totalTimePlayed = parseInt(localStorage.getItem("challenge_time_total") || "0");
  totalTimePlayed += totalTime;
  localStorage.setItem("challenge_time_total", totalTimePlayed);
  if (totalTimePlayed >= 600) completeTask(21);
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

  const summaryBox = document.getElementById('achievement-summary');
  if (summaryBox) {
    const taskIDs = CHARACTER_TASKS[character] || [];
    const completedCount = taskIDs.filter(tid => data[character][tid]).length;
    summaryBox.textContent = `도전과제 ${completedCount} / ${taskIDs.length}개 완료`;
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
  const completed = saved[character] || [];

 const totalCount = Object.keys(TASK_DESCRIPTION_TEXTS).length;

if (completed.length >= totalCount && completed.every(v => v === true)) {
    localStorage.setItem("endingShown", "true");
    window.location.href = "ending.html";
  }
}
document.querySelectorAll(".unit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const file = btn.dataset.file;
    if (!file) {
      console.error("❌ 단원 버튼에 data-file이 없습니다.");
      return;
    }

    const oldScript = document.getElementById("finalDataScript");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.src = `/data/${file}`;
    script.id = "finalDataScript";

    script.onload = () => {
      if (typeof finalData !== "undefined") {
       quizData = shuffle(finalData).slice(0, 5);
        document.getElementById("unit-modal").style.display = "none";
        document.getElementById("modal-container").style.display = "flex";
      } else {
        alert("finalData가 정의되지 않았습니다.");
      }
    };

    script.onerror = () => {
      alert("문제 파일 로딩 실패: " + file);
    };

    document.body.appendChild(script);
  });
});
