let audioContext;
let analyser;
let micSource;
let ducked = false;

const THRESHOLD = 0.04;   // sensitivitas suara
const DUCK_VOL = 0.25;   // volume saat ngomong
const NORMAL_VOL = 1.0;

async function initMicDucking() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  micSource = audioContext.createMediaStreamSource(stream);

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;

  micSource.connect(analyser);

  monitorMic();
}

function monitorMic() {
  const data = new Uint8Array(analyser.fftSize);

  function loop() {
    analyser.getByteTimeDomainData(data);

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }

    const rms = Math.sqrt(sum / data.length);

    if (rms > THRESHOLD && !ducked) {
      duckMusic();
    }

    if (rms < THRESHOLD && ducked) {
      unduckMusic();
    }

    requestAnimationFrame(loop);
  }

  loop();
}

// === CONTROL EMBED PLAYER ===
function duckMusic() {
  ducked = true;
  setCasterVolume(DUCK_VOL);
}

function unduckMusic() {
  ducked = false;
  setCasterVolume(NORMAL_VOL);
}

function setCasterVolume(val) {
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach(slider => {
    slider.value = val;
    slider.dispatchEvent(new Event("input"));
  });
}
