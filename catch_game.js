const socket = io("https://catchmind-server.onrender.com");
const canvas = document.getElementById("draw-canvas");
const ctx = canvas.getContext("2d");
const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-btn");
const countdown = document.getElementById("countdown");
const clearBtn = document.getElementById("clear-btn");  
const startModal = document.getElementById("start-modal");
const resultModal = document.getElementById("result-modal");
const finalResult = document.getElementById("final-result");

const clickSound = new Audio("./sound/click.wav");
clickSound.load(); 
const correctSound = new Audio("./sound/correct.wav");
const wrongSound = new Audio("./sound/wrong.wav");
const countSound = new Audio("./sound/count.wav");
const resultSound = new Audio("./sound/game_over.wav");
let lastDrawSoundTime = 0;
const drawSound = new Audio("./sound/draw.wav");

let role;            
let isReady = false; 
let isAnsweringAllowed = false;
let countdownStarted = false;
let score = 0;
let drawing = false;
let bgIndex = 0;
let bgInterval = null;
let requestInterval;
let remainingTime = 0;


const bgImages = [
  "./image/catch_quiz1.png",  
  "./image/catch_quiz2.png",  
  "./image/catch_quiz3.png",  
  "./image/catch_quiz4.png"   
];


function showStartModal() {
  const wrapper = document.getElementById("start-modal-wrapper");
  wrapper.style.display = "flex";

  const modal = document.getElementById("start-modal");
  modal.style.display = "flex"; 
}

function hideStartModal() {
  document.getElementById("start-modal").style.display = "none";     
  document.getElementById("start-modal-wrapper").style.display = "none"; 
}
async function runCountdown(startAt, callback) {
  const delay = startAt - Date.now();
  const labels = ["3", "2", "1", "시작!"];
  const interval = 1000;

  countdown.style.display = "flex";
  showStartModal();

labels.forEach((label, i) => {
  setTimeout(() => {
    countdown.textContent = label;
    countdown.classList.remove("countdown-bounce");
    void countdown.offsetWidth;
    countdown.classList.add("countdown-bounce");

    if (i === 0) {
      countSound.play().catch(() => {});
    }
  }, delay - (3000 - i * interval));
});

  setTimeout(() => {
    playRandomBGM(); 
    countdown.style.display = "none";
    hideStartModal();
    startBackgroundLoop();
    isAnsweringAllowed = true;

    startGameTimer(100); 

    callback();
  }, delay + 500);
}

