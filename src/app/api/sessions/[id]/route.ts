import { getServerEnv } from "@/server/config/env";
import { existingGuestHash } from "@/server/http/guest";
import { parseInput } from "@/server/http/request";
import { contractResponse, withErrorHandling } from "@/server/http/respond";
import { resolveSessionContent } from "@/server/learning/session-content";
import { getOwnedSession } from "@/server/learning/service";
import { toLearnerView } from "@/server/learning/session/view";
import { sessionResponseSchema } from "@/shared/api/learning";
import { sessionIdSchema } from "@/shared/schemas/primitives";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/sessions/:id: the owner's learner view; others get NOT_FOUND. */
export const GET = withErrorHandling<Ctx>(
  async (request, correlationId, { params }) => {
    const env = getServerEnv();
    const id = parseInput(sessionIdSchema, (await params).id);
    const session = await getOwnedSession(env, id, existingGuestHash(request));
    const { lesson, rubric } = resolveSessionContent(session);
    return contractResponse(
      sessionResponseSchema,
      { session: toLearnerView(session, lesson, rubric), correlationId },
      correlationId,
    );
  },
);
