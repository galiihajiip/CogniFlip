import type { Metadata } from "next";
import { MiniIde } from "@/app/_components/ide/mini-ide";
import { PageFrame } from "@/app/_components/states";
import { capabilityMatrix } from "@/server/code/capabilities";

export const metadata: Metadata = {
  title: "Mini IDE",
  description:
    "Tulis kode Python, jalankan di browsermu, dan minta saran dari FlipBot.",
};

/** Mini IDE (ST-10 editor layout), AI review only: execution is disabled by design. */
export default function IdePage() {
  const languages = capabilityMatrix().languages.map((l) => ({
    id: l.id,
    label: l.label,
    supportLevel: l.supportLevel,
    canAnalyzeWithAi: l.canAnalyzeWithAi,
    limitations: l.limitations,
  }));
  return (
    <PageFrame>
      <MiniIde languages={languages} />
    </PageFrame>
  );
}
