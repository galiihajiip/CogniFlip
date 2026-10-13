# Adding a Language/Tool Adapter

Status (2026-10-13): **no adapters exist.** Every language is `AI_REVIEW_ONLY` and code execution is disabled (ADR-003). This guide describes what an adapter must prove before the registry (`src/server/code/capabilities.ts`) may mark a capability `available`.

## Steps
1. **Choose the tool and record its provenance.** Note the official source, exact version, license and whether redistribution in a sandbox image is allowed. Record this in the adapter's README and in `docs/20_DECISION_LOG.md`.
2. **Run it only in isolation.** Parsers and linters may run in-process only if they never execute submitted code and are proven safe. Anything that compiles or runs code must use the isolated execution contract (`docs/implementation/EXECUTION_THREAT_MODEL.md`, BLOCK 37): no network, no secrets, enforced CPU, memory, time, output and process limits.
3. **Implement the adapter interface** (`src/server/code/execution.ts`) and map tool output to the finding schema (`src/shared/api/code.ts`) with `provenance`, `tool.name`, `tool.version`, exit status and validated source ranges.
4. **Pass the conformance suite** (BLOCK 39):
   - capability declaration;
   - tool/version provenance;
   - compile vs run distinction;
   - error categories;
   - timeout and cancellation;
   - resource limits and output truncation;
   - cleanup;
   - malicious-input cases.
5. **Register the adapter** in `ADAPTERS` with the passing smoke-test record (`passedAt`, `toolVersion`). Only then set the language capability to `available` with the **same** version. `validateRegistry()` fails the build's tests otherwise.
6. **List the tested versions** in `supportedVersions`, plus every known limitation (for example "no third-party packages").
7. **Release:** commit with test evidence, then redeploy. The capability matrix (`GET /api/code/capabilities`) updates automatically; never hand-edit it.

## Never
- Mark a capability available because "it works on my machine".
- Install dependencies from user-controlled manifests without strict isolation, pinned versions, a network policy and quotas.
- Present AI output as a compiler, linter or test result.
