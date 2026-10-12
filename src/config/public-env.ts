import { z } from "zod";

/**
 * Browser-safe configuration. Only `NEXT_PUBLIC_*` values belong here; they are
 * inlined into the client bundle at build time, so each one must be referenced
 * literally (`process.env.NEXT_PUBLIC_X`) and must never be a secret.
 */

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({ protocol: /^https?$/ }).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

export type PublicEnv = z.infer<typeof schema>;

export const PUBLIC_VARIABLES = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const blankToUndefined = (value: string | undefined) =>
  value?.trim() || undefined;

/** Invalid public values are treated as unset; the server module reports them. */
export function getPublicEnv(): PublicEnv {
  const result = schema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: blankToUndefined(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: blankToUndefined(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  });
  return result.success ? result.data : {};
}
