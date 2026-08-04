import { readJson, sendJson, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { verifyMarketingSession } from "../_lib/marketingAuth.js";

const allowedStatuses = ["novo", "em_atendimento", "orcamento_enviado", "aguardando_cliente", "convertido", "perdido"] as const;
type LeadStatus = typeof allowedStatuses[number];
const asText = (value: unknown, maximum = 320) => typeof value === "string" ? value.trim().slice(0, maximum) : "";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!verifyMarketingSession(request)) return sendJson(response, 401, { error: "unauthorized" }, { "Cache-Control": "no-store" });
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) return sendJson(response, 503, { error: "marketing_not_configured" }, { "Cache-Control": "no-store" });
  const headers = { "Content-Type": "application/json", apikey: supabaseServiceRoleKey, Authorization: `Bearer ${supabaseServiceRoleKey}` };

  if (request.method === "GET") {
    const storage = await fetch(`${supabaseUrl}/rest/v1/marketing_leads?select=id,created_at,modality,status,campaign_source,campaign_name,campaign_content,qualification,outcome_note&order=created_at.desc&limit=100`, { headers });
    if (!storage.ok) return sendJson(response, 502, { error: "storage_failed" }, { "Cache-Control": "no-store" });
    return sendJson(response, 200, { leads: await storage.json() }, { "Cache-Control": "no-store" });
  }
  if (request.method !== "PATCH") return sendJson(response, 405, { error: "method_not_allowed" });
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const id = asText(body.id, 64);
    const status = asText(body.status, 40) as LeadStatus;
    if (!id || !allowedStatuses.includes(status)) return sendJson(response, 422, { error: "invalid_lead_update" });
    const storage = await fetch(`${supabaseUrl}/rest/v1/marketing_leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({ status, outcome_note: asText(body.outcome_note, 600), updated_at: new Date().toISOString() }),
    });
    if (!storage.ok) return sendJson(response, 502, { error: "storage_failed" }, { "Cache-Control": "no-store" });
    return sendJson(response, 200, { lead: (await storage.json())[0] ?? null }, { "Cache-Control": "no-store" });
  } catch {
    return sendJson(response, 400, { error: "invalid_request" });
  }
}
