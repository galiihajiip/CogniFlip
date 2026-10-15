# CogniFlip

**Flip the Way You Learn.** Platform belajar coding untuk anak SD (kelas 4–6) dengan pendekatan *reverse tutoring*: anak tidak hanya menerima jawaban dari AI, tetapi **mengajari robot FlipBot**, menebak hasil kode sebelum melihatnya, lalu memperbaiki program yang salah.

> M-ONE Telkomsel Coding Competition 2026 · Kategori Umum · Subtema *Web Education for Kids*
> Developed by **Galih Aji Pangestu**

| | |
|---|---|
| **Demo** | `https://<domain-dokploy>` *(diisi setelah deploy)* |
| **Akun demo** | nama pengguna `demo` · kata sandi `FlipBot-Juara-2026` (ada tombol *Isi Otomatis* di halaman Masuk) |
| **Bahasa antarmuka** | Indonesia |

---

## Fitur

| Fitur | Yang bisa dilakukan |
|---|---|
| **Ajari FlipBot** | Anak menjelaskan konsep dengan kata-katanya sendiri. AI menilai setiap kriteria rubrik (tepat / sebagian / belum terlihat), lalu **skor dihitung oleh aturan tetap**, bukan ditebak AI. FlipBot bertanya balik jika penjelasan kurang jelas, memberi petunjuk sebelum jawaban, dan anak boleh merevisi. |
| **52 pelajaran, 8 jalur** | Dasar Berpikir Komputasi, Python, JavaScript, HTML, CSS, SQL, Java, C++ — dari dasar sampai lanjutan (urutan topik mengacu tutorial W3Schools; teks ditulis ulang untuk anak). Setiap contoh kode **sudah dijalankan dan dicocokkan** oleh tes otomatis. |
| **Misi Prediksi & Debug** | Tebak output program sebelum melihat jawabannya; bantu robot menemukan bug dengan petunjuk bertahap. |
| **Mini IDE** | Menjalankan **Python, JavaScript, SQL, HTML, dan CSS langsung di browser** (tanpa server, tanpa akses internet) dan **saran kode AI untuk 31+ bahasa**. Bahasa yang belum bisa dijalankan dengan aman diberi keterangan jujur. |
| **Akun & progres** | Akun nama samaran tanpa email, riwayat belajar, XP, lencana, papan peringkat opsional, unduh & hapus data. |
| **Ruang aman anak** | Data minimum, tanpa iklan/pelacak, preferensi aksesibilitas (kurangi animasi, teks besar). |

## Cara kerja AI yang bertanggung jawab

- AI hanya memberi **rating per kriteria** dengan bukti; **skor akhir dihitung deterministik** di server (`src/server/assessment/scoring.ts`).
- Semua keluaran AI **divalidasi skema** (zod) sebelum dipakai. Jika AI gagal atau keluarannya tidak valid, **tidak ada nilai palsu** — jawaban anak tetap tersimpan dan bisa dikirim ulang.
- Google Gemini dengan **model cadangan otomatis** saat model utama sibuk, batas waktu, dan batas panggilan per sesi.
- Kode anak **tidak pernah dijalankan di server**. Runner berjalan di Web Worker/iframe terisolasi dengan CSP yang memblokir jaringan (bukti di `docs/implementation/EXECUTION_THREAT_MODEL.md`).

## Teknologi

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL 18 · zod · Google Gemini (`@google/genai`) · Pyodide (Python WebAssembly) · sql.js (SQLite WebAssembly) · Vitest · Docker. Desain antarmuka dari **Google Stitch** ("Warm Learning Lab").

## Menjalankan secara lokal

Butuh Node 24 dan Docker.

```bash
npm ci
npm run db:up                    # PostgreSQL lokal (compose.yaml)
cp .env.example .env.local       # isi DATABASE_URL; AI_MOCK_MODE=true untuk AI uji tanpa key
npm run db:migrate
npm run dev                      # http://localhost:3000
```

Dengan key Gemini, isi `LLM_PROVIDER=gemini`, `LLM_API_KEY`, `LLM_MODEL`, dan opsional `LLM_FALLBACK_MODELS` di `.env.local`.

## Pengujian

```bash
npm run check              # format, lint, typecheck, 462 unit test, build produksi
npm run test:integration   # 38 test dengan PostgreSQL sungguhan (butuh TEST_DATABASE_URL)
npm run smoke -- <url>     # 12 pemeriksaan pada aplikasi yang sudah berjalan
```

## Deploy

Image Docker (`Dockerfile`) menjalankan migrasi database lalu `next start` di port 3000. Panduan Dokploy + PostgreSQL langkah demi langkah: [`docs/implementation/DEPLOYMENT.md`](docs/implementation/DEPLOYMENT.md).

## Struktur repositori

```
src/app/          halaman, komponen UI, API routes (Next.js)
src/server/       logika domain: penilaian, sesi tutor, AI gateway, akun, XP, misi, kurikulum
src/shared/       kontrak API (zod) yang dipakai server dan browser
public/runner*/   worker terisolasi untuk menjalankan kode di browser
db/migrations/    skema PostgreSQL
tests/            unit & integration test
docs/             dokumen produk, arsitektur, keamanan, keputusan, dan bukti proses
.stitch/          desain Google Stitch yang disetujui (DESIGN.md + 58 tangkapan layar)
```

## Dokumentasi & bukti proses (Vibe Coding)

- **Aturan AI Agent:** [`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md)
- **Peta dokumen:** [`docs/00_DOCUMENT_MAP.md`](docs/00_DOCUMENT_MAP.md) — kebutuhan produk, arsitektur, API, AI, keamanan anak, strategi tes
- **Keputusan (D-001…D-017):** [`docs/20_DECISION_LOG.md`](docs/20_DECISION_LOG.md) dan [`docs/decisions/`](docs/decisions/)
- **Desain:** [`docs/22_STITCH_DESIGN_HANDOFF.md`](docs/22_STITCH_DESIGN_HANDOFF.md) — pemetaan layar Stitch ke rute dan adaptasi jujur
- **Status & audit:** [`docs/implementation/FINAL_STATUS.md`](docs/implementation/FINAL_STATUS.md), [`SECURITY_AUDIT.md`](docs/implementation/SECURITY_AUDIT.md)
- **Jurnal prompt & raw log:** [`docs/vibe-coding/`](docs/vibe-coding/)

## Batasan yang diketahui

- Materi pelajaran disusun dengan bantuan AI dan belum ditinjau guru.
- Java, C++, Go, Rust, dll. belum bisa dijalankan (hanya saran AI) karena belum ada sandbox server yang teruji.
- Belum ada pemulihan kata sandi (akun tanpa email); fitur suara, komunitas, dan multiplayer belum tersedia.
- Ketentuan Gemini API membatasi pengguna di bawah 18 tahun; risiko ini tercatat di D-008.

## Lisensi pihak ketiga

Pyodide (MPL-2.0), sql.js (MIT), Plus Jakarta Sans & JetBrains Mono (OFL-1.1), Material Symbols (Apache-2.0), video hero dari Mixkit (Mixkit Stock Video Free License, `public/media/LICENSES.md`).

© 2026 CogniFlip · Developed by Galih Aji Pangestu
