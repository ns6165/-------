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
import quizData from '/figures.js';
const figures = quizData;
console.log("✅ faceapi 상태:", typeof faceapi);
window.addEventListener('DOMContentLoaded', async () => {
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resultImage = document.getElementById('resultImage');
  const description = document.getElementById('description');
  const resultModal = document.getElementById('resultModal');
  const closeBtn = document.getElementById('closeBtn');
  const startModal = document.getElementById("startModal");
  const quizScreen = document.getElementById("quiz-screen");
  const startConfirmBtn = document.getElementById("startConfirmBtn");
  const goMenuBtn = document.getElementById("goMenuBtn");
  let isReady = false;
  let fileReady = false;
  
  if (startConfirmBtn) {
    startConfirmBtn.onclick = () => {
      playRandomBGM();
      startModal.style.display = "none";
      quizScreen.style.display = "flex";
    };
  }

  if (goMenuBtn) {
    goMenuBtn.onclick = () => {
      const audio = new Audio("/sound/click.wav");
      audio.play().catch(() => {});
      setTimeout(() => {
        location.href = "/menu.html";
      }, 300);
    };
  }
  let selectedFile = null;
  let knownDescriptors = [];

await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

  for (let fig of figures) {
    const img = await faceapi.fetchImage(fig.imgPath);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (detection) {
      knownDescriptors.push(new faceapi.LabeledFaceDescriptors(fig.name, [detection.descriptor]));
    }
  }
isReady = true;
document.getElementById('customUploadBtn').disabled = false;
customUploadBtn.addEventListener('click', () => {
  if (!isReady) {
    alert(" AI 준비 중입니다. 잠시만 기다려주십시오!");
    return;
  }
  imageInput.click();
});

const status = document.getElementById("aiStatusText");
if (status) {
  status.textContent = "✅ AI 준비 완료!";
  status.style.color = "green";
}

  imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    preview.src = event.target.result;
    preview.style.background = 'none';
    selectedFile = file;
    fileReady = true; 
  };
  reader.readAsDataURL(file);
});
analyzeBtn.addEventListener('click', async () => {
  if (!selectedFile) {
    alert("	사진을 먼저 선택해 주십시오!");
    return;
  }
   if (!isReady) {
    alert("AI가 아직 준비되지 않았습니다. 잠시만 기다려주십시오!");
    return;
  }
  try {
    new Audio("/sound/click.wav").play().catch(() => {});
  } catch (e) {}

  localStorage.setItem("face_result_start", Date.now());
  description.textContent = "🤖 AI 분석 중...";
  resultModal.style.display = "flex";

  const img = await faceapi.bufferToImage(selectedFile);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    resultImage.src = "/image/placeholder.png";
    description.textContent = "⚠ 얼굴을 인식하지 못했습니다.";
    return;
  }

  const rollImages = figures.map(f => f.imgPath);
  let rollIndex = 0;
  resultImage.classList.add("roll");

  const rolling = setInterval(() => {
    resultImage.src = rollImages[rollIndex % rollImages.length];
    rollIndex++;
  }, 100);

  const matcher = new faceapi.FaceMatcher(knownDescriptors);
  const match = matcher.findBestMatch(detection.descriptor);
  const matched = figures.find(f => f.name === match.label);

  setTimeout(() => {
    clearInterval(rolling);
    resultImage.classList.remove("roll");

    const detectedHeroName = match.label;

    if (!matched || detectedHeroName === "unknown") {
      resultImage.src = "/image/placeholder.png";
      description.textContent = "⚠ 닮은 위인을 찾을 수 없습니다!";
    } else {
      resultImage.src = matched.imgPath;
      description.textContent = `당신은 ${detectedHeroName} 님과 닮았습니다!`;
      checkAchievements_FACEFINDER(detectedHeroName);
    }

    closeBtn.onclick = () => {
      resultModal.style.display = "none";
    };
  }, 3000);
});


  closeBtn.addEventListener('click', () => {
    resultModal.style.display = "none";
  });
});
;


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
function checkAchievements_FACEFINDER(detectedHeroName) {
  let uploadCount = parseInt(localStorage.getItem("face_upload_count") || "0");
  uploadCount++;
  localStorage.setItem("face_upload_count", uploadCount);
  if (uploadCount >= 5) completeTask(32);

  const startTime = parseInt(localStorage.getItem("face_start_time") || Date.now());
  let totalSec = parseInt(localStorage.getItem("face_total_time") || "0");
  totalSec += Math.floor((Date.now() - startTime) / 1000);
  localStorage.setItem("face_total_time", totalSec);
  if (totalSec >= 600) completeTask(33); 

  const resultStart = parseInt(localStorage.getItem("face_result_start") || Date.now());
  let resultStay = parseInt(localStorage.getItem("face_result_time") || "0");
  resultStay += Math.floor((Date.now() - resultStart) / 1000);
  localStorage.setItem("face_result_time", resultStay);
  if (resultStay >= 300) completeTask(34); 

  const heroSet = new Set(JSON.parse(localStorage.getItem("face_heroes") || "[]"));
  heroSet.add(detectedHeroName);
  localStorage.setItem("face_heroes", JSON.stringify([...heroSet]));
  if (heroSet.size >= 5) completeTask(35);

  let dupCount = parseInt(localStorage.getItem(`face_dup_${detectedHeroName}`) || "0");
  dupCount++;
  localStorage.setItem(`face_dup_${detectedHeroName}`, dupCount);
  if (dupCount >= 2) completeTask(36);
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
