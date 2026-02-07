// =======================
// FIREBASE INIT
// =======================
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

// =======================
// CHAT (TIDAK DIUBAH)
// =======================
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

// =======================
// NOW PLAYING (DARI MACRODROID)
// =======================
const nowPlayingRef = db.ref("nowPlaying");
const nowPlayingBox = document.getElementById("nowPlaying");

// Hanya membaca (Listen), tidak menulis (Set) agar tidak bentrok
nowPlayingRef.on("value", (snapshot) => {
  const song = snapshot.val();
  if (!song) {
    nowPlayingBox.innerHTML = "<b>Waiting for Stream...</b>";
    return;
  }

  // Menampilkan data yang dikirim MacroDroid (artist & title)
  nowPlayingBox.innerHTML = `
    <div class="song-info">
      <h2 id="songTitle">${song.title || 'Unknown Title'}</h2>
      <p id="songArtist">${song.artist || 'Unknown Artist'}</p>
    </div>
  `;
});

// =======================
// RENDER PLAYLIST (OPTIONAL)
// =======================
const playlistRef = db.ref("playlist");
const playlistBox = document.getElementById("playlistBox");

playlistRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const playlist = Object.values(data);
  playlistBox.innerHTML = "";

  playlist.forEach((song, i) => {
    const div = document.createElement("div");
    div.innerHTML = `${i + 1}. <b>${song.title}</b> - ${song.artist}`;
    playlistBox.appendChild(div);
  });
});

// =======================
// JITSI (TIDAK DIUBAH)
// =======================
let jitsiApi = null;
document.getElementById("joinTalk").onclick = () => {
  if (jitsiApi) {
    alert("Lo udah di room talk");
    return;
  }

  const jitsiBox = document.getElementById("jitsi");
  jitsiBox.classList.remove("jitsi-hidden");
  jitsiBox.classList.add("jitsi-show");

  jitsiApi = new JitsiMeetExternalAPI("meet.jit.si", {
    roomName: "nyetradio-talk",
    parentNode: jitsiBox,
    userInfo: { displayName: "Listener" },
    configOverwrite: {
      prejoinPageEnabled: true,
      startWithAudioMuted: false,
      startWithVideoMuted: true,
      disableDeepLinking: true
    },
    interfaceConfigOverwrite: {
      TOOLBAR_BUTTONS: ["microphone", "hangup"],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false
    }
  });

  jitsiApi.addEventListener("readyToClose", () => {
    jitsiBox.classList.remove("jitsi-show");
    jitsiBox.classList.add("jitsi-hidden");
    jitsiApi.dispose();
    jitsiApi = null;
  });
};

