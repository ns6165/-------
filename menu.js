const mainFrames = ["/image/background1.png", "/image/background2.png"];
let mainBgIndex = 0;
const mainContainer = document.querySelector(".game-container");

setInterval(() => {
  mainBgIndex = (mainBgIndex + 1) % mainFrames.length;
  mainContainer.style.backgroundImage = `url(${mainFrames[mainBgIndex]})`;
}, 600);
function goToCharacter(gameType) {
  localStorage.setItem("nextGame", gameType);
  window.location.href = "/character.html";
}
