let jitsiApi = null;

// JOIN TALK
document.getElementById("joinTalk").onclick = () => {
  if (jitsiApi) return;

  jitsiApi = new JitsiMeetExternalAPI("meet.jit.si", {
    roomName: "nyetradio-talk",
    parentNode: document.querySelector("#jitsi"),
    configOverwrite: {
      startWithAudioMuted: false,
      prejoinPageEnabled: false,
      disableDeepLinking: true,
    },
    interfaceConfigOverwrite: {
      TOOLBAR_BUTTONS: [],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
    }
  });

  log("🎙️ Connected to talk room");
};

// VOLUME CONTROL (LOCAL)
document.getElementById("volumeSlider").addEventListener("input", e => {
  const audio = document.querySelector("audio");
  if (audio) audio.volume = e.target.value;
});

// THEME TOGGLE
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
};

// CHAT LOG (UI ONLY)
function log(text) {
  const msg = document.createElement("div");
  msg.className = "msg system";
  msg.innerText = text;
  document.getElementById("messages").appendChild(msg);
}
