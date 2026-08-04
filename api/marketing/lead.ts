import { readJson, sendEmpty, sendJson, type ApiRequest, type ApiResponse } from "../_lib/http.js";

const MODALITY_FIELDS: Record<string, string[]> = {
  repare: ["device", "problem", "timing"],
  troque: ["currentDevice", "condition", "desiredType"],
  compre: [],
};

const asText = (value: unknown, maximum = 180) => typeof value === "string" ? value.slice(0, maximum) : "";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") return sendJson(response, 405, { error: "method_not_allowed" });
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) return sendEmpty(response);

  try {
    const body = await readJson<Record<string, unknown>>(request);
    const modality = asText(body.modality, 20);
    const fields = MODALITY_FIELDS[modality];
    const visitorId = asText(body.visitor_id, 128);
    const sessionId = asText(body.session_id, 128);
    if (!fields || !visitorId || !sessionId) return sendJson(response, 422, { error: "invalid_lead" });

    const rawQualification = body.qualification && typeof body.qualification === "object" ? body.qualification as Record<string, unknown> : {};
    const qualification = Object.fromEntries(fields.map((field) => [field, asText(rawQualification[field], 120)]).filter(([, value]) => value));
    const storage = await fetch(`${supabaseUrl}/rest/v1/marketing_leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: supabaseServiceRoleKey, Authorization: `Bearer ${supabaseServiceRoleKey}`, Prefer: "return=minimal" },
      body: JSON.stringify({ modality, visitor_id: visitorId, session_id: sessionId, campaign_source: asText(body.campaign_source), campaign_name: asText(body.campaign_name), campaign_content: asText(body.campaign_content), qualification }),
    });
    if (!storage.ok) return sendJson(response, 502, { error: "storage_failed" });
    return sendEmpty(response);
  } catch {
    return sendJson(response, 400, { error: "invalid_request" });
  }
}
