import { createMarketingSessionHeader, isValidMarketingPassword } from "../_lib/marketingAuth.js";

const json = (body: unknown, init: ResponseInit = {}) => new Response(JSON.stringify(body), {
  ...init,
  headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
});

export default async function handler(request: Request) {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });

  try {
    const { password } = await request.json() as { password?: unknown };
    if (typeof password !== "string" || !isValidMarketingPassword(password)) {
      return json({ error: "invalid_credentials" }, { status: 401 });
    }

    const session = createMarketingSessionHeader();
    if (!session) return json({ error: "marketing_not_configured" }, { status: 503 });
    return json({ ok: true }, { headers: { "Set-Cookie": session } });
  } catch {
    return json({ error: "invalid_request" }, { status: 400 });
  }
}
