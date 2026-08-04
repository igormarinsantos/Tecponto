import { verifyMarketingSession } from "../_lib/marketingAuth.js";

const allowedStatuses = ["novo", "em_atendimento", "orcamento_enviado", "aguardando_cliente", "convertido", "perdido"] as const;
type LeadStatus = typeof allowedStatuses[number];

const json = (body: unknown, init: ResponseInit = {}) => new Response(JSON.stringify(body), {
  ...init,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...(init.headers ?? {}) },
});

const asText = (value: unknown, maximum = 320) => typeof value === "string" ? value.trim().slice(0, maximum) : "";

export default async function handler(request: Request) {
  if (!verifyMarketingSession(request)) return json({ error: "unauthorized" }, { status: 401 });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) return json({ error: "marketing_not_configured" }, { status: 503 });

  const headers = {
    "Content-Type": "application/json",
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
  };

  if (request.method === "GET") {
    const response = await fetch(`${supabaseUrl}/rest/v1/marketing_leads?select=id,created_at,modality,status,campaign_source,campaign_name,campaign_content,qualification,outcome_note&order=created_at.desc&limit=100`, { headers });
    if (!response.ok) return json({ error: "storage_failed" }, { status: 502 });
    return json({ leads: await response.json() });
  }

  if (request.method !== "PATCH") return json({ error: "method_not_allowed" }, { status: 405 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const id = asText(body.id, 64);
    const status = asText(body.status, 40) as LeadStatus;
    const outcomeNote = asText(body.outcome_note, 600);
    if (!id || !allowedStatuses.includes(status)) return json({ error: "invalid_lead_update" }, { status: 422 });

    const response = await fetch(`${supabaseUrl}/rest/v1/marketing_leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({ status, outcome_note: outcomeNote, updated_at: new Date().toISOString() }),
    });
    if (!response.ok) return json({ error: "storage_failed" }, { status: 502 });
    return json({ lead: (await response.json())[0] ?? null });
  } catch {
    return json({ error: "invalid_request" }, { status: 400 });
  }
}
