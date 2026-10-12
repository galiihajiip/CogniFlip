import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";

// Toolchain smoke test: the "@/" alias resolves and app TSX modules load.
// It checks the setup only, not product behavior.
describe("test setup", () => {
  it("imports the root layout through the @/ alias", () => {
    expect(metadata.title).toBe("CogniFlip");
  });
});
