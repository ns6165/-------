const TASK_DESCRIPTION_TEXTS = {
  0: '타임어택 5회 플레이',
  1: '타임어택 25점 이상',
  2: '타임어택 15콤보 달성',
  3: '타임어택 모든 문제 정답',
  4: '타임어택 누적 100점 이상',
  5: 'OX퀴즈 5회 플레이',
  6: 'OX퀴즈 100점 이상',
  7: 'OX퀴즈 20콤보 달성',
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
  43: '연습모드 객관식 10분이상 보기',
  44: '연습모드 주관식 10분이상 보기',
  45: '연습모드 그림퀴즈 10분이상 보기',
  46: '연습모드 30회 검색하기',
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

const bgFrames = ["/image/quiz1.png", "/image/quiz2.png"];
    const wrongFrame = "/image/quiz3.png";
    const correctFrame = "/image/quiz4.png";
    const countdownSound = new Audio("/sound/count.wav");
   
    let bgIndex = 0;
    let quizInterval;
    let current = 0;
    let score = 0;
    let answering = true;
    let timeLeft = 100;
    let timerInterval;
    let totalSolved = 0;
    let maxCombo = 0;
    let isAnsweringAllowed = false;


    const quizScreen = document.getElementById("quiz-screen");
    const overlay = document.getElementById("overlay");
    const countdown = document.getElementById("countdown");

    let previousScore = 0;


  function showCharacterProgress() {
  const character = localStorage.getItem("selectedCharacter");
  const saved = JSON.parse(localStorage.getItem("achievements") || "{}");
 const completed = (CHARACTER_TASKS[character] || []).filter(id => saved[character]?.[id]).length;
 const total = (CHARACTER_TASKS[character] || []).length;


  const progressText = document.getElementById("character-progress");
  if (progressText) {
    progressText.textContent = `도전과제 ${completed} / ${total}개 완료`;
  }
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

  isAnsweringAllowed = false; 

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

      isAnsweringAllowed = true;
      callback();
    }
  }, 1000);
}


    function loadQuestion() {
      const q = quizData[current];
      document.getElementById("question").textContent = `Q${current + 1}. ${q.question}`;
      overlay.innerHTML = "";
      document.getElementById("choice1").textContent = q.choices[0];
      document.getElementById("choice2").textContent = q.choices[1];
      document.getElementById("choice3").textContent = q.choices[2];
      document.getElementById("choice4").textContent = q.choices[3];
      answering = true;
    }

    function checkAnswer(choice) {
  if (!isAnsweringAllowed || !answering) return;
  answering = false;

  const q = quizData[current];
  const isCorrect = choice === q.answer;

  totalSolved++; 

  stopBackgroundLoop();
  quizScreen.style.backgroundImage = `url(${isCorrect ? correctFrame : wrongFrame})`;
new Audio(`/sound/${isCorrect ? "correct" : "wrong"}.wav`).cloneNode().play().catch(() => {});
  if (isCorrect) {
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    score++;
    updateTimeAndScoreDisplay();
     if (score >= 25) completeTask(1);
    overlay.innerHTML = "<div>⭕<br>정답입니다!</div>";
    if (combo >= 2) showCombo(combo);
     quizScreen.classList.add("correct-pop");
  setTimeout(() => {
    quizScreen.classList.remove("correct-pop");
  }, 500);
    if (combo >= 15) completeTask(2);
}
   else {
    combo = 0;
    overlay.innerHTML = "<div>❌<br>오답입니다!</div>";
    quizScreen.classList.add("shake");
    setTimeout(() => {
      quizScreen.classList.remove("shake");
    }, 500);
  }

  document.getElementById("solved-count").textContent = `🔢 문제 수: ${totalSolved}`;
  document.getElementById("combo-max").textContent = `🏆 최고 콤보: ${maxCombo}`;

  setTimeout(() => {
    overlay.innerHTML = "";
    startBackgroundLoop();
    nextQuestion();
  }, 1500);
}

    function nextQuestion() {
      current++;
      if (current < quizData.length) {
        loadQuestion();
      } else {
  document.getElementById("question").textContent = "퀴즈 완료!";
  document.getElementById("choices").style.display = "none";
  stopBackgroundLoop();
  clearInterval(timerInterval);
   if (score === quizData.length) completeTask(3); 
    let totalScore = parseInt(localStorage.getItem("qb_total_score") || "0");
    totalScore += score;
    localStorage.setItem("qb_total_score", totalScore);
    if (totalScore >= 100) completeTask(4); 
  checkAchievements_QuizBattle({ score, maxCombo, quizLength: quizData.length });
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

   document.getElementById("choice1").onclick = () => { playSound("click"); checkAnswer(0); };
document.getElementById("choice2").onclick = () => { playSound("click"); checkAnswer(1); };
document.getElementById("choice3").onclick = () => { playSound("click"); checkAnswer(2); };
document.getElementById("choice4").onclick = () => { playSound("click"); checkAnswer(3); };

let combo = 0;


window.onload = () => {
  showCharacterProgress();

  document.getElementById("start-btn").onclick = () => {
    playSound("click");
    document.getElementById("modal-container").style.display = "none";
    document.getElementById("quiz-screen").style.display = "flex";

     let playCount = parseInt(localStorage.getItem("qb_play_count") || "0");
  playCount++;
  localStorage.setItem("qb_play_count", playCount);
  if (playCount >= 5) completeTask(0);

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



function playSound(name) {
  const audio = new Audio(`/sound/${name}.wav`);
  audio.volume = 0.6;
  audio.play().catch(e => {
    console.warn("🔇 효과음 재생 실패:", e);
  });
}

document.getElementById("retry-btn").onclick = () => {
  location.reload(); 
};

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
function checkAchievements_QuizBattle({ score, maxCombo, quizLength }) {
  let playCount = parseInt(localStorage.getItem("qb_play_count") || "0");
  playCount++;
  localStorage.setItem("qb_play_count", playCount);
  if (playCount >= 5) completeTask(0);  

  if (score >= 25) completeTask(1);     

  if (maxCombo >= 15) completeTask(2);  

  if (score === quizLength) completeTask(3);  

  let totalScore = parseInt(localStorage.getItem("qb_total_score") || "0");
  totalScore += score;
  localStorage.setItem("qb_total_score", totalScore);
  if (totalScore >= 100) completeTask(4);  
}

function checkGlobalEnding() {
  const character = localStorage.getItem("selectedCharacter");
  if (!character) return;

  if (localStorage.getItem("endingShown") === "true") return;

  const saved = JSON.parse(localStorage.getItem("achievements") || "{}");
  const completed = saved[character] || [];

const totalCount = Object.keys(TASK_DESCRIPTION_TEXTS).length;

 const characterTasks = CHARACTER_TASKS[character] || [];
const isAllDone = characterTasks.every(id => completed[id] === true);
if (isAllDone) {
  localStorage.setItem("endingShown", "true");
  window.location.href = "ending.html";
}

}
document.addEventListener("DOMContentLoaded", function () {
  const summaryBox = document.getElementById("achievement-summary");
  if (summaryBox) {
    const character = localStorage.getItem("selectedCharacter");
    const saved = JSON.parse(localStorage.getItem("achievements") || "{}");
    const taskIDs = CHARACTER_TASKS[character] || [];

    const count = taskIDs.reduce((acc, id) => {
      return saved[character]?.[id] === true ? acc + 1 : acc;
    }, 0);

    summaryBox.textContent = `도전과제 ${count} / ${taskIDs.length}개 완료`;
  }

document.querySelectorAll(".unit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
     playSound("click");
    const unit = btn.dataset.unit;
    const scriptPath = `data/quiz-data-${unit}.js`;

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


});

function showResultModal(text) {
  playSound("game_over");
  document.getElementById("result-text").textContent = text;
  document.getElementById("result-modal").style.display = "flex";
}
