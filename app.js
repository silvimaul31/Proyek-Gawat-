// 1. KONFIGURASI FIREBASE (Pastikan sama dengan yang di index.html)
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

// 2. MENDENGARKAN LAPORAN MASUK (REAL-TIME)
db.ref('laporan_gawat').on('child_added', (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    renderLaporan(data, key);
    updateCounter(data.kategori, 1);
    
    // Suara Peringatan Jarvis
    playAlertVoice(data.nama, data.kategori);
});

// 3. FUNGSI TAMPILKAN KE DASHBOARD
function renderLaporan(item, key) {
    // Cari kolom berdasarkan kategori (Medical, Fire, Police, SAR)
    const targetId = `list-${item.kategori.toLowerCase()}`;
    const targetContainer = document.getElementById(targetId);
    
    if (targetContainer) {
        // Link Google Maps dari data Lat & Lng
        const googleMapsLink = `https://www.google.com/maps?q=${item.lat},${item.lng}`;
        
        const card = `
            <div id="card-${key}" class="report-card" style="border-left: 5px solid ${getColor(item.kategori)}; margin-bottom:15px; background:#1a1a1a; padding:15px; border-radius:10px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <strong style="color:white;">👤 ${item.nama} [${item.prioritas}]</strong>
                    <span style="font-size:10px; color:gray;">${item.waktu}</span>
                </div>
                <p style="color:#ccc; font-size:13px; margin: 10px 0;">${item.pesan || item.detail}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top:10px;">
                    <a href="${googleMapsLink}" target="_blank" style="text-decoration:none; background:#0088cc; color:white; text-align:center; padding:8px; border-radius:5px; font-size:11px; font-weight:bold;">
                        📍 CEK LOKASI
                    </a>
                    <button onclick="tandaiSelesai('${key}', '${item.kategori}', '${item.nama}')" style="background:#27ae60; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer; font-size:11px; font-weight:bold;">
                        SELESAI
                    </button>
                </div>
            </div>
        `;
        targetContainer.insertAdjacentHTML('afterbegin', card);
    }
}

// 4. FUNGSI SELESAI (Hapus dari List & Tambah ke History)
function tandaiSelesai(key, kategori, nama) {
    if (confirm(`Selesaikan tugas untuk ${nama}?`)) {
        // Hapus dari Firebase
        db.ref('laporan_gawat/' + key).remove();
        
        // Hapus dari tampilan
        document.getElementById(`card-${key}`).remove();
        
        // Kurangi Counter
        updateCounter(kategori, -1);
        
        // Tambah ke History Log di layar
        const log = document.getElementById('history-log');
        const time = new Date().toLocaleTimeString();
        log.innerHTML += `<div>✅ [${time}] Unit ${kategori} selesai: ${nama}</div>`;
    }
}

// --- FUNGSI PEMBANTU (UTILITY) ---

function getColor(kat) {
    const colors = { Ambulance: '#ff0000', Damkar: '#ff8c00', Polisi: '#0000ff', Timsar: '#00ff00' };
    return colors[kat] || '#ffffff';
}

function updateCounter(kat, val) {
    const counterId = `count-${kat.toLowerCase()}`;
    const el = document.getElementById(counterId);
    if (el) {
        let current = parseInt(el.innerText) || 0;
        el.innerText = Math.max(0, current + val);
    }
}

function playAlertVoice(nama, kategori) {
    const msg = new SpeechSynthesisUtterance(`Peringatan! Laporan ${kategori} baru dari ${nama}`);
    msg.lang = 'id-ID';
    window.speechSynthesis.speak(msg);
}

// Ambil lokasi Admin untuk memindai cuaca (seperti di gambar kamu)
function scanAdminLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const locEl = document.getElementById('location-display');
            if(locEl) locEl.innerText = `LAT: ${pos.coords.latitude.toFixed(4)} | LNG: ${pos.coords.longitude.toFixed(4)}`;
        });
    }
}
scanAdminLocation();
