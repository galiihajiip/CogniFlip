"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { z } from "zod";
import { FlipBotAvatar } from "@/app/_components/flipbot";
import { Icon } from "@/app/_components/icon";
import { Chip } from "@/app/_components/states";
import { apiFetch, failureMessage } from "@/app/_lib/api";
import { CODE_LIMITS, codeReviewResponseSchema } from "@/shared/api/code";

type Review = z.infer<typeof codeReviewResponseSchema>;
type Language = {
  id: string;
  label: string;
  supportLevel: string;
  canAnalyzeWithAi: boolean;
  limitations: string[];
};

const STARTER: Record<string, string> = {
  python:
    '# Misi: FlipBot melompat 4 kali\nlompatan = 0\nfor i in range(4):\n    print("Lompat ke-", i + 1)\n    lompatan = lompatan + 1\nprint("Total lompatan:", lompatan)\n',
  javascript:
    '// Misi: FlipBot melompat 4 kali\nlet lompatan = 0;\nfor (let i = 0; i < 4; i++) {\n  console.log("Lompat ke-", i + 1);\n  lompatan++;\n}\nconsole.log("Total lompatan:", lompatan);\n',
};

const SEVERITY = {
  info: { label: "Info", tone: "bg-surface-container text-on-surface-variant" },
  low: { label: "Ringan", tone: "bg-tertiary-fixed text-on-tertiary-fixed" },
  medium: {
    label: "Sedang",
    tone: "bg-secondary-fixed text-on-secondary-fixed",
  },
  high: {
    label: "Penting",
    tone: "bg-error-container text-on-error-container",
  },
  critical: { label: "Sangat penting", tone: "bg-error text-on-error" },
} as const;

const DIMENSION = {
  correctness: "Kebenaran",
  readability: "Mudah dibaca",
  maintainability: "Mudah dirawat",
  performance: "Kecepatan",
  security: "Keamanan",
} as const;

/**
 * Mini IDE: the editor and console from ST-10, wired to AI code review.
 * "Jalankan" stays disabled because no isolated runner exists (ADR-003).
 */
