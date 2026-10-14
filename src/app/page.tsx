import Link from "next/link";
import { Icon } from "@/app/_components/icon";
import { HeroPredict } from "@/app/_components/landing/hero-predict";
import { getServerEnv } from "@/server/config/env";
import { getIntegrationStatus } from "@/server/integrations/status";

// Read configuration at request time, not at build time.
export const dynamic = "force-dynamic";

// Stitch "Beranda (Landing Page)". Claims are limited to what the product
// actually does (docs/22 §Adaptations): no user counts, no code runner.
const STEPS = [
  {
    n: "01",
    icon: "record_voice_over",
    tone: "bg-primary-fixed text-on-primary-fixed",
    title: "1. Jelaskan",
    body: "Ungkapkan ide logika dengan kata-katamu sendiri kepada FlipBot. Saat kamu bisa mengajar, kamu sedang memahami.",
    tag: "Ajari Robot",
    tagIcon: "psychology",
  },
  {
    n: "02",
    icon: "visibility",
    tone: "bg-secondary-fixed text-on-secondary-fixed",
    title: "2. Prediksi",
    body: "Baca kodenya di kepala dulu. Tebak apa yang akan tercetak sebelum melihat jawabannya.",
    tag: "Tebak Dulu",
    tagIcon: "quiz",
  },
  {
    n: "03",
    icon: "task_alt",
    tone: "bg-tertiary-fixed text-on-tertiary-fixed",
    title: "3. Cocokkan",
    body: "Bandingkan tebakanmu dengan hasil yang sudah dicek memakai Python sungguhan saat soal dibuat.",
    tag: "Kunci Terperiksa",
    tagIcon: "verified_user",
  },
  {
    n: "04",
    icon: "bug_report",
    tone: "bg-error-container text-on-error-container",
    title: "4. Perbaiki",
    body: "Temukan bug tanpa panik. FlipBot memberi petunjuk dulu, bukan langsung membocorkan jawaban.",
    tag: "Misi Debug",
    tagIcon: "build",
  },
] as const;

const FEATURES = [
  {
    href: "/belajar",
    icon: "smart_toy",
    tone: "bg-primary-container text-on-primary",
    kicker: "Ajari Robot",
    title: "Murid Menjadi Guru",
    body: "FlipBot berperan sebagai robot yang ingin belajar. Jelaskan konsepnya, lalu lihat bagian mana yang sudah tepat menurut rubrik yang terbuka.",
  },
  {
    href: "/misi",
    icon: "quiz",
    tone: "bg-secondary-container text-on-secondary",
    kicker: "Prediksi Dulu",
    title: "Latih Membaca Kode",
    body: "Tebak hasil sebuah program sebelum melihat jawabannya. Jawaban yang benar sudah diperiksa, bukan karangan AI.",
  },
  {
    href: "/misi",
    icon: "bug_report",
    tone: "bg-tertiary-container text-on-tertiary",
    kicker: "Misi Debug",
    title: "Belajar dari Kesalahan",
    body: "Robot punya kode yang salah. Temukan barisnya, jelaskan sebabnya, dan dapatkan petunjuk bertahap.",
  },
  {
    href: "/ide",
    icon: "terminal",
    tone: "bg-inverse-surface text-inverse-on-surface",
    kicker: "Mini IDE",
    title: "Jalankan & Minta Saran",
    body: "Tulis Python dan jalankan langsung di browsermu, tanpa server dan tanpa internet. Saran FlipBot diberi label “saran AI”.",
  },
] as const;

