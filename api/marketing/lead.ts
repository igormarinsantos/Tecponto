const MODALITY_FIELDS: Record<string, string[]> = {
  repare: ["device", "problem", "timing"],
  troque: ["currentDevice", "condition", "desiredType"],
  compre: [],
};

const asText = (value: unknown, maximum = 180) => typeof value === "string" ? value.slice(0, maximum) : "";
const json = (body: unknown, init: ResponseInit = {}) => new Response(JSON.stringify(body), {
  ...init,
  headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
});

export default async function handler(request: Request) {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) return new Response(null, { status: 204 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const modality = asText(body.modality, 20);
    const fields = MODALITY_FIELDS[modality];
    const visitorId = asText(body.visitor_id, 128);
    const sessionId = asText(body.session_id, 128);
    if (!fields || !visitorId || !sessionId) return json({ error: "invalid_lead" }, { status: 422 });

    const rawQualification = body.qualification as Record<string, unknown> ?? {};
    const qualification = Object.fromEntries(fields.map((field) => [field, asText(rawQualification[field], 120)]).filter(([, value]) => value));
    const response = await fetch(`${supabaseUrl}/rest/v1/marketing_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        modality,
        visitor_id: visitorId,
        session_id: sessionId,
        campaign_source: asText(body.campaign_source),
        campaign_name: asText(body.campaign_name),
        campaign_content: asText(body.campaign_content),
        qualification,
      }),
    });

    if (!response.ok) return json({ error: "storage_failed" }, { status: 502 });
    return new Response(null, { status: 204 });
  } catch {
    return json({ error: "invalid_request" }, { status: 400 });
  }
}
