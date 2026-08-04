import { readJson, sendJson, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { createMarketingSessionHeader, isValidMarketingPassword } from "../_lib/marketingAuth.js";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") return sendJson(response, 405, { error: "method_not_allowed" });

  try {
    const { password } = await readJson<{ password?: unknown }>(request);
    if (typeof password !== "string" || !isValidMarketingPassword(password)) {
      return sendJson(response, 401, { error: "invalid_credentials" });
    }

    const session = createMarketingSessionHeader();
    if (!session) return sendJson(response, 503, { error: "marketing_not_configured" });
    return sendJson(response, 200, { ok: true }, { "Set-Cookie": session, "Cache-Control": "no-store" });
  } catch {
    return sendJson(response, 400, { error: "invalid_request" });
  }
}
