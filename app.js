const ably = new Ably.Realtime('MASUKKAN_API_KEY_ABLY_KAMU_DI_SINI');
const channel = ably.channels.get('emergency-channel');

// Monitor mendengarkan laporan masuk secara real-time
channel.subscribe('laporan-baru', (msg) => {
    const data = msg.data;
    
    // 1. Suara Jarvis bicara
    let alertMsg = data.pesan.includes("SOS") ? 
        "Peringatan Kritis! Sinyal SOS terdeteksi!" : 
        `Laporan baru dari ${data.nama} masuk.`;
    
    let speech = new SpeechSynthesisUtterance(alertMsg);
    speech.lang = 'id-ID';
    window.speechSynthesis.speak(speech);

    // 2. Tambahkan ke daftar tampilan dashboard kamu
    // Panggil fungsi render yang sudah kamu punya sebelumnya
    tambahLaporanKeDashboard(data); 
});

// Fungsi pembantu untuk cuaca (seperti yang kamu tanya tadi, supaya lokasinya muncul)
async function getWeatherData() {
    const apiKey = 'b7123363f060adb244dcc8cf3d443e09'; 
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiKey}&units=metric&lang=id`;
        const res = await fetch(url);
        const d = await res.json();
        
        document.getElementById('weather-temp').innerText = `${Math.round(d.main.temp)}°C`;
        document.getElementById('weather-city').innerText = `LOC: ${d.name.toUpperCase()}`;
    });
}
getWeatherData();
