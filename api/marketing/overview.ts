import { requestUrl, sendJson, type ApiRequest, type ApiResponse } from "../_lib/http.js";
import { verifyMarketingSession } from "../_lib/marketingAuth.js";

type MarketingEvent = { event_name: string; visitor_id: string; campaign_source: string; campaign_name: string; campaign_content: string; details: Record<string, string | number | boolean> };
type MarketingLead = { status: string };
const count = (events: MarketingEvent[], name: string) => events.filter((event) => event.event_name === name).length;

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!verifyMarketingSession(request)) return sendJson(response, 401, { error: "unauthorized" }, { "Cache-Control": "no-store" });
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) return sendJson(response, 503, { error: "marketing_not_configured" }, { "Cache-Control": "no-store" });

  const requestedDays = Number(requestUrl(request).searchParams.get("days") ?? "30");
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const headers = { apikey: supabaseServiceRoleKey, Authorization: `Bearer ${supabaseServiceRoleKey}` };
  const [eventsResponse, leadsResponse] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/marketing_events?select=event_name,visitor_id,campaign_source,campaign_name,campaign_content,details&occurred_at=gte.${encodeURIComponent(since)}&order=occurred_at.desc&limit=10000`, { headers }),
    fetch(`${supabaseUrl}/rest/v1/marketing_leads?select=status&created_at=gte.${encodeURIComponent(since)}&limit=10000`, { headers }),
  ]);
  if (!eventsResponse.ok || !leadsResponse.ok) return sendJson(response, 502, { error: "storage_failed" }, { "Cache-Control": "no-store" });

  const events = await eventsResponse.json() as MarketingEvent[];
  const leads = await leadsResponse.json() as MarketingLead[];
  const visitors = new Set(events.map((event) => event.visitor_id)).size;
  const pageViews = count(events, "page_view");
  const opens = count(events, "qualification_open");
  const completed = count(events, "qualification_complete");
  const whatsapp = count(events, "bio_whatsapp_start") + events.filter((event) => event.event_name === "external_click" && event.details.destination === "whatsapp").length;
  const shopee = count(events, "bio_shopee_open") + events.filter((event) => event.event_name === "external_click" && event.details.destination === "shopee").length;
  const campaigns = Array.from(events.reduce((items, event) => {
    const key = [event.campaign_source || "direct", event.campaign_name || "Sem campanha", event.campaign_content || "-"].join("|");
    const item = items.get(key) ?? { source: event.campaign_source || "direct", campaign: event.campaign_name || "Sem campanha", content: event.campaign_content || "-", visitors: new Set<string>(), pageViews: 0, whatsapp: 0, completed: 0 };
    item.visitors.add(event.visitor_id);
    if (event.event_name === "page_view") item.pageViews += 1;
    if (event.event_name === "qualification_complete") item.completed += 1;
    if (event.event_name === "bio_whatsapp_start" || (event.event_name === "external_click" && event.details.destination === "whatsapp")) item.whatsapp += 1;
    items.set(key, item);
    return items;
  }, new Map<string, { source: string; campaign: string; content: string; visitors: Set<string>; pageViews: number; whatsapp: number; completed: number }>())).map(([, item]) => ({ ...item, visitors: item.visitors.size })).sort((a, b) => b.whatsapp - a.whatsapp || b.completed - a.completed || b.pageViews - a.pageViews).slice(0, 12);

  return sendJson(response, 200, {
    days,
    generatedAt: new Date().toISOString(),
    overview: { visitors, pageViews, qualificationOpens: opens, qualificationCompleted: completed, whatsappStarts: whatsapp, shopeeOpens: shopee, leads: leads.length, convertedLeads: leads.filter((lead) => lead.status === "convertido").length },
    funnel: [{ label: "Visitas", value: pageViews }, { label: "Formularios abertos", value: opens }, { label: "Qualificacoes concluidas", value: completed }, { label: "WhatsApp iniciado", value: whatsapp }],
    campaigns,
  }, { "Cache-Control": "no-store" });
}
