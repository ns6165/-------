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

window.addEventListener('DOMContentLoaded', () => {
  const startModal = document.getElementById('startModal');
  const practiceScreen = document.getElementById('practice-screen');
  const startBtn = document.getElementById('startBtn');
  const goMenuBtn = document.getElementById('goMenuBtn');

  practiceScreen.style.display = 'flex';
 
  startBtn.onclick = () => {
     playRandomBGM();
     typeTimerStart = Date.now(); 
    startModal.style.display = 'none';              
    loadingText.style.display = 'block';            
    container.innerHTML = '';                      

    setTimeout(() => {
      fetchQuizFiles();                            
    }, 1500);
  };
setInterval(() => {
    const elapsed = Math.floor((Date.now() - typeTimerStart) / 1000);
    if (elapsed >= 300) {
      checkAchievements_PRACTICE({
        type: currentQuizType,
        elapsedTime: elapsed,
        searchCount: 0
      });
      typeTimerStart = Date.now();
    }
  }, 10000);
  goMenuBtn.onclick = () => {
  const audio = new Audio("/sound/click.wav");
  audio.play().catch(() => {});
  setTimeout(() => {
    location.href = '/menu.html';
  }, 300);  
};

});

const container = document.getElementById("card-container");
const loadingText = document.getElementById("loading-text");
const searchInput = document.getElementById("search-input");
const toggleAnswerBtn = document.getElementById("toggle-answer-btn");

let allQuizzes = []; 
let answersVisible = true;
let currentQuizType = "choice";  
let typeTimerStart = 0;
const quizFileMap = {
  choice: "data/practice_choice.json",
  subjective: "data/practice_subjective.json",
  image: "data/practice_image.json"
};

let quizFiles = [quizFileMap.choice];

document.querySelectorAll(".type-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    savePracticeElapsedTime();

    const type = btn.dataset.type;
    currentQuizType = type;
    typeTimerStart = Date.now(); 

    quizFiles = [quizFileMap[type]];
    loadingText.style.display = "block";
    container.innerHTML = "";
    fetchQuizFiles();
  });
});


function createQuizCard(q, index) {
  const card = document.createElement("div");
  card.className = "quiz-card";

  const question = document.createElement("h3");
  question.textContent = `Q${index + 1}. ${q.question}`;
  card.appendChild(question);

  if (q.image) {
    const img = document.createElement("img");
    img.src = q.image;
    img.alt = "관련 이미지";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "10px";
    img.style.margin = "0.8rem 0";
    card.appendChild(img);
  }

  if (q.choices && Array.isArray(q.choices)) {
    const ul = document.createElement("ul");
    q.choices.forEach((choice, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${choice}`;
      ul.appendChild(li);
    });
    card.appendChild(ul);
  }

  const answer = document.createElement("div");
  answer.className = "answer";

  if (q.choices && typeof q.answer === 'number') {
    answer.textContent = `✅ 정답: ${q.choices[q.answer]}`;
  } else if (typeof q.answer === 'string') {
    answer.textContent = `✅ 정답: ${q.answer}`;
  } else if (q.pair) {
    answer.textContent = `✅ 정답: ${q.pair}`;
  } else {
    answer.textContent = `✅ 정답 정보 없음`;
  }

  if (!answersVisible) answer.style.display = "none";
  card.appendChild(answer);

  return card;
}

function renderCards(data) {
  container.innerHTML = ""; 
  data.forEach((q, i) => {
    const card = createQuizCard(q, i);
    container.appendChild(card);
  });
}

function fetchQuizFiles() {
  container.innerHTML = ""; 

  if (currentQuizType === "choice") {
    allQuizzes = window.practiceChoiceData;
  } else if (currentQuizType === "subjective") {
    allQuizzes = window.practiceSubjectiveData;
  } else if (currentQuizType === "image") {
    allQuizzes = window.practiceImageData;
  } else {
    console.error("❌ 알 수 없는 퀴즈 유형입니다.");
    return;
  }

  renderCards(allQuizzes); 
  loadingText.style.display = "none"; 
}

toggleAnswerBtn.addEventListener("click", () => {
  answersVisible = !answersVisible;
  toggleAnswerBtn.textContent = answersVisible ? "✅ 정답 숨기기" : "❓ 정답 보기";
  renderCards(allQuizzes);
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = allQuizzes.filter(q => {
  const questionMatch = q.question.toLowerCase().includes(keyword);
  const choiceMatch = Array.isArray(q.choices)
    ? q.choices.some(c => c.toLowerCase().includes(keyword))
    : false;
  return questionMatch || choiceMatch;
});
  renderCards(filtered);

  checkAchievements_PRACTICE({
    type: currentQuizType,
    elapsedTime: 0,
    searchCount: 1
  });
});
function goBackToMenu() {
  localStorage.removeItem('nextGame');
  localStorage.removeItem('selectedCharacter');
  localStorage.removeItem('selectedMode');
  setTimeout(() => {
    window.location.href = "/menu.html";
  }, 300); 
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
function checkAchievements_PRACTICE({ type, elapsedTime, searchCount }) {
  const timeKey = `practice_time_${type}`; 
  let totalTime = parseInt(localStorage.getItem(timeKey) || "0");
  totalTime += elapsedTime;
  localStorage.setItem(timeKey, totalTime);

  if (type === "choice" && totalTime >= 300) completeTask(43);

  if (type === "subjective" && totalTime >= 300) completeTask(44);

  if (type === "image" && totalTime >= 300) completeTask(45);

  let totalSearch = parseInt(localStorage.getItem("practice_search_count") || "0");
  totalSearch += searchCount;
  localStorage.setItem("practice_search_count", totalSearch);

  if (totalSearch >= 20) completeTask(46);
}
function savePracticeElapsedTime() {
  if (!typeTimerStart) return; 

  const elapsed = Math.floor((Date.now() - typeTimerStart) / 1000);
  if (elapsed <= 0) return;

  checkAchievements_PRACTICE({
    type: currentQuizType,
    elapsedTime: elapsed,
    searchCount: 0
  });
}

window.addEventListener("beforeunload", savePracticeElapsedTime);
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
  const taskIDs = CHARACTER_TASKS[character] || [];
  const completed = saved[character] || {};

  const isAllDone = taskIDs.every(id => completed[id]);
  if (isAllDone) {
    localStorage.setItem("endingShown", "true");
    window.location.href = "ending.html";
  }
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
