const socket = io("https://catchmind-server.onrender.com");
let selectedTeam = null;
const clickSound = new Audio("./sound/click.wav");
let selectedRole = "player"; 

function selectRole(role) {
  clickSound.cloneNode().play().catch(() => {}); 

  selectedRole = role;
  document.querySelectorAll(".role-btn").forEach(btn => btn.classList.remove("selected"));
  if (role === "player") {
    document.querySelector(".role-btn:nth-child(1)").classList.add("selected");
  } else {
    document.querySelector(".role-btn:nth-child(2)").classList.add("selected");
  }
}

function selectTeam(team, btn) {
  clickSound.cloneNode().play().catch(() => {}); 
  selectedTeam = team;
  document.querySelectorAll(".team-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

document.getElementById("ready-btn").addEventListener("click", () => {
  clickSound.cloneNode().play().catch(() => {});  
  const nickname = document.getElementById("nickname").value.trim();
  const code = document.getElementById("code").value.trim();
 

  console.log("📥 ready 눌림:", { nickname, code, selectedTeam, selectedRole });

  if (!nickname || !code || !selectedTeam) {
    alert("닉네임, 코드, 조를 모두 입력해야 합니다!");
    return;
  }

  socket.emit("verifyCode", code);
  console.log("📤 verifyCode 전송:", code);

  socket.once("codeResult", (isValid) => {
    console.log("📥 codeResult 수신:", isValid);

    if (!isValid) {
      alert("게임 코드가 올바르지 않습니다.");
      return;
    }

    
    socket.emit("join", {
      nickname: nickname,
      code: code,
      team: selectedTeam,
      role: selectedRole
    });

    console.log("📤 join 전송됨");

    socket.once("joinSuccess", () => {
      console.log("✅ joinSuccess 수신");

      localStorage.setItem("nickname", nickname);
      localStorage.setItem("code", code);
      localStorage.setItem("team", selectedTeam);
      localStorage.setItem("role", selectedRole);

      setTimeout(() => {
        console.log("⏭ 이동: ./catch_game.html");
        location.href = "./catch_game.html";
      }, 300);
    });
  });
});
function goToMainMenu() {
  const clickSound = new Audio("./sound/click.wav");
  clickSound.play().catch(() => {});

  localStorage.removeItem('nextGame');
  localStorage.removeItem('selectedCharacter');
  localStorage.removeItem('selectedMode');

  setTimeout(() => {
  window.location.href = "./menu.html";  
  }, 300);
}
