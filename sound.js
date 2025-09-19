const sounds = {
  click: new Audio('/sound/click.wav')             
};

function playSound(name) {
  if (sounds[name]) {
    sounds[name].currentTime = 0; 
    sounds[name].play();
  }
}
