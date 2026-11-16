# Portofolio (Netlify + Git + Decap CMS)

Situs statis. Push ke GitHub, Netlify otomatis membangun ulang. Konten (proyek dan pengalaman)
diedit lewat `/admin/`, dan setiap simpan menjadi commit di repo sehingga Netlify ikut memperbarui situs.

## Struktur
- `public/` isi situs (folder inilah yang dipublikasikan)
- `public/content/*.json` data proyek dan pengalaman (diedit lewat /admin/)
- `public/admin/` panel admin (Decap CMS), pengaturan di `config.yml`
- `netlify.toml` pengaturan Netlify

## 1. Dorong ke GitHub
```bash
git init
git add .
git commit -m "Portofolio pertama"
git branch -M main
git remote add origin https://github.com/Zafeer-fir/Portofolio.git
git push -u origin main
```

## 2. Hubungkan ke Netlify
Netlify > Add new project > Import an existing project > GitHub > pilih repo.
Kosongkan build command. Publish directory sudah diatur `public` oleh netlify.toml. Klik Deploy.

## 3. Aktifkan login admin (hanya kamu)
1. GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
   - Homepage URL: `https://NAMA-SITUS.netlify.app`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Salin Client ID, lalu buat Client secret.
3. Netlify > Project configuration > Access & security > OAuth > Authentication providers > Install provider > GitHub, tempel Client ID dan secret.
4. `public/admin/config.yml` sudah berisi `repo: Zafeer-fir/Portofolio`.
5. Buka `https://NAMA-SITUS.netlify.app/admin/` > Login with GitHub.

Hanya akun GitHub yang punya akses tulis ke repo yang bisa menyimpan perubahan. Jangan tambahkan kolaborator lain jika ingin hanya kamu.

## 4. Formulir kontak
Dikirim lewat Netlify Forms (tanpa PHP). Atur email notifikasi di Netlify > Forms > Form notifications.

## Catatan
- Menu admin: Konten > Proyek / Pengalaman. Item baru masuk di urutan teratas. Dua proyek dan tiga pengalaman teratas tampil di halaman utama.
- Membuka `index.html` langsung dari komputer tidak menampilkan proyek dan pengalaman (browser memblokir pembacaan JSON). Gunakan `npx serve public` atau lihat lewat Netlify.
