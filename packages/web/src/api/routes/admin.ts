import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { checkCredentials, issueToken, verifyToken, throttle, clearThrottle } from "../lib/admin-auth";

/** Procédure réservée à l'administrateur (jeton signé dans l'en-tête Authorization). */
export const adminOnly = base.use(async ({ context, next }) => {
  if (!verifyToken(context.headers.get("authorization"))) {
    throw new ORPCError("UNAUTHORIZED", { message: "Accès administrateur requis" });
  }
  return next();
});

export const admin = {
  login: base
    .input(z.object({ phone: z.string().min(1).max(30), code: z.string().min(1).max(100) }))
    .handler(({ input, context }) => {
      const ip = context.headers.get("x-forwarded-for") ?? "local";
      throttle(ip);
      if (!checkCredentials(input.phone, input.code)) {
        throw new ORPCError("UNAUTHORIZED", { message: "Numéro ou code incorrect" });
      }
      clearThrottle(ip);
      return { token: issueToken() };
    }),
  check: base.handler(({ context }) => ({
    ok: verifyToken(context.headers.get("authorization")),
  })),
};
