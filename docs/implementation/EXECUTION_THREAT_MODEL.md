# Code Execution: Threat Model and Enablement Gate (BLOCK 37–38)

**Decision (ADR-003): execution is DISABLED.**
- There is no isolated runner and no recorded isolation evidence.
- `POST /api/code/run` returns `422 UNSUPPORTED_TOOLCHAIN` and never executes anything.
- AI code review (`POST /api/code/review`) remains available.

## Assets to protect
Application secrets (AI key, database URL), the production database, other users' code and outputs, the host filesystem and network, service availability and cost.

## Threats (docs/11 "Unsafe code execution")
| Threat | Example | Required control |
|---|---|---|
| Secret theft | `print(os.environ)` | Runner has **no** app environment variables or credentials; separate account/project |
| Host or database access | Reading files, connecting to Postgres | Separate machine or microVM; no route to the app network; read-only base image; per-job ephemeral filesystem |
| Network abuse | Downloading malware, scanning, mining | Network **denied** by default (egress blocked) |
| Resource exhaustion | `while True: pass`, fork bombs, huge output | CPU and wall-clock kill outside the process, memory cgroup limit, process/PID limit, output cap, concurrency cap per user and global |
| Cross-job leakage | Reading another job's files | Fresh sandbox per job; no shared writable volumes; artefacts expire |
| Escape | Kernel exploit from the container | A strong isolation boundary (microVM such as Firecracker, or gVisor), patched images, no privileged mode |
| Supply chain | Malicious package from a manifest | No dependency installs (pinned allowlisted toolchains only) |
| Abuse at scale | Many free runs | Per-user/IP quotas, auth for execution, kill switch |

## Contract implemented (`src/server/code/execution.ts`)
- Job states: `queued → running → completed | failed | timed_out | cancelled`, plus `rejected`; terminal states are final.
- Default limits:
  - CPU 2 s, wall-clock 5 s;
  - memory 128 MB, output 64 KiB (UTF-8-safe truncation);
  - 5 files, 1 process;
  - **network false** (requests that enable it are rejected).
- Requests reject path traversal, absolute or hidden paths and oversize files.
- Results carry phase (compile/run), exit code, truncation flags, duration and the **adapter's** tool name and version (an adapter cannot misreport its tool).
- A timeout is its own state, never a program error.
- The service runs a language only if an adapter is registered **and** `IsolationEvidence` for that adapter is recorded. Both lists are empty.
- Verified by `tests/unit/execution.test.ts` (10 tests), which uses a clearly labelled **test double** that returns canned output and executes nothing.

## Evidence required before enabling (all must be recorded)
1. Written description of the isolation mechanism and its provider terms.
2. Tests run **against the isolated runner**, never against the app host:
   - known-good program;
   - syntax error and runtime error;
   - infinite loop (killed at the time limit);
   - fork bomb (process limit);
   - memory bomb (memory limit);
   - huge output (truncated);
   - network attempt (blocked);
   - read of environment variables (empty);
   - read of another job's files (impossible).
3. Adapter conformance suite passes (BLOCK 39); the registry entry is updated with the tested tool version (`ADAPTER_GUIDE.md`).
4. Quotas and kill switch configured; costs reviewed.

## BLOCK 38: reference runtime adapter
**Status: BLOCKED.** No isolated sandbox service is configured or verified, so no adapter was implemented. Testing payloads locally or on the app host is forbidden. To unblock:
- choose and provision a runner (for example a microVM- or gVisor-based managed sandbox) with its own credentials;
- record the decision in `docs/20`;
- then implement one Python adapter and run the evidence list above.