function drawDot(x, y) {
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();

  const now = Date.now();
  if (now - lastDrawSoundTime > 300) {
    drawSound.cloneNode().play().catch(() => {});
    lastDrawSoundTime = now;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lastDrawX = null;
  lastDrawY = null;
}
function startBackgroundLoop() {
  if (bgInterval) clearInterval(bgInterval);
  bgIndex = 0; 
  bgInterval = setInterval(() => {
    document.getElementById("quiz-screen").style.backgroundImage = `url('${bgImages[bgIndex]}')`;
    bgIndex = (bgIndex + 1) % 2;
  }, 600);
}

function showResultBackground(index) {
  clearInterval(bgInterval);

  const quizScreen = document.getElementById("quiz-screen");
  quizScreen.style.backgroundImage = `url('${bgImages[index]}')`;

  setTimeout(() => {
    startBackgroundLoop(); 
  }, 1000);
}


function showResultModal(allResults) {
  resultSound.play().catch(() => {});
  gameEnded = true; 
  resultModal.style.display = "flex";

  let html = "<div style='margin-top: 1.8rem;'>"; 

  Object.entries(allResults).forEach(([team, members]) => {
    const teamScore = members.reduce((sum, r) => sum + (r.score || 0), 0);
    html += `<p style="font-size: 1.4rem; margin: 0.5rem 0;">⭐ ${team}: <strong>${teamScore}점</strong></p>`;
  });

  finalResult.innerHTML = html;
}

function goToMain() {
  location.href = "./menu.html";
}
function goToEntry() {
  location.href = "./catch_entry.html";
}
let isTouchDevice = false;
let lastX = null, lastY = null;

canvas.addEventListener("touchstart", (e) => {
  if (role !== "host") return;
  isTouchDevice = true;
  drawing = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
  drawDot(lastX, lastY);
  socket.emit("draw", { x: lastX, y: lastY });
  e.preventDefault();
});
canvas.addEventListener("touchmove", (e) => {
  if (!drawing || role !== "host") return;

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const dx = x - lastX;
  const dy = y - lastY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const steps = Math.ceil(distance / 2);
  for (let i = 1; i <= steps; i++) {
    const interpX = lastX + (dx * i) / steps;
    const interpY = lastY + (dy * i) / steps;
    drawDot(interpX, interpY);
    socket.emit("draw", { x: interpX, y: interpY }); 
  }

  lastX = x;
  lastY = y;
  e.preventDefault();
});

function draw(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  drawDot(x, y);
  socket.emit("draw", { x, y });
}

submitBtn.addEventListener("click", () => {
  clickSound.play().catch(() => {});  
  if (!isAnsweringAllowed || role === "host") return;

  const answer = guessInput.value.trim();
  if (!answer) return;

  socket.emit("submitAnswer", answer);
  guessInput.value = "";
  isAnsweringAllowed = false;
});

clearBtn.addEventListener("click", () => {
  clickSound.play().catch(() => {});  
  if (role !== "host") return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  socket.emit("clearCanvas"); 
});

clearBtn.addEventListener("click", () => {
  clickSound.play().catch(() => {});  
  if (role === "host") {
    socket.emit("clearCanvas");  
    clearCanvas();               
  }
});


socket.on("answerResult", ({ nickname: resultNick, isCorrect, score: newScore, team }) => {
  const myNickname = (localStorage.getItem("nickname") || "").trim();
  const myTeam = localStorage.getItem("team") || "1조";
  const senderNick = (resultNick || "").trim();

  console.log("🟡 answerResult 수신:", senderNick, isCorrect, "| 내 닉네임:", myNickname, "| role:", role);

  if (role === "player" && senderNick !== myNickname) return;

  const msg = isCorrect ? `정답입니다! (${senderNick})` : `오답입니다! (${senderNick})`;

  if (isCorrect) {
  correctSound.play().catch(() => {});
} else {
  wrongSound.play().catch(() => {});
}

  showResultBackground(isCorrect ? 2 : 3);
  showOverlayText(msg, isCorrect ? "#ffff66" : "#ff6666");

  
  if (isCorrect && team === myTeam) {
    score = newScore;
    updateGameInfo();
  }

  if (role === "player" && senderNick === myNickname && !isCorrect) {
    isAnsweringAllowed = true;
  }
});


socket.on("gameStarted", ({ startAt }) => {
  if (countdownStarted) return;
  countdownStarted = true;

  const now = Date.now();
  const delay = startAt - now;

  console.log("📥 gameStarted 수신됨 | 서버 기준 시작 시각:", new Date(startAt).toLocaleTimeString());
  console.log("🕒 현재 시간:", new Date(now).toLocaleTimeString(), "| 딜레이(ms):", delay);

  if (delay > 0) {
    runCountdown(startAt, () => {
      console.log("📤 ready 전송");
      socket.emit("ready");
    });
  } else {
    console.log("⚠️ 시작 시간이 이미 지남 → 즉시 시작 처리");
    hideStartModal();
    startBackgroundLoop();
    isAnsweringAllowed = true;
    socket.emit("ready");
  }

  clearInterval(requestInterval);
});
socket.on("sendQuestion", (question) => {
  if (!isReady) {
    console.warn("🚫 역할 세팅 전 sendQuestion 수신 → 무시됨");
    return;
  }

  const questionBox = document.getElementById("question-text");
  console.log("🟡 sendQuestion 수신 | role:", role);


  if (role === "host") {
    questionBox.innerText = question.text;
    localStorage.setItem("correctAnswer", question.answer);
    console.log("📤 출제자 문제 표시 완료:", question.text);
  }

  else {
    questionBox.innerText = ""; 
    lastDrawX = null;
    lastDrawY = null;

    setTimeout(() => {
     
      questionBox.innerText = "친구가 그리는 인물을 맞춰봅시다!";
    }, 50); 
    if (question.answer && question.answer.trim()) {
      localStorage.setItem("correctAnswer", question.answer);
    }

    isAnsweringAllowed = true;
    console.log("✅ 참가자 문제 숨김 처리 완료");
  }
});

window.onload = () => {
  const nickname = localStorage.getItem("nickname");
  const code = localStorage.getItem("code");
  role = localStorage.getItem("role") || "player";
  isReady = true;

  console.log("✅ 내 닉네임 확인:", nickname);

  if (!nickname || nickname === "undefined" || nickname.trim() === "") {
    alert("닉네임 정보가 잘못되었습니다.");
    location.href = "catch_entry.html";
    return;
  }

  if (!code) {
    alert("입장 코드가 없습니다.");
    location.href = "./catch_entry.html";
    return;
  }
  showStartModal();  

  socket.emit("join", {
    nickname,
    code,
    team: localStorage.getItem("team") || "1조",
    role: role
  });
socket.on("clearCanvas", () => {
  if (role === "player") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("🧹 참가자 화면 전체 지움");
  }
});
  if (role === "player") {
    canvas.style.pointerEvents = "none";
    canvas.style.opacity = "0.7";

    document.getElementById("question-text").innerText = "친구가 그리는 것을 맞춰봅시다!";

    let lastDrawX = null;
let lastDrawY = null;

socket.on("draw", ({ x, y }) => {
  drawDot(x, y);  
});


  } else {
    guessInput.style.display = "none";
    submitBtn.style.display = "none";

    clearBtn.style.display = "inline-block";

    clearBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      socket.emit("clearCanvas");
      console.log("🧹 출제자 화면 전체 지움 + 브로드캐스트");
    });
  }

  let retryCount = 0;

  function sendStartRequestRepeatedly() {
    retryCount = 0;
    requestInterval = setInterval(() => {
      if (retryCount >= 5) {
        clearInterval(requestInterval);
        return;
      }
      socket.emit("requestStartStatus");
      console.log(`📤 requestStartStatus 재요청 ${retryCount + 1}회`);
      retryCount++;
    }, 1000);
  }

  socket.on("joinSuccess", () => {
    console.log("🎉 joinSuccess 수신 → requestStartStatus 반복 전송 시작");
    setTimeout(() => {
      sendStartRequestRepeatedly();
    }, 500);
  });
}; 

