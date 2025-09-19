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
const bgFrames = ["/image/oxquiz1.png", "/image/oxquiz2.png"];
    const wrongFrame = "/image/oxquiz3.png";
    const correctFrame = "/image/oxquiz4.png";
    
    let bgIndex = 0;
    let quizInterval;
    let current = 0;
    let score = 0;
    let answering = true;
    let timeLeft = 100;
    let timerInterval;
    let totalSolved = 0;
    let maxCombo = 0;
    let subTimer;       
    let subTimeout;    
    let gameEnded = false; 
    let comboTimer;
    let totalQuestions = 50;


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
      document.getElementById("choices").style.display = "none";
      stopBackgroundLoop();

      showResultModal(`총 ${quizData.length}문제 중 ${score}개 정답! 🎉\n최고 콤보: ${maxCombo}`);
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

   function startCountdown(callback) {
  const countdown = document.getElementById("countdown");
  let count = 3;

  countdown.style.display = "flex";
  countdown.textContent = count;
  countdown.style.animation = "countdown-bounce 1s ease";

  const countdownSound = new Audio("/sound/count.wav");
  countdownSound.play().catch(() => {});

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdown.textContent = count;
      countdown.style.animation = "none";
      void countdown.offsetWidth;  
      countdown.style.animation = "countdown-bounce 1s ease";
    } else if (count === 0) {
      countdown.textContent = "시작!";
      countdown.style.animation = "none";
      void countdown.offsetWidth;
      countdown.style.animation = "countdown-bounce 1s ease";
    } else {
      clearInterval(interval);
      countdown.style.display = "none";
      callback();
    }
  }, 1000);
}


   function loadQuestion() {
  const q = quizData[current];
  document.getElementById("question").textContent = `Q${current + 1}. ${q.question}`;
  document.getElementById("choice1").textContent = "⭕";
  document.getElementById("choice2").textContent = "❌";
  document.getElementById("choice1").onclick = () => checkAnswer(true);
  document.getElementById("choice2").onclick = () => checkAnswer(false);
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

    if (perQuestionTime >= 0) {
      subDisplay.textContent = `⌛ 문제 제한: ${perQuestionTime}초`;

      if (perQuestionTime <= 5) {
        countdownEl.textContent = perQuestionTime;
        countdownEl.style.display = "block";
      } else {
        countdownEl.style.display = "none";
      }
    }

    if (perQuestionTime < 0) {
      countdownEl.style.display = "none";
    }
  }, 1000);

  subTimeout = setTimeout(() => {
    if (!answering || gameEnded) return;
    clearInterval(subTimer);
    countdownEl.style.display = "none"; 
    checkAnswer(null, true); 
  }, 10000); 
}


   function checkAnswer(choice, isAuto = false) {
  if (!answering) return;
  answering = false;

  const q = quizData[current];
  let isCorrect;

  if (isAuto) {
    isCorrect = false; 
  } else {
    isCorrect = (choice === true && q.answer === "O") ||
                (choice === false && q.answer === "X");
  }

  totalSolved++; 

  stopBackgroundLoop();
  quizScreen.style.backgroundImage = `url(${isCorrect ? correctFrame : wrongFrame})`;

  if (isCorrect) {
    const correctSound = new Audio("/sound/correct.wav");
  correctSound.play().catch(() => {});
  clearTimeout(comboTimer);         
  combo++;
  if (combo > maxCombo) maxCombo = combo;
  score++;
  updateTimeAndScoreDisplay();
  overlay.innerHTML = "<div>⭕<br>정답입니다!</div>";

  comboTimer = setTimeout(() => {   
    combo = 0;
  }, 3000);

  if (combo >= 2) showCombo(combo);

  quizScreen.classList.add("correct-pop");
  setTimeout(() => {
    quizScreen.classList.remove("correct-pop");
  }, 300);
}
   else {
     const wrongSound = new Audio("/sound/wrong.wav");
  wrongSound.play().catch(() => {});
    combo = 0;
    overlay.innerHTML = "<div>❌<br>오답입니다!</div>";
    quizScreen.classList.add("shake");
    setTimeout(() => {
      quizScreen.classList.remove("shake");
    }, 300);
  }

  document.getElementById("solved-count").textContent = `🔢 문제 수: ${totalSolved}`;
  document.getElementById("combo-max").textContent = `🏆 최고 콤보: ${maxCombo}`;

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
  document.getElementById("choices").style.display = "none";
  overlay.innerHTML = `총 ${quizData.length}문제 중 ${score}개 맞히셨습니다.`;
  stopBackgroundLoop();
  clearInterval(timerInterval);

  showResultModal(`총 ${quizData.length}문제 중 ${score}개 정답! 🎉\n최고 콤보: ${maxCombo}`);
}
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
let combo = 0;

