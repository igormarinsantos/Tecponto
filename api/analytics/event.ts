import { createHash } from "node:crypto";
import { readJson, requestUrl, sendEmpty, sendJson, type ApiRequest, type ApiResponse } from "../_lib/http.js";

const ALLOWED_EVENTS = new Set(["page_view", "page_scroll", "external_click", "qualification_open", "qualification_step_view", "qualification_option_select", "qualification_complete", "qualification_resume", "bio_view", "bio_action_click", "bio_qualification_open", "bio_whatsapp_start", "bio_shopee_open", "bio_instagram_open"]);
const asText = (value: unknown, maximum = 180) => typeof value === "string" ? value.slice(0, maximum) : "";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") return sendJson(response, 405, { error: "method_not_allowed" });
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) return sendEmpty(response);
  try {
    const body = await readJson<{ event?: unknown; payload?: Record<string, unknown> }>(request);
    const event = asText(body.event, 80);
    const payload = body.payload ?? {};
    if (!ALLOWED_EVENTS.has(event)) return sendJson(response, 422, { error: "invalid_event" });
    const visitorId = asText(payload.visitor_id, 128);
    const sessionId = asText(payload.session_id, 128);
    if (!visitorId || !sessionId) return sendJson(response, 422, { error: "invalid_identity" });
    const details = Object.fromEntries(Object.entries(payload).filter(([key]) => !["visitor_id", "session_id", "event_id", "consent_granted", "campaign_source", "campaign_medium", "campaign_name", "campaign_content", "campaign_term", "click_id", "landing_path", "instagram_browser"].includes(key)).map(([key, value]) => [key.slice(0, 80), typeof value === "string" ? value.slice(0, 180) : typeof value === "number" || typeof value === "boolean" ? value : null]).filter(([, value]) => value !== null));
    const storage = await fetch(`${supabaseUrl}/rest/v1/marketing_events`, { method: "POST", headers: { "Content-Type": "application/json", apikey: supabaseServiceRoleKey, Authorization: `Bearer ${supabaseServiceRoleKey}`, Prefer: "return=minimal" }, body: JSON.stringify({ event_name: event, visitor_id: visitorId, session_id: sessionId, campaign_source: asText(payload.campaign_source), campaign_medium: asText(payload.campaign_medium), campaign_name: asText(payload.campaign_name), campaign_content: asText(payload.campaign_content), campaign_term: asText(payload.campaign_term), click_id: asText(payload.click_id), landing_path: asText(payload.landing_path), instagram_browser: payload.instagram_browser === true, details }) });
    if (!storage.ok) return sendJson(response, 502, { error: "storage_failed" });
    const metaPixelId = process.env.VITE_META_PIXEL_ID;
    const metaAccessToken = process.env.META_CONVERSIONS_API_TOKEN;
    if (payload.consent_granted === true && metaPixelId && metaAccessToken) {
      const metaEventName = `Tecponto${event.replace(/(^|_)(\w)/g, (_, __, letter) => letter.toUpperCase())}`;
      const metaPayload = { data: [{ event_name: metaEventName, event_time: Math.floor(Date.now() / 1000), event_id: asText(payload.event_id, 128), event_source_url: `${requestUrl(request).origin}${asText(payload.landing_path) || "/"}`, action_source: "website", user_data: { external_id: [createHash("sha256").update(visitorId).digest("hex")], client_user_agent: request.headers["user-agent"] ?? "" }, custom_data: details }], ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}) };
      await fetch(`https://graph.facebook.com/v20.0/${metaPixelId}/events?access_token=${encodeURIComponent(metaAccessToken)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(metaPayload) }).catch(() => undefined);
    }
    return sendEmpty(response);
  } catch {
    return sendJson(response, 400, { error: "invalid_request" });
  }
}
