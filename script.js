document
  .getElementById("formKelulusan")
  .addEventListener("submit", async function (event) {
    // Mencegah halaman web melakukan reload (refresh) saat tombol ditekan
    event.preventDefault();

    const nomorUjianInput = document.getElementById("nomorUjian").value;
    const divHasil = document.getElementById("hasilKelulusan");
    const tombolSubmit = document.querySelector('button[type="submit"]');

    // 1. Ubah tombol menjadi status Loading
    tombolSubmit.innerText = "Sedang Mencari Data...";
    tombolSubmit.disabled = true;
    divHasil.innerHTML = ""; // Kosongkan hasil sebelumnya

    try {
      // ==========================================
      // GANTI URL INI JIKA SUDAH ONLINE (Render / NAS / Apps Script)
      // Saat ini diatur untuk backend komputer lokal (Node.js) Anda
      // ==========================================
      const BASE_URL = "https://freedomfighters-api-backend-kelulusan.hf.space";

      const response = await fetch(`${BASE_URL}/api/cek-kelulusan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomorUjian: nomorUjianInput }),
      });

      const data = await response.json();

      // 2. Jika nomor ujian salah atau tidak ditemukan
      if (response.status !== 200) {
        divHasil.innerHTML = `<p style="color: #dc3545; margin-top: 20px; font-weight: normal;">${data.message}</p>`;
        return;
      }

      // 3. Menentukan warna lencana berdasarkan status kelulusan
      const warnaStatus =
        data.status.toUpperCase() === "LULUS" ? "#28a745" : "#dc3545";

      // 4. Menyusun elemen HTML hasil yang akan ditampilkan
      let htmlHasil = `
            <div style="margin-top: 25px; border-top: 1px solid #ddd; padding-top: 20px;">
                <img src="${BASE_URL}/api/foto/${data.fotoId}" alt="Foto Siswa">
                <p style="margin-top: 15px; font-size: 0.9rem; color: #666; font-weight: normal;">Nama Lengkap Siswa</p>
                <h3 style="margin: 5px 0 15px 0; color: #333;">${data.nama}</h3>
                <div style="background-color: ${warnaStatus}; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin-bottom: 15px;">
                    STATUS: ${data.status.toUpperCase()}
                </div>
            </div>
        `;

      // 5. Tambahkan tombol Download SKL hanya jika siswa dinyatakan LULUS
      if (data.status.toUpperCase() === "LULUS") {
        htmlHasil += `
                <a href="${BASE_URL}/api/download-skl/${data.sklId}" 
                   style="display: block; width: 100%; padding: 12px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-size: 1rem; margin-top: 10px; transition: 0.3s;"
                   onmouseover="this.style.backgroundColor='#218838'"
                   onmouseout="this.style.backgroundColor='#28a745'">
                   Download Surat Keterangan Lulus (SKL)
                </a>
            `;
      }

      // 6. Tampilkan ke layar
      divHasil.innerHTML = htmlHasil;
    } catch (err) {
      console.error(err);
      divHasil.innerHTML = `<p style="color: #dc3545; margin-top: 20px; font-weight: normal;">Gagal menyambung ke server. Pastikan server nyala.</p>`;
    } finally {
      // 7. Kembalikan kondisi tombol submit seperti semula
      tombolSubmit.innerText = "Cek Kelulusan";
      tombolSubmit.disabled = false;
    }
  });