window.onload = () => {
  document.getElementById("start-btn").onclick = () => {
    document.getElementById("modal-container").style.display = "none";
    document.getElementById("quiz-screen").style.display = "flex";
    startCountdown(() => {
      playRandomBGM();
      loadQuestion();
      startBackgroundLoop();
      startTimer();
    });
  };
};


function showCombo(n) {
  const comboText = document.getElementById("combo-text");
  comboText.textContent = `${n}콤보!`;

  const scaleSize = 1 + Math.min(n * 0.1, 2.0); 

  comboText.style.display = "block";
  comboText.style.opacity = "1";
  comboText.style.transform = `translateX(-50%) scale(${scaleSize})`;

  setTimeout(() => {
    comboText.style.opacity = "0";
    comboText.style.transform = "translateX(-50%) scale(1)";
  }, 1000);

  setTimeout(() => {
    comboText.style.display = "none";
  }, 1500);
}

function showResultModal(text) {
  document.getElementById("result-text").textContent = text;
  checkAchievements_OX(); 
  document.getElementById("result-modal").style.display = "flex";
   const resultSound = new Audio("/sound/game_over.wav");
  resultSound.play().catch(() => {});
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
  const modalMenuBtn = document.getElementById("modal-menu-btn");

  if (retryBtn) {
    retryBtn.onclick = () => {
      const audio = new Audio("/sound/click.wav");
      audio.play().catch(() => {});
      setTimeout(() => {
        location.reload();
      }, 300);
    };
  }

  menuBtn.onclick = () => {
  setTimeout(() => {
    location.href = "/menu.html";
  }, 300);
};

  if (modalMenuBtn) {
    modalMenuBtn.onclick = () => {
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
function checkAchievements_OX() {
  let playCount = parseInt(localStorage.getItem("ox_play_count") || "0");
  playCount++;
  localStorage.setItem("ox_play_count", playCount);
  if (playCount >= 5) completeTask(5);  

  if (score >= 25) completeTask(6);   

  if (maxCombo >= 15) completeTask(7);  

  if (score === totalQuestions) completeTask(8); 

  let totalScore = parseInt(localStorage.getItem("ox_score_total") || "0");
  totalScore += score;
  localStorage.setItem("ox_score_total", totalScore);
  if (totalScore >= 100) completeTask(9); 
}
function completeTask(id) {
  const character = localStorage.getItem('selectedCharacter');
  if (!character) return;

  const data = JSON.parse(localStorage.getItem('achievements') || "{}");

  if (!data[character]) {
    data[character] = {};
  }

  if (data[character][id] === undefined) {
    data[character][id] = false;
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

window.addEventListener("load", () => {
  setTimeout(() => {
    console.log("✅ 리소스 로딩 안정화를 위해 약간 늦게 초기화됩니다.");
  }, 500); 
});
document.querySelectorAll(".unit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const unit = btn.dataset.unit;
    const scriptPath = `data/oxquiz_data-${unit}.js`;

    const oldScript = document.getElementById("quizDataScript");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.src = scriptPath;
    script.id = "quizDataScript";

    script.onload = () => {
      if (typeof quizData !== "undefined") {
        window.quizData = shuffle(quizData).slice(0, 50);  
        current = 0;
        score = 0;
        combo = 0;
        totalSolved = 0;

        document.getElementById("unit-modal").style.display = "none";
        document.getElementById("quiz-screen").style.display = "flex";

      } else {
        alert("quizData가 정의되어 있지 않습니다.");
      }
    };

    script.onerror = () => {
      alert("문제 파일 로딩 실패\n" + scriptPath);
    };

    document.body.appendChild(script);
  });
});
