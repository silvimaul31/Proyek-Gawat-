// GANTI DENGAN KODE DARI FIREBASE PROJECT SETTINGS KAMU
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "gawatapp.firebaseapp.com",
  databaseURL: "https://gawatapp-default-rtdb.firebaseio.com", 
  projectId: "gawatapp",
  storageBucket: "gawatapp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Start Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Fungsi Kirim Laporan
function laporGawat(teks) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            db.ref('laporan_gawat').push({
                pesan: teks,
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                waktu: Date.now()
            }).then(() => {
                alert("Laporan GAWAT Berhasil Terkirim!");
            }).catch((err) => {
                alert("Gagal kirim: " + err.message);
            });
        }, () => {
            alert("Tolong izinkan GPS agar petugas tahu lokasi Anda.");
        });
    }
}

// Tombol SOS
const sosBtn = document.getElementById('sos-btn');
if(sosBtn) {
    sosBtn.onclick = () => laporGawat("TOMBOL SOS DITEKAN - BUTUH BANTUAN!");
}

// Tombol Kirim Chat
const sendBtn = document.getElementById('send-btn');
const input = document.getElementById('user-input');
if(sendBtn) {
    sendBtn.onclick = () => {
        if(input.value) {
            laporGawat(input.value);
            input.value = "";
        }
    }
}
