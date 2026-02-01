// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV5K8-zseYUbtzK7QJAkyN-UnILiSFOkg",
  authDomain: "live-chat-nyet.firebaseapp.com",
  databaseURL: "https://live-chat-nyet-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "live-chat-nyet",
  storageBucket: "live-chat-nyet.firebasestorage.app",
  messagingSenderId: "112945135453",
  appId: "1:112945135453:web:983ed80516e971091ef2b4",
  measurementId: "G-D69QGGJJ6T"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const chatRef = db.ref("chat");

const chatInput = document.getElementById("chatInput");
const chatBox = document.getElementById("chatBox");

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && chatInput.value.trim() !== "") {
    chatRef.push({
      text: chatInput.value,
      time: Date.now()
    });
    chatInput.value = "";
  }
});

chatRef.limitToLast(50).on("child_added", (snapshot) => {
  const msg = snapshot.val();
  const div = document.createElement("div");
  div.textContent = msg.text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

const nowPlayingRef = db.ref("nowPlaying");

// TEST: kirim data dummy
nowPlayingRef.set({
  title: "TEST SONG",
  artist: "NyetRadio",
  album: "Prototype",
  cover: "",
  startedAt: Date.now()
});

db.ref("nowPlaying").on("value", (snap) => {
  console.log("NOW PLAYING =", snap.val());
});

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
      prejoinPageEnabled: true,   // auto join tanpa prejoin page
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

