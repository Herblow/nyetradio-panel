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
// PLAYLIST & NOW PLAYING
// =======================
const playlistRef = db.ref("playlist");
const nowPlayingRef = db.ref("nowPlaying");

let playTimer = null;

// AUTO ROTATE PLAYLIST (AMAN DARI RELOAD)
playlistRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const playlist = Object.values(data);

  nowPlayingRef.once("value", (npSnap) => {
    let index = 0;

    if (npSnap.exists()) {
      const current = npSnap.val();
      const found = playlist.findIndex(
        s => s.title === current.title && s.artist === current.artist
      );
      index = found === -1 ? 0 : (found + 1) % playlist.length;
    }

    function playNext() {
      const song = playlist[index];

      nowPlayingRef.set({
        title: song.title,
        artist: song.artist,
        album: song.album || "",
        cover: song.cover || "",
        startedAt: Date.now(),
        duration: song.duration
      });

      index = (index + 1) % playlist.length;
      playTimer = setTimeout(playNext, song.duration * 1000);
    }

    if (!playTimer) playNext();
  });
});

// =======================
// RENDER NOW PLAYING
// =======================
const nowPlayingBox = document.getElementById("nowPlaying");

nowPlayingRef.on("value", (snapshot) => {
  const song = snapshot.val();
  if (!song) return;

  nowPlayingBox.innerHTML = `
    <b>${song.title}</b><br>
    ${song.artist}
  `;
});

// =======================
// RENDER PLAYLIST
// =======================
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