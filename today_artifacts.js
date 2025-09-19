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

const container = document.getElementById('event-container');
const reshuffleBtn = document.getElementById('reshuffle-btn');
const todayModal = document.getElementById('todayModalWrapper');
const todayStartBtn = document.getElementById('startBtn');
const todayMenuBtn = document.getElementById('goMenuBtn');
const screen = document.getElementById('screen');
const clickSound = new Audio("/sound/click.wav");

todayStartBtn.onclick = () => {
  sessionStorage.clear();
  localStorage.removeItem("reshuffleArtifact");
  playRandomBGM();
  const clickSound = new Audio("/sound/click.wav");
  clickSound.play().catch(() => {});
  todayModal.style.display = 'none';

  let viewSeconds = 0;
  const artifactTimer = setInterval(() => {
    viewSeconds++;
    if (viewSeconds === 600) {
      completeTask(57); 
      clearInterval(artifactTimer);
    }
  }, 1000);

  loadSingleArtifact();
};


todayMenuBtn.onclick = () => {
  const clickSound = new Audio("/sound/click.wav");
  clickSound.play().catch(() => {});
  setTimeout(() => {
    location.href = '/menu.html';
  }, 300); 
};


async function loadSingleArtifact() {
  container.innerHTML = `<div id="loading-text">유물을 뽑는 중...</div>`;
  reshuffleBtn.style.display = 'none';

  try {
   
const artifacts = quizData["no-date"] || [];
const randomArtifact = artifacts[Math.floor(Math.random() * artifacts.length)];

    setTimeout(() => {
  container.innerHTML = '';
  const randomArtifact = artifacts[Math.floor(Math.random() * artifacts.length)];

  const lastTitle = sessionStorage.getItem("lastTodayArtifact");
if (lastTitle === randomArtifact.title) {
  const repeatCount = parseInt(sessionStorage.getItem("repeatTodayArtifact") || "0") + 1;
  sessionStorage.setItem("repeatTodayArtifact", repeatCount);
  if (repeatCount >= 2) {
    completeTask(56);  
  }
} else {
  sessionStorage.setItem("lastTodayArtifact", randomArtifact.title);
  sessionStorage.setItem("repeatTodayArtifact", 1);
}

  const card = document.createElement('div');
  card.className = 'main-event';
  card.innerHTML = `
    <img src="${randomArtifact.imgPath}" alt="${randomArtifact.title}" />
    <h3>${randomArtifact.title}</h3>
    <p>${randomArtifact.detail}</p>
  `;
  container.appendChild(card);

  reshuffleBtn.style.display = 'block';
}, 1500);

  } catch (error) {
    container.innerHTML = `<p style='color:red;'>데이터 불러오기 실패!</p>`;
    console.error("🔴 에러:", error);
  }
}

reshuffleBtn.addEventListener('click', () => {
  const clickSound = new Audio("/sound/click.wav");
  clickSound.play().catch(() => {});

  let reshuffleCount = parseInt(localStorage.getItem("reshuffleArtifact") || "0") + 1;
  localStorage.setItem("reshuffleArtifact", reshuffleCount);
  if (reshuffleCount >= 10) {
    completeTask(58);  
  }

  loadSingleArtifact();
});

function goBackToMenu() {
  const clickSound = new Audio("/sound/click.wav");
  clickSound.play().catch(() => {});
  
  setTimeout(() => {
    localStorage.removeItem('nextGame');
    localStorage.removeItem('selectedCharacter');
    localStorage.removeItem('selectedMode');
    window.location.href = "/menu.html";
  }, 300); 
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
