import "server-only";
import { getRubric } from "@/server/assessment/content";
import { evaluateExplanation } from "@/server/ai/gateway";
import { getGatewayDeps } from "@/server/ai";
import {
  getServerEnv,
  isIntegrationConfigured,
  type ServerEnv,
} from "@/server/config/env";
import { getCurrentUser } from "@/server/auth";
import { getPool } from "@/server/db/client";
import { existingGuestHash, guestIdentity, hashKey } from "@/server/http/guest";
import { PostgresSessionStore } from "@/server/learning/session/pg-store";
import { AppError } from "@/server/http/errors";
import { getLessonCatalog } from "@/server/learning/content";
import { LESSONS } from "@/server/learning/content/lessons";
import type { LessonVersion } from "@/server/learning/lesson-schema";
import { TutorSessionEngine } from "@/server/learning/session/engine";
import {
  InMemorySessionStore,
  type SessionStore,
} from "@/server/learning/session/store";
import type { TutorSession } from "@/server/learning/session/types";

/**
 * Application service for lessons and tutor sessions (used by route
 * handlers). Content access: published lessons only, plus unreviewed drafts
 * when ALLOW_DRAFT_CONTENT=true outside production.
 */

const allowDrafts = (env: ServerEnv) =>
  env.ALLOW_DRAFT_CONTENT === "true" && env.NODE_ENV !== "production";

/** Lessons a learner may open, in learning-path order when a path exists. */
export function listLearnerLessons(env: ServerEnv): LessonVersion[] {
  const catalog = getLessonCatalog();
  const published = catalog.publishedLessons();
  if (!allowDrafts(env)) return published;
  const ids = new Set(published.map((l) => l.id));
  const drafts = LESSONS.filter((l) => l.status === "draft" && !ids.has(l.id))
    .map((l) => catalog.getVersion(l.id, l.version)!)
    .filter(Boolean);
  return [...published, ...drafts];
}

export function getLearnerLesson(env: ServerEnv, id: string): LessonVersion {
  const lesson = listLearnerLessons(env).find((l) => l.id === id);
  if (!lesson) throw new AppError("NOT_FOUND", "lesson not available");
  return lesson;
}

const globalForTutor = globalThis as typeof globalThis & {
  cogniflipTutor?: {
    key: string;
    engine: TutorSessionEngine;
    store: SessionStore;
  };
};

/**
 * Tutor engine bound to the configured AI gateway. Sessions are stored in
 * PostgreSQL when the database is configured; otherwise in process memory
 * (lost on restart, not shared between serverless instances).
 */
export function getTutor(env: ServerEnv) {
  const persistent = isIntegrationConfigured(env, "database");
  const key = `${env.AI_MAX_CALLS_PER_SESSION}|${persistent}`;
  if (globalForTutor.cogniflipTutor?.key !== key) {
    const store: SessionStore = persistent
      ? new PostgresSessionStore(getPool())
      : new InMemorySessionStore();
    const catalog = getLessonCatalog();
    const engine = new TutorSessionEngine({
      store,
      // Read configuration at call time, not when the engine was created.
      evaluate: (input) =>
        evaluateExplanation(getGatewayDeps(getServerEnv()), input),
      resolve: (session) => {
        const lesson = catalog.getVersion(
          session.lesson.id,
          session.lesson.version,
        );
        const rubric = getRubric(session.rubric.id, session.rubric.version);
        if (
          !lesson ||
          !rubric ||
          catalog.contentHash(lesson) !== session.lesson.contentHash
        )
          return undefined;
        return { lesson, rubric };
      },
      maxAiCalls: env.AI_MAX_CALLS_PER_SESSION,
    });
    globalForTutor.cogniflipTutor = { key, engine, store };
  }
  return globalForTutor.cogniflipTutor;
}

/** Loads a session only for its owner; anyone else gets NOT_FOUND. */
export async function getOwnedSession(
  env: ServerEnv,
  id: string,
  ownerKeyHash: string | undefined,
): Promise<TutorSession> {
  const session = ownerKeyHash ? await getTutor(env).store.get(id) : undefined;
  if (!session || session.ownerKeyHash !== ownerKeyHash)
    throw new AppError("NOT_FOUND", "session not found");
  return session;
}

/** Owner key for a signed-in user; distinct from any guest key. */
export const userOwnerHash = (userId: string) => hashKey(`user:${userId}`);

/** Who is creating a session: the signed-in user, or a (new) guest. */
export async function requesterForCreate(request: Request, env: ServerEnv) {
  const user = await getCurrentUser(request, env);
  if (user) return { keyHash: userOwnerHash(user.id), userId: user.id };
  const guest = guestIdentity(request, env);
  return { keyHash: guest.keyHash, setCookie: guest.setCookie };
}

/** Owner key for reads/writes; never creates a new identity. */
export async function requesterOwnerHash(request: Request, env: ServerEnv) {
  const user = await getCurrentUser(request, env);
  return user ? userOwnerHash(user.id) : existingGuestHash(request);
}
