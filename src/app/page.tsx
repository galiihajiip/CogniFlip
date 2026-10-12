import { getServerEnv } from "@/server/config/env";
import { getIntegrationStatus } from "@/server/integrations/status";

// Read configuration at request time, not at build time.
export const dynamic = "force-dynamic";

// Scaffold entry point only. Product screens follow the approved Stitch design
// (docs/22_STITCH_DESIGN_HANDOFF.md); this page is not that design.
export default function Home() {
  const ai = getIntegrationStatus(getServerEnv(), "ai");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-2xl font-bold">CogniFlip</h1>
      <p>Flip the Way You Learn.</p>
      <p className="text-sm">Aplikasi sedang dibangun.</p>
      <p className="text-sm" data-testid="ai-status">
        Teman AI: {ai.available ? "tersedia" : "belum tersedia"}
      </p>
    </main>
  );
}