socket.onAny((event, ...args) => {
  console.log("📥 받은 이벤트:", event, args);
});

socket.on("finalResult", (allResults) => {
  console.log("✅ finalResult 수신:", allResults); 
  showResultModal(allResults);
});
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);
function updateGameInfo() {
  document.getElementById("time-display").textContent = `⏱ 남은 시간: ${remainingTime}초`;
}
function startGameTimer(seconds) {
  remainingTime = seconds;
  updateGameInfo();

  const timer = setInterval(() => {
    remainingTime--;
    updateGameInfo();

    if (remainingTime <= 0) {
      clearInterval(timer);         
      isAnsweringAllowed = false;   
      clearInterval(bgInterval);    
      socket.emit("gameTimeOver");  
    }
  }, 1000);
}
function showOverlayText(text, color = "#ffffff") {
  const overlay = document.getElementById("overlay");
  console.log("✅ showOverlayText 실행됨", text); 

  overlay.textContent = text;
  overlay.style.color = color;
  overlay.style.display = "block";
  overlay.style.opacity = "1";

  overlay.style.transition = "opacity 0.8s ease";

  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 800);
  }, 1000);
}
document.getElementById("menu-btn")?.addEventListener("click", () => {
  const sound = clickSound.cloneNode();
  sound.load();  
  sound.play().catch(() => {});
  setTimeout(() => {
    window.location.href = "./menu.html";
  }, 300);
});

document.getElementById("retry-btn")?.addEventListener("click", () => {
  const sound = clickSound.cloneNode();
  sound.load(); 
  sound.play().catch(() => {});
  setTimeout(() => {
    window.location.href = "./catch_entry.html";
  }, 300);
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
document.addEventListener("deviceready", () => {
  console.log("📱 Cordova deviceready 호출됨");

  document.addEventListener("pause", () => {
    if (window.bgm && !window.bgm.paused) {
      window.bgm.pause();
      console.log("⏸ BGM 일시 정지됨");
    }
  }, false);

  document.addEventListener("resume", () => {
    if (window.bgm && window.bgm.paused) {
      window.bgm.play().catch(() => {});
      console.log("▶ BGM 다시 재생됨");
    }
  }, false);
}, false);
