const socket = io("https://goldenbell-server.onrender.com");
const bgFrames = ["./image/quiz1.png", "./image/quiz2.png"];
const wrongFrame = "./image/quiz3.png";
const correctFrame = "./image/quiz4.png";
const clickSound = new Audio("./sound/click.wav");
const correctSound = new Audio("./sound/correct.wav");
const wrongSound = new Audio("./sound/wrong.wav");
const countSound = new Audio("./sound/count.wav");
const resultSound = new Audio("./sound/game_over.wav");


let bgIndex = 0;
let quizInterval;
let score = 0;
let maxCombo = 0;
let combo = 0;
let previousScore = 0;
let isAnsweringAllowed = false;
let pendingGainedScore = 0;
let lastCorrectTime = 0;


const quizScreen = document.getElementById("quiz-screen");
const overlay = document.getElementById("overlay");
const countdown = document.getElementById("countdown");

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
  document.getElementById("result-modal").style.display = "flex";
}

function updateTimeAndScoreDisplay() {
  document.getElementById("text-score-display").textContent = `⭐ 점수: ${score}점`;
}

function startCountdown(callback) {
  let count = 3;
  isAnsweringAllowed = false;
  countdown.style.display = "flex";
  countdown.textContent = count;
  countdown.style.animation = "countdown-bounce 1s ease";
  countSound.play().catch(() => {});  
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
      playRandomBGM(); 
      isAnsweringAllowed = true;
      callback();
    }
  }, 1000);
}

let timeLeft = 100;
let timeInterval = null;
function startTimer() {
  clearInterval(timeInterval); 
  timeInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time-display").textContent = `⏱ 남은 시간: ${timeLeft}초`;

    if (timeLeft <= 0) {
      clearInterval(timeInterval);
      isAnsweringAllowed = false;
       resultSound.play().catch(() => {});  
      showResultModal(`⏱ 시간이 종료되었습니다!\n⭐ 최종 점수: ${score}점`);
      socket.disconnect(); 
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  const nickname = localStorage.getItem("nickname");
  const enteredCode = localStorage.getItem("code");

  if (!nickname || !enteredCode) {
    alert("입장 정보가 없습니다. 처음 화면으로 돌아갑니다.");
    location.href = "./entry-page.html";
    return;
  }

  socket.emit("verifyCode", enteredCode);

  socket.on("codeVerified", (isValid) => {
    if (!isValid) {
      alert("게임 코드가 일치하지 않습니다.");
      location.href = "./entry-page.html";
      return;
    }

    socket.emit("join", nickname);

socket.on("startGame", () => {
  startCountdown(() => {
    socket.emit("ready");  
     startTimer(); 
  });
});

socket.on("question", (q) => {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("quiz-screen").style.display = "flex";
  isAnsweringAllowed = true;

  stopBackgroundLoop();
  startBackgroundLoop();

  overlay.innerHTML = "";
  document.getElementById("question").textContent = `Q${q.index}. ${q.question}`;
  document.getElementById("choice1").textContent = q.choices[0];
  document.getElementById("choice2").textContent = q.choices[1];
  document.getElementById("choice3").textContent = q.choices[2];
  document.getElementById("choice4").textContent = q.choices[3];
  document.getElementById("choices").style.display = "block";
});

let lastCorrectTime = 0; 

socket.on("result", (isCorrect) => {
  isAnsweringAllowed = false;
  stopBackgroundLoop();
  quizScreen.style.backgroundImage = `url(${isCorrect ? correctFrame : wrongFrame})`;

  if (isCorrect) {
  correctSound.cloneNode().play().catch(() => {});  
    score += pendingGainedScore;

    const color = (combo >= 6) ? "#dc3545" :
                  (combo >= 4) ? "#ffc107" :
                  (combo >= 2) ? "#28a745" : "white";

    overlay.innerHTML = `<div style="color: ${color};">⭕<br>정답입니다! (+${pendingGainedScore}점)</div>`;
    showCombo(combo);
    quizScreen.classList.add("correct-pop");
    setTimeout(() => quizScreen.classList.remove("correct-pop"), 500);
  } else {
  wrongSound.cloneNode().play().catch(() => {});    
    combo = 0;
    overlay.innerHTML = "<div>❌<br>오답입니다!</div>";
    quizScreen.classList.add("shake");
    setTimeout(() => quizScreen.classList.remove("shake"), 500);
  }

  updateTimeAndScoreDisplay();
  document.getElementById("combo-max").textContent = `🏆 최고 콤보: ${maxCombo}`;

  setTimeout(() => {
    overlay.innerHTML = "";
    socket.emit("next");
  }, 1000);
});

    socket.on("eliminated", () => {
      overlay.textContent = "❌ 탈락했습니다!";
      document.getElementById("choices").style.display = "none";
      stopBackgroundLoop();
    });

    socket.on("winner", (name) => {
      overlay.textContent = `🏆 우승자: ${name}`;
      stopBackgroundLoop();
      showResultModal(`🎉 우승자: ${name}`);
    });

    socket.on("finalResult", (rankingList) => {
  const nickname = localStorage.getItem("nickname")?.trim();

  const me = rankingList.find(p => p.nickname === nickname);
  const myScore = me ? me.score : "점수 없음";

 const topList = rankingList.slice(0, 5);  
const text = topList.map(p => `${p.rank}등 ${p.nickname}: ${p.score}점`).join('\n');


  showResultModal(`⭐ 당신의 점수: ${myScore}점\n\n🏆 전체 순위\n${text}`);

  const retryBtn = document.getElementById("retry-btn");
});


    ["choice1", "choice2", "choice3", "choice4"].forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.onclick = () => {
        clickSound.play().catch(() => {});  
        if (!isAnsweringAllowed) return;

        pendingAnswer = btn.textContent;

        const now = Date.now();
        const timeDiff = now - lastCorrectTime;
        lastCorrectTime = now;

        if (timeDiff <= 3000) {
          combo++;
        } else {
          combo = 1;
        }

        if (combo > maxCombo) maxCombo = combo;

        let bonus = 0;
        if (combo >= 6) bonus = 3;
        else if (combo >= 4) bonus = 2;
        else if (combo >= 2) bonus = 1;

        const gained = 1 + bonus;
        pendingGainedScore = gained;

        socket.emit("answer", { answerText: pendingAnswer, scoreDelta: gained });
      };
    });

    document.getElementById("retry-btn").onclick = () => {
  const clickSound = new Audio("./sound/click.wav");
  clickSound.play().catch(() => {});

  setTimeout(() => {
    localStorage.removeItem("nickname");
    localStorage.removeItem("code");
    window.location.href = "./entry-page.html";
  }, 300);
};
  });
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
  window.bgm = new Audio(bgmList[randomIndex]); 
  window.bgm.loop = true;
  window.bgm.volume = 0.5;
  window.bgm.play().catch(() => {});
}

