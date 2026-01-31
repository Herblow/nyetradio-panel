// =======================
// GLOBAL VAR
// =======================
let jitsiApi = null;

// =======================
// THEME TOGGLE
// =======================
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
};

// =======================
// JOIN TALK
// =======================
document.getElementById("joinTalk").onclick = () => {
  // Udah join?
  if (jitsiApi) {
    alert("Lo udah di room talk");
    return;
  }

  // 1️⃣ tampilkan div Jitsi
  const jitsiBox = document.getElementById("jitsi");
  jitsiBox.classList.remove("jitsi-hidden");
  jitsiBox.classList.add("jitsi-show");

  // 2️⃣ init Jitsi
  jitsiApi = new JitsiMeetExternalAPI("meet.jit.si", {
    roomName: "nyetradio-talk",
    parentNode: jitsiBox,
    userInfo: { displayName: "Listener" },
    configOverwrite: {
      prejoinPageEnabled: false,   // auto join tanpa prejoin page
      startWithAudioMuted: false,  // mic langsung aktif
      startWithVideoMuted: true,
      disableDeepLinking: true
    },
    interfaceConfigOverwrite: {
      TOOLBAR_BUTTONS: ["microphone", "hangup"],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false
    }
  });

  // 3️⃣ event: auto join log
  jitsiApi.addEventListener("videoConferenceJoined", () => {
    console.log("🎙 Langsung masuk room");
  });

  // 4️⃣ event: close room
  jitsiApi.addEventListener("readyToClose", () => {
    jitsiBox.classList.remove("jitsi-show");
    jitsiBox.classList.add("jitsi-hidden");

    jitsiApi.dispose();
    jitsiApi = null;
  });
};

// =======================
// CHAT UI (LOCAL ONLY)
// =======================
const chatBox = document.getElementById("chatBox");
document.getElementById("chatInput").addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.value.trim()) {
    const div = document.createElement("div");
    div.textContent = e.target.value;
    chatBox.appendChild(div);
    e.target.value = "";
  }
});
