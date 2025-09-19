let selectedCharacter = null;
let typingInterval = null;
function selectCharacter(name) {
  playSound('click');
  selectedCharacter = name;
  const tooltip = document.getElementById("tooltip");

  const texts = {
    '북북이': '북북이는 도서관에서 책만 읽다 지쳐버린 책입니다. 머릿속이 어질어질해질 만큼 공부만 하다가, 이제는 진짜 역사 속 이야기를 발로 뛰며 만나보고 싶어졌습니다!',
    '별별이': '별별이는 별나라에서 온 반짝이는 별입니다. 어느 날 별자리가 사라져 길을 잃고 지구에 떨어졌습니다. 역사 속 반짝이는 조각들을 찾아 별지도를 다시 만들려고 합니다!',
    '패패': '패패는 하늘을 자유롭게 날던 방패연입니다. 하지만 요즘은 아무리 바람이 불어도 날 수가 없습니다. 역사 속 지혜와 용기를 만나면, 다시 날 수 있을지도 모릅니다!',
    '반반이': '반반이는 겉모습은 점잖은 선비지만, 사실은 엉뚱한 허당입니다. 중요한 시험을 떨어진 뒤로 마음이 너무 슬펐습니다. 그래서 사람들의 따뜻한 이야기와 진짜 마음을 찾아 떠났습니다!'
  };

  if (typingInterval) clearTimeout(typingInterval);
  tooltip.innerHTML = '';
  tooltip.style.display = 'block';

  const descBox = document.createElement('div');
  descBox.style.background = 'rgba(0, 0, 0, 0.7)';
  descBox.style.padding = '1rem';
  descBox.style.borderRadius = '20px';
  descBox.style.color = 'white';
  descBox.style.fontSize = '1.3rem';
  descBox.style.marginBottom = '1rem';
  tooltip.appendChild(descBox);

  const text = texts[name] || '';
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      descBox.innerHTML += text.charAt(i);
      i++;
      typingInterval = setTimeout(typeWriter, 30);
    } else {
      displayCharacterMissions(name, tooltip); 
    }
  }

  typeWriter();
}

function displayCharacterMissions(name, tooltip) {
  const taskStates = getTasks(name);
  const taskIds = CHARACTER_TASKS[name] || [];

  const taskBox = document.createElement('div');
  taskBox.style.background = 'rgba(0, 0, 0, 0.7)';
  taskBox.style.padding = '1rem';
  taskBox.style.borderRadius = '20px';
  taskBox.style.color = 'white';

  const grid = document.createElement('div');
  grid.className = 'task-grid';

  taskIds.forEach((taskId) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    const isCompleted = taskStates[taskId] || false;
    taskDiv.textContent = `${isCompleted ? '✅' : '☐'} ${TASK_DESCRIPTION_TEXTS[taskId] || '설명 없음'}`;
    grid.appendChild(taskDiv);
  });

  taskBox.appendChild(grid);
  tooltip.appendChild(taskBox);
}

function confirmSelection() {
  playSound('click');
  if (!selectedCharacter) {
    alert("캐릭터를 선택하지 않았습니다!");
    return;
  }

  localStorage.setItem('selectedCharacter', selectedCharacter);
  let nextGame = localStorage.getItem('nextGame') || 'quizbattle';

  switch (nextGame) {
    case 'quizbattle':
      openModeModal('quizbattle');
      break;
    case 'hero':
      openModeModal('hero');
      break;
    case 'today':
      openModeModal('today');
      break;
    case 'together':
      openModeModal('together');
      break;
    case 'practice':
      goToPracticeMode('practicequiz'); 
      break;
    default:
      alert("게임 경로를 찾을 수 없습니다.");
  }
}

function goToPracticeMode(mode) {
  playSound('click');
  const paths = {
    practicequiz: "practice.html"
  };

  if (paths[mode]) {
    setTimeout(() => {
      window.location.href = paths[mode];
    }, 150);
  } else {
    alert("준비 중인 모드입니다.");
  }
}

function closeAllModals() {
  playSound('click');
  document.getElementById("quizbattleModal").style.display = "none";
  document.getElementById("heroModal").style.display = "none";
  document.getElementById("todayModal").style.display = "none";
  document.getElementById("togetherModal").style.display = "none";
  document.getElementById("popupDimmed").style.display = "none";
}

function selectMode(mode) {
  playSound('click');
  if (!selectedCharacter) {
    alert("캐릭터를 선택하지 않았습니다!");
    return;
  }

  localStorage.setItem('selectedMode', mode);

  const pages = {
    'quizbattle': 'quizbattle.html',
    'connectgame': 'connectgame.html',
    'oxquiz': 'oxquiz.html',
    'final': 'final.html'
  };

  if (pages[mode]) {
    setTimeout(() => {
      window.location.href = pages[mode];
    }, 150); 
  } else {
    alert("알 수 없는 모드입니다.");
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('title').src = "/image/character-background-title1.png";
  document.querySelector('.container').style.backgroundImage = "url(/image/character-background2.png)";
});
function goBackToMenu() {
  playSound('click');

  localStorage.removeItem('nextGame');
  localStorage.removeItem('selectedCharacter');
  localStorage.removeItem('selectedMode');

  setTimeout(() => {
    window.location.href = "menu.html";
  }, 150);
}

window.selectCharacter = selectCharacter;
window.confirmSelection = confirmSelection;
window.selectMode = selectMode;
window.openModeModal = openModeModal;
window.goToPracticeMode = goToPracticeMode;
window.goToHeroMode = goToHeroMode;
window.goToTodayMode = goToTodayMode;
window.goToTogetherMode = goToTogetherMode;

function openModeModal(type) {
  playSound('click');
  const modalId = {
    quizbattle: "quizbattleModal",
    hero: "heroModal",
    today: "todayModal",
    together: "togetherModal"
  }[type];

  if (modalId) {
    document.getElementById("popupDimmed").style.display = "block";
    document.getElementById(modalId).style.display = "block";
  }
}

function goToHeroMode(mode) {
  playSound('click');
  const paths = {
    face: "face.html",
    puzzle: "hero-puzzle.html",
    detective: "face-quiz.html"
  };
  if (paths[mode]) {
    setTimeout(() => {
      window.location.href = paths[mode];
    }, 150); 
  }
}

function goToTodayMode(mode) {
  playSound('click');
  const paths = {
    event: "today-event.html",
    hero: "today-hero.html",
    artifact: "today_artifacts.html"
  };
  if (paths[mode]) {
    setTimeout(() => {
      window.location.href = paths[mode];
    }, 150);
  }
}

function goToTogetherMode(mode) {
  playSound('click');
  const paths = {
    goldenbell: "entry-page.html",
    catchmind: "catch_entry.html",
    cardmatch: "entry-page_card.html"
  };
  if (paths[mode]) {
    setTimeout(() => {
      window.location.href = paths[mode];
    }, 150);
  }
}
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
  9: 'OX퀴즈 누적 500점 이상',
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
function getTasks(name) {
  const data = JSON.parse(localStorage.getItem("achievements") || "{}");
  const tasks = data[name] || [];

  const totalCount = Object.keys(TASK_DESCRIPTION_TEXTS).length;
  while (tasks.length < totalCount) tasks.push(false); 

  return tasks;
}
