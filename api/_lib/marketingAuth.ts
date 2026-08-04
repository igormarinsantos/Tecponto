import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "tecponto_marketing_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const sign = (value: string, secret: string) => createHmac("sha256", secret).update(value).digest("base64url");

const cookieValue = (request: { headers: { cookie?: string | string[] | undefined } }, name: string) => (Array.isArray(request.headers.cookie) ? request.headers.cookie.join(";") : request.headers.cookie)
  ?.split(";")
  .map((item) => item.trim())
  .find((item) => item.startsWith(`${name}=`))
  ?.slice(name.length + 1) ?? "";

export const verifyMarketingSession = (request: { headers: { cookie?: string | string[] | undefined } }) => {
  const secret = process.env.MARKETING_SESSION_SECRET;
  const token = cookieValue(request, COOKIE_NAME);
  if (!secret || !token) return false;

  const [issuedAt, nonce, signature] = token.split(".");
  if (!issuedAt || !nonce || !signature || Date.now() - Number(issuedAt) > SESSION_TTL_SECONDS * 1000) return false;

  const expected = sign(`${issuedAt}.${nonce}`, secret);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

export const createMarketingSessionHeader = () => {
  const secret = process.env.MARKETING_SESSION_SECRET;
  if (!secret) return null;

  const issuedAt = Date.now().toString();
  const nonce = randomUUID();
  const value = `${issuedAt}.${nonce}.${sign(`${issuedAt}.${nonce}`, secret)}`;
  return `${COOKIE_NAME}=${value}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`;
};

export const isValidMarketingPassword = (password: string) => {
  const expected = process.env.MARKETING_ADMIN_PASSWORD;
  if (!expected || password.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
};
