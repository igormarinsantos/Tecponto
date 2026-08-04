import { verifyMarketingSession } from "../_lib/marketingAuth.js";

type MarketingEvent = {
  event_name: string;
  visitor_id: string;
  details: Record<string, string | number | boolean>;
};

const json = (body: unknown, init: ResponseInit = {}) => new Response(JSON.stringify(body), {
  ...init,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...(init.headers ?? {}) },
});

const uniqueVisitors = (events: MarketingEvent[]) => new Set(events.map((event) => event.visitor_id)).size;

export default async function handler(request: Request) {
  if (!verifyMarketingSession(request)) return json({ error: "unauthorized" }, { status: 401 });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) return json({ error: "marketing_not_configured" }, { status: 503 });

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const response = await fetch(`${supabaseUrl}/rest/v1/marketing_events?select=event_name,visitor_id,details&occurred_at=gte.${encodeURIComponent(since)}&limit=10000`, {
    headers: { apikey: supabaseServiceRoleKey, Authorization: `Bearer ${supabaseServiceRoleKey}` },
  });
  if (!response.ok) return json({ error: "storage_failed" }, { status: 502 });

  const events = await response.json() as MarketingEvent[];
  const opened = new Set(events.filter((event) => event.event_name === "qualification_open").map((event) => event.visitor_id));
  const completed = new Set(events.filter((event) => event.event_name === "qualification_complete").map((event) => event.visitor_id));
  const abandoned = [...opened].filter((visitor) => !completed.has(visitor)).length;
  const shopee = events.filter((event) => event.event_name === "bio_shopee_open" || (event.event_name === "external_click" && event.details.destination === "shopee"));
  const repair = events.filter((event) => event.event_name === "qualification_option_select" && event.details.modality === "repare");
  const trade = events.filter((event) => event.event_name === "qualification_option_select" && event.details.modality === "troque");

  return json({
    windowDays: 30,
    audiences: [
      { id: "form_abandoners", label: "Abandonaram a qualificacao", visitors: abandoned, activation: "Meta: evento qualification_open sem qualification_complete em 30 dias." },
      { id: "shopee_interest", label: "Interesse em aparelhos", visitors: uniqueVisitors(shopee), activation: "Meta: evento bio_shopee_open ou external_click com destino Shopee." },
      { id: "repair_intent", label: "Intencao de reparo", visitors: uniqueVisitors(repair), activation: "Meta: escolha de Repare no atendimento guiado." },
      { id: "trade_intent", label: "Intencao de troca", visitors: uniqueVisitors(trade), activation: "Meta: escolha de Troque no atendimento guiado." },
    ],
  });
}
