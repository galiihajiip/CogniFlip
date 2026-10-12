# ADR-001 — Proposed Web Stack

- Status: proposed; verify before implementation.
- Date: 2026-10-12.

## Context
CogniFlip needs a child-friendly web UI, code editor, secure server-side AI access, persistent user data, realtime rooms, community, and judge-accessible deployment. A consistent TypeScript web stack can reduce context switching and simplify end-to-end tests.

## Proposed decision
Use Next.js App Router, React, TypeScript, Tailwind CSS, managed PostgreSQL/auth/realtime such as Supabase, and hosting such as Vercel. Keep AI and code-runner operations behind server-side adapters. Use a browser editor such as Monaco only after verifying accessibility, bundle cost, mobile behavior and license.

## Consequences
Benefits: typed contracts, one primary web codebase, managed auth/data/realtime and familiar deployment. Trade-offs: platform/runtime limits, provider-specific auth/RLS configuration, editor bundle/accessibility concerns, vendor dependence.

## Validation before acceptance
Check current stable versions, quotas/pricing, data/region terms, route/job duration, realtime authorization, deployment compatibility, editor accessibility/mobile behavior and judge access. Record the actual accepted decision in the decision log.