export function MiniIde({ languages }: { languages: Language[] }) {
  const usable = languages.filter((l) => l.canAnalyzeWithAi);
  const [lang, setLang] = useState(usable[0]?.id ?? "python");
  const [code, setCode] = useState(STARTER[lang] ?? "");
  const [goal, setGoal] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [console_, setConsole] = useState<string[]>([
    "$ mini-ide siap.",
    "Menjalankan kode belum tersedia di CogniFlip.",
    "Tekan “Minta Saran FlipBot” untuk tinjauan AI.",
  ]);
  const gutterRef = useRef<HTMLDivElement>(null);
  const editorId = useId();
  const language = languages.find((l) => l.id === lang);

  const lines = code.split("\n").length;
  const bytes = useMemo(
    () => new TextEncoder().encode(code).byteLength,
    [code],
  );
  const tooBig = bytes > CODE_LIMITS.maxBytes || lines > CODE_LIMITS.maxLines;

  async function requestReview() {
    if (!code.trim() || tooBig || busy) return;
    setBusy(true);
    setError(null);
    setConsole((c) => [
      ...c,
      `$ minta-saran --bahasa ${lang}`,
      "FlipBot sedang membaca kodemu…",
    ]);
    const r = await apiFetch("/api/code/review", codeReviewResponseSchema, {
      method: "POST",
      body: {
        language: lang,
        code,
        ...(goal.trim() ? { goal: goal.trim() } : {}),
      },
    });
    setBusy(false);
    if (!r.ok) {
      setError(failureMessage(r));
      setConsole((c) => [...c, "Tinjauan gagal. Kodemu tetap aman di editor."]);
      return;
    }
    setReview(r.data);
    setConsole((c) => [
      ...c,
      `Selesai: ${r.data.findings.length} saran${r.data.mockMode ? " (mode uji)" : ""}. Kode tidak dijalankan.`,
    ]);
  }

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          <div className="flex flex-wrap gap-2">
            <span className="chip bg-secondary-container text-on-secondary-fixed">
              LAB KODE • MINI IDE
            </span>
            <Chip icon="info">Saran AI, kode tidak dijalankan</Chip>
          </div>
          <h1 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
            Tulis Kodemu, Minta Saran FlipBot
          </h1>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            Ketik atau ubah kode di editor, lalu minta FlipBot memberi saran.
            Setiap saran diberi label “saran AI” karena belum diperiksa oleh
            compiler atau dijalankan.
          </p>
        </div>
        <aside className="card flex items-start gap-4 p-5 lg:col-span-4">
          <FlipBotAvatar status="online" />
          <div>
            <p className="text-headline-sm text-on-surface">
              FlipBot Sahabatmu
            </p>
            <p className="text-body-sm text-on-surface-variant">
              “Aku bisa membaca kodemu dan memberi saran. Tapi aku belum bisa
              menjalankannya, ya!”
            </p>
          </div>
        </aside>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-7">
          <div className="overflow-hidden rounded-3xl bg-inverse-surface shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-danger" />
                <span className="h-3 w-3 rounded-full bg-secondary-container" />
                <span className="h-3 w-3 rounded-full bg-tertiary-fixed-dim" />
                <label htmlFor={`${editorId}-lang`} className="sr-only">
                  Bahasa pemrograman
                </label>
                <select
                  id={`${editorId}-lang`}
                  value={lang}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (code === (STARTER[lang] ?? ""))
                      setCode(STARTER[next] ?? "");
                    setLang(next);
                    setReview(null);
                  }}
                  className="ml-2 min-h-9 rounded-lg bg-white/10 px-2 font-mono text-label-code-sm text-inverse-on-surface"
                >
                  {usable.map((l) => (
                    <option key={l.id} value={l.id} className="text-on-surface">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-white/10 px-3 text-label-ui text-inverse-on-surface hover:bg-white/20"
                onClick={() => {
                  setCode(STARTER[lang] ?? "");
                  setReview(null);
                }}
              >
                <Icon name="refresh" size={16} />
                Kembalikan Kode Awal
              </button>
            </div>
            <div className="flex max-h-[28rem] min-h-72">
              <div
                ref={gutterRef}
                aria-hidden="true"
                className="w-12 shrink-0 select-none overflow-hidden py-4 pr-2 text-right font-mono text-label-code-lg leading-7 text-outline"
              >
                {Array.from({ length: lines }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <label htmlFor={editorId} className="sr-only">
                Editor kode
              </label>
              <textarea
                id={editorId}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={(e) => {
                  if (gutterRef.current)
                    gutterRef.current.scrollTop = e.currentTarget.scrollTop;
                }}
                onKeyDown={(e) => {
                  // Tab inserts spaces; Escape then Tab leaves the editor (keyboard users).
                  if (
                    e.key === "Tab" &&
                    !e.shiftKey &&
                    !e.currentTarget.dataset.escape
                  ) {
                    e.preventDefault();
                    const el = e.currentTarget;
                    const { selectionStart: s, selectionEnd: end } = el;
                    const nextCode = `${code.slice(0, s)}    ${code.slice(end)}`;
                    setCode(nextCode);
                    requestAnimationFrame(() =>
                      el.setSelectionRange(s + 4, s + 4),
                    );
                  }
                  if (e.key === "Escape") e.currentTarget.dataset.escape = "1";
                  else if (e.key !== "Tab")
                    delete e.currentTarget.dataset.escape;
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-describedby={`${editorId}-help`}
                className="flex-1 resize-none overflow-auto whitespace-pre bg-transparent py-4 pr-4 font-mono text-label-code-lg leading-7 text-inverse-on-surface outline-none focus-visible:outline-none"
              />
            </div>
            <div className="border-t border-white/10 bg-console px-4 py-3">
              <p className="mb-1 flex items-center justify-between font-mono text-label-code-sm text-surface-container-high">
                <span className="flex items-center gap-2">
                  <Icon name="terminal" size={16} /> OUTPUT MINI-IDE
                </span>
                <span>
                  {lines} baris • {bytes} byte
                </span>
              </p>
              <div
                role="log"
                aria-live="polite"
                className="max-h-32 overflow-auto font-mono text-label-code-sm leading-6 text-console-text"
              >
                {console_.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            </div>
          </div>
          <p
            id={`${editorId}-help`}
            className="text-body-sm text-on-surface-variant"
          >
            Tab menyisipkan 4 spasi. Tekan Esc lalu Tab untuk keluar dari
            editor. Batas: {CODE_LIMITS.maxLines} baris,{" "}
            {CODE_LIMITS.maxBytes / 1024} KB.
          </p>
          {tooBig ? (
            <p
              role="alert"
              className="rounded-xl bg-error-container p-3 text-body-sm text-on-error-container"
            >
              Kodenya terlalu panjang untuk ditinjau. Pendekkan dulu, ya.
            </p>
          ) : null}

          <details className="card p-5">
            <summary className="cursor-pointer text-body-md font-semibold text-on-surface">
              Pengaturan lanjutan (opsional)
            </summary>
            <label
              htmlFor={`${editorId}-goal`}
              className="mt-4 block text-body-sm font-semibold text-on-surface"
            >
              Apa tujuan kodemu?
            </label>
            <input
              id={`${editorId}-goal`}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              maxLength={300}
              className="field mt-2 text-body-md"
              placeholder="Contoh: mencetak angka 1 sampai 5"
            />
          </details>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="btn-primary flex-1"
              onClick={requestReview}
              disabled={busy || tooBig || !code.trim()}
            >
              <Icon name={busy ? "hourglass_top" : "auto_awesome"} />
              {busy ? "FlipBot membaca…" : "Minta Saran FlipBot"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled
              aria-describedby={`${editorId}-run`}
            >
              <Icon name="play_arrow" />
              Jalankan
            </button>
          </div>
          <p
            id={`${editorId}-run`}
            className="flex items-start gap-2 text-body-sm text-on-surface-variant"
          >
            <Icon name="lock" size={18} />
            Menjalankan kode belum tersedia: CogniFlip belum punya ruang aman
            (sandbox) yang sudah diuji untuk menjalankan kode anak.
          </p>
        </section>

        <section className="space-y-6 lg:col-span-5" aria-live="polite">
          {error ? (
            <div
              role="alert"
              className="card flex items-start gap-3 border-error-container p-5"
            >
              <Icon name="cloud_off" className="text-error" />
              <p className="text-body-md text-on-surface">{error}</p>
            </div>
          ) : null}
          {!review && !error ? (
            <div className="card space-y-3 p-6">
              <h2 className="flex items-center gap-2 text-headline-sm text-on-surface">
                <Icon name="checklist" className="text-primary" />
                Saran FlipBot
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Belum ada saran. Tulis kodemu lalu tekan “Minta Saran FlipBot”.
              </p>
            </div>
          ) : null}
          {review ? <ReviewPanel review={review} /> : null}
          {language ? (
            <div className="rounded-3xl bg-surface-container-low p-6">
              <h2 className="text-headline-sm text-on-surface">
                Yang bisa dilakukan untuk {language.label}
              </h2>
              <ul className="mt-2 space-y-1.5 text-body-sm text-on-surface">
                {language.limitations.map((l) => (
                  <li key={l} className="flex gap-2">
                    <Icon name="info" size={18} className="text-primary" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function ReviewPanel({ review }: { review: Review }) {
  return (
    <>
      <div className="card space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-headline-sm text-on-surface">
            <Icon name="checklist" className="text-primary" />
            Saran FlipBot
          </h2>
          <span className="chip bg-surface-container text-on-surface-variant">
            {review.findings.length} saran
          </span>
        </div>
        {review.mockMode ? (
          <Chip tone="error" icon="warning">
            Mode uji: contoh saran, bukan AI sungguhan
          </Chip>
        ) : null}
        {review.findings.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            FlipBot tidak menemukan saran untuk kode ini. Itu bukan jaminan
            kodenya benar.
          </p>
        ) : (
          <ol className="space-y-3">
            {review.findings.map((f) => (
              <li
                key={f.id}
                className="space-y-2 rounded-2xl bg-surface-container-low p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip ${SEVERITY[f.severity].tone}`}>
                    {SEVERITY[f.severity].label}
                  </span>
                  {f.range ? (
                    <span className="chip bg-surface-container-lowest font-mono font-normal text-on-surface-variant">
                      Baris {f.range.startLine}
                      {f.range.endLine !== f.range.startLine
                        ? `–${f.range.endLine}`
                        : ""}
                    </span>
                  ) : null}
                  <span className="chip bg-surface-container-lowest text-on-surface-variant">
                    {f.verification === "confirmed_diagnostic"
                      ? `Dari alat: ${f.tool?.name ?? ""}`
                      : "Saran AI"}
                  </span>
                </div>
                <h3 className="text-body-md font-semibold text-on-surface">
                  {f.title}
                </h3>
                <p className="text-body-sm text-on-surface">{f.explanation}</p>
                {f.evidence ? (
                  <pre className="overflow-x-auto rounded-lg bg-inverse-surface p-2 font-mono text-label-code-sm text-inverse-on-surface">
                    {f.evidence}
                  </pre>
                ) : null}
                <p className="text-body-sm text-on-surface-variant">
                  <strong className="text-on-surface">Coba:</strong>{" "}
                  {f.remediation}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="card space-y-3 p-6">
        <h2 className="text-headline-sm text-on-surface">
          Perkiraan Kualitas Kode
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Ini nilai kualitas kode dari saran di atas, terpisah dari nilai
          pemahamanmu.
        </p>
        <ul className="space-y-2">
          {review.quality.dimensions.map((d) => (
            <li key={d.dimension} className="space-y-1">
              <div className="flex justify-between text-body-sm text-on-surface">
                <span>{DIMENSION[d.dimension]}</span>
                <span className="font-mono">{d.score}/100</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-surface-container-highest"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-primary-container"
                  style={{ width: `${d.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="text-body-sm text-on-surface-variant">
          {review.quality.basis}
        </p>
      </div>
    </>
  );
}