export default function Home() {
  const ai = getIntegrationStatus(getServerEnv(), "ai");

  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="relative w-full overflow-hidden px-4 py-12 sm:px-6 lg:px-12 lg:py-20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-secondary-fixed/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 rounded-full bg-primary-fixed/30 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="inline-flex w-fit flex-wrap items-center gap-2.5 rounded-full bg-surface-container px-4 py-1.5 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary motion-safe:animate-pulse" />
              <span className="text-label-ui uppercase text-primary">
                Flip the Way You Learn
              </span>
              <span className="text-label-ui text-on-surface-variant">•</span>
              <span className="text-label-ui text-on-surface-variant">
                Metode Reverse-Tutoring
              </span>
            </div>
            <h1 className="text-balance text-display-hero-mobile text-on-surface sm:text-display-hero">
              Jangan Cuma Dapat Jawaban. <br className="hidden sm:inline" />
              <span className="text-primary-container">Pahami Alasannya.</span>
            </h1>
            <p className="max-w-xl text-body-lg text-on-surface-variant">
              Ajari FlipBot si robot pembelajar yang penasaran, uji pemahamanmu
              dengan menebak alur kode, dan temukan cara memperbaiki program
              dengan percaya diri!
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/belajar" className="btn-primary text-headline-sm">
                <Icon name="rocket_launch" size={24} />
                Mulai Belajar Sekarang
              </Link>
              <Link
                href="/ide"
                className="btn-secondary !min-h-[52px] bg-surface-container-lowest text-headline-sm shadow-md"
              >
                <Icon name="terminal" size={22} />
                Coba Mini IDE
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2 pt-2 text-body-sm text-on-surface-variant">
              <li className="chip bg-surface-container-lowest font-semibold shadow-sm">
                <Icon name="shield" size={16} className="text-primary" />
                Tanpa email, cukup nama samaran
              </li>
              <li
                className="chip bg-surface-container-lowest font-semibold shadow-sm"
                data-testid="ai-status"
              >
                <Icon
                  name={ai.available ? "check_circle" : "cloud_off"}
                  size={16}
                  className={
                    ai.available ? "text-success" : "text-on-surface-variant"
                  }
                />
                Teman AI:{" "}
                {ai.available
                  ? ai.mode === "mock"
                    ? "mode uji"
                    : "tersedia"
                  : "belum tersedia"}
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6">
            <HeroPredict />
          </div>
        </div>
      </section>

      {/* SECTION 2: 4-STEP LOOP */}
      <section className="w-full bg-surface-container-low px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="flex max-w-2xl flex-col gap-2">
              <span className="chip w-fit bg-surface-container text-primary">
                ALUR BELAJAR COGNIFLIP
              </span>
              <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
                Metode 4 Langkah: Balikkan Cara Kamu Memahami Kode
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Bukan menghafal sintaks, tapi melatih cara berpikir: jelaskan,
                tebak, cocokkan, lalu perbaiki.
              </p>
            </div>
            <div className="flex items-center gap-2 text-headline-sm text-primary">
              <Icon name="verified_user" size={24} />
              <span>Rubrik Penilaian Terbuka</span>
            </div>
          </div>
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="card flex flex-col justify-between gap-6 p-6 transition-transform motion-safe:hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.tone}`}
                    >
                      <Icon name={step.icon} size={28} />
                    </span>
                    <span
                      aria-hidden="true"
                      className="select-none text-display-hero-mobile text-surface-container-highest"
                    >
                      {step.n}
                    </span>
                  </div>
                  <h3 className="text-headline-md text-on-surface">
                    {step.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {step.body}
                  </p>
                </div>
                <span className="flex items-center gap-2 rounded-xl bg-surface-container-high/60 px-3.5 py-2.5 text-label-ui text-primary">
                  <Icon name={step.tagIcon} size={18} />
                  {step.tag}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="max-w-2xl space-y-2">
            <span className="chip bg-secondary-fixed text-on-secondary-fixed">
              FITUR COGNIFLIP
            </span>
            <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Laboratorium Kode yang Mengembangkan Pola Pikir
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Dibuat agar anak tidak sekadar memakai teknologi, tetapi memahami
              cara kerjanya.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="card group flex gap-5 p-6 transition-transform motion-safe:hover:-translate-y-1"
              >
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${f.tone}`}
                >
                  <Icon name={f.icon} size={30} filled />
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-label-ui uppercase text-primary">
                    {f.kicker}
                  </span>
                  <span className="text-headline-sm text-on-surface">
                    {f.title}
                  </span>
                  <span className="text-body-md text-on-surface-variant">
                    {f.body}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-label-ui text-primary">
                    Buka
                    <Icon
                      name="arrow_forward"
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: RESPONSIBLE AI */}
      <section className="w-full bg-surface-container-low px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="max-w-2xl space-y-2">
            <span className="chip bg-surface-container text-primary">
              PRINSIP KEAMANAN &amp; KEJUJURAN
            </span>
            <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              AI yang Bertanggung Jawab untuk Anak
            </h2>
            <p className="text-body-md text-on-surface-variant">
              AI di CogniFlip membantu anak berpikir, bukan berpikir
              menggantikan anak.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Principle
              icon="psychology"
              title="Bukan Mesin Penjawab"
              body="FlipBot memberi pertanyaan dan petunjuk lebih dulu. Contoh jawaban baru ditampilkan setelah sesi belajar selesai."
              points={[
                "Petunjuk sebelum jawaban",
                "Kesempatan memperbaiki penjelasan",
              ]}
            />
            <Principle
              icon="shield"
              title="Privasi Anak Dijaga"
              body="Tidak perlu nama asli, email, sekolah, atau lokasi. Akun memakai nama samaran dan avatar pilihan."
              points={[
                "Tanpa iklan dan pelacak",
                "Data bisa diunduh dan dihapus",
              ]}
            />
            <Principle
              icon="verified_user"
              title="Nilai yang Bisa Dijelaskan"
              body="AI hanya menilai tiap kriteria rubrik. Angka akhirnya dihitung oleh aturan tetap, dan bila AI gagal, tidak ada nilai palsu."
              points={[
                "Rubrik terbuka per kriteria",
                "Saran kode diberi label “saran AI”",
              ]}
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl bg-primary-container px-6 py-12 text-center text-on-primary shadow-xl sm:px-12">
          <span className="chip bg-white/15 text-on-primary">MULAI GRATIS</span>
          <h2 className="text-headline-lg-mobile sm:text-headline-lg">
            Siap Mengajari FlipBot dan Memahami Program Pertamamu?
          </h2>
          <p className="max-w-2xl text-body-lg text-on-primary-container">
            Tidak perlu pengalaman coding. Mulai dari konsep paling dasar:
            urutan, perulangan, dan percabangan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/belajar"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-secondary-container px-7 font-bold text-on-secondary-fixed shadow-[0_4px_0_0_#653e00] transition-transform active:translate-y-0.5"
            >
              <Icon name="rocket_launch" />
              Jelajahi Pelajaran Pertama
            </Link>
            <Link
              href="/panduan"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-white/10 px-6 font-bold text-on-primary hover:bg-white/20"
            >
              <Icon name="family_restroom" />
              Panduan Guru &amp; Orang Tua
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Principle({
  icon,
  title,
  body,
  points,
}: {
  icon: string;
  title: string;
  body: string;
  points: string[];
}) {
  return (
    <div className="card flex flex-col gap-4 p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="text-headline-sm text-on-surface">{title}</h3>
      <p className="text-body-md text-on-surface-variant">{body}</p>
      <ul className="mt-auto space-y-2">
        {points.map((p) => (
          <li
            key={p}
            className="flex items-center gap-2 text-body-sm font-semibold text-on-surface"
          >
            <Icon
              name="check_circle"
              size={18}
              className="text-tertiary-container"
            />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
