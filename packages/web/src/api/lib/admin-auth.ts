import { createHmac, timingSafeEqual } from "node:crypto";
import { ORPCError } from "@orpc/server";

const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours

const secret = () => process.env.BETTER_AUTH_SECRET || "ainagara-dev-secret";
export const adminPhone = () => process.env.ADMIN_PHONE || "0385623528";
export const adminCode = () => process.env.ADMIN_CODE || "heriniana";

export const normalizePhone = (p: string) => {
  const d = p.replace(/[^\d]/g, "");
  if (d.startsWith("261")) return "0" + d.slice(3);
  return d;
};

const sign = (payload: string) =>
  createHmac("sha256", secret()).update(payload).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
};

export function checkCredentials(phone: string, code: string) {
  return (
    safeEqual(normalizePhone(phone), normalizePhone(adminPhone())) &&
    safeEqual(code.trim(), adminCode())
  );
}

export function issueToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(header: string | null | undefined) {
  if (!header) return false;
  const token = header.replace(/^Bearer\s+/i, "");
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

// Limiteur simple contre les essais répétés
const attempts = new Map<string, { n: number; t: number }>();
export function throttle(key: string) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || now - a.t > 10 * 60_000) {
    attempts.set(key, { n: 1, t: now });
    return;
  }
  a.n++;
  if (a.n > 8) throw new ORPCError("TOO_MANY_REQUESTS", { message: "Trop d'essais. Réessayez dans quelques minutes." });
}
export const clearThrottle = (key: string) => attempts.delete(key);
