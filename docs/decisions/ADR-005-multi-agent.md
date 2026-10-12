# ADR-005 — Bounded Multi-Agent Orchestration

- Status: design constraint accepted; exact provider/model pending.
- Date: 2026-10-12.

## Context
Product scope calls for agents for tutoring, assessment, misconception diagnosis, code review, feedback, and safety. Unbounded agent chaining adds cost, latency and contradictions.

## Decision
Use a central orchestrator and distinct agent contracts. Enforce tool allowlists, structured schemas, maximum steps/calls, time/cost budgets, cancellation and terminal states. Scoring, authorization, persistence and rewards remain deterministic application services.

## Consequences
Agents are used only where their separate responsibility adds value. Failures have explicit status. Provider swap remains possible behind an adapter.
