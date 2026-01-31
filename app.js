// THEME
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
};

// JOIN TALK (NO JITSI UI)
document.getElementById("joinTalk").onclick = () => {
  if (window.jitsiApi) {
  alert("Lo udah di room talk");
  return;
}  

  const jitsiBox = document.getElementById("jitsi");
  jitsiBox.classList.remove("jitsi-hidden");
  jitsiBox.classList.add("jitsi-show");

    roomName: "nyetradio-talk",
    parentNode: jitsiBox,

    userInfo: {
      displayName: "Listener"
    },

    configOverwrite: {
      prejoinPageEnabled: false,
      startWithAudioMuted: false,
      startWithVideoMuted: true,
      disableDeepLinking: true
    },

    interfaceConfigOverwrite: {
      TOOLBAR_BUTTONS: [
        "microphone",
        "hangup"
      ],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false
    }
  });

  window.jitsiApi.addEventListener("readyToClose", () => {
  const jitsiBox = document.getElementById("jitsi");
  jitsiBox.classList.remove("jitsi-show");
  jitsiBox.classList.add("jitsi-hidden");

  window.jitsiApi.dispose();
  window.jitsiApi = null;
});

  // AUTO JOIN TANPA PREJOIN
  api.addEventListener("videoConferenceJoined", () => {
    console.log("Langsung masuk room");
  });
};

// VOLUME CONTROL (LISTENER SIDE)
document.getElementById("volume").addEventListener("input", e => {
  const audio = document.querySelector("audio");
  if (audio) audio.volume = e.target.value;
});

// CHAT UI (LOCAL ONLY)
const chatBox = document.getElementById("chatBox");
document.getElementById("chatInput").addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.value.trim()) {
    chatBox.innerHTML += `<div>${e.target.value}</div>`;
    e.target.value = "";
  }
});
