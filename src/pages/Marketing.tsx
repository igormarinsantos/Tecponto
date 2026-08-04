import { BarChart3, CheckCircle2, CircleAlert, LogIn, RefreshCw, ShieldCheck, ShoppingBag, Smartphone, Users, MessageCircle } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Overview = {
  visitors: number;
  pageViews: number;
  qualificationOpens: number;
  qualificationCompleted: number;
  whatsappStarts: number;
  shopeeOpens: number;
  leads: number;
  convertedLeads: number;
};

type LeadStatus = "novo" | "em_atendimento" | "orcamento_enviado" | "aguardando_cliente" | "convertido" | "perdido";

type MarketingLead = {
  id: string;
  created_at: string;
  modality: "repare" | "troque" | "compre";
  status: LeadStatus;
  campaign_source: string;
  campaign_name: string;
  campaign_content: string;
  qualification: Record<string, string>;
  outcome_note: string;
};

type Audience = { id: string; label: string; visitors: number; activation: string };

type DashboardData = {
  days: number;
  generatedAt: string;
  overview: Overview;
  funnel: Array<{ label: string; value: number }>;
  campaigns: Array<{ source: string; campaign: string; content: string; visitors: number; pageViews: number; whatsapp: number; completed: number }>;
};

const periods = [7, 30, 90] as const;
const statusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  orcamento_enviado: "Orcamento enviado",
  aguardando_cliente: "Aguardando cliente",
  convertido: "Convertido",
  perdido: "Perdido",
};
const modalityLabels = { repare: "Repare", troque: "Troque", compre: "Compre" };

const ratio = (numerator: number, denominator: number) => denominator ? `${Math.round((numerator / denominator) * 100)}%` : "-";

const Marketing = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<DashboardData | null>(null);
  const [leads, setLeads] = useState<MarketingLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [error, setError] = useState<"unauthorized" | "not_configured" | "failed" | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async (selectedDays = days) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketing/overview?days=${selectedDays}`, { credentials: "same-origin" });
      if (response.status === 401) {
        setAuthenticated(false);
        setError("unauthorized");
        return;
      }
      if (response.status === 503) {
        setAuthenticated(true);
        setError("not_configured");
        return;
      }
      if (!response.ok) throw new Error("dashboard_failed");
      setData(await response.json() as DashboardData);
      setAuthenticated(true);
    } catch {
      setError("failed");
    } finally {
      setLoading(false);
    }
  }, [days]);

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const response = await fetch("/api/marketing/leads", { credentials: "same-origin" });
      if (!response.ok) return;
      const result = await response.json() as { leads: MarketingLead[] };
      setLeads(result.leads);
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  const loadAudiences = useCallback(async () => {
    try {
      const response = await fetch("/api/marketing/audiences", { credentials: "same-origin" });
      if (!response.ok) return;
      const result = await response.json() as { audiences: Audience[] };
      setAudiences(result.audiences);
    } catch {
      // Audience suggestions do not block the core dashboard.
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    void loadDashboard();
    void loadLeads();
    void loadAudiences();
  }, [authenticated, days, loadDashboard, loadLeads, loadAudiences]);

  const updateLead = async (lead: MarketingLead, status: LeadStatus) => {
    const previousLeads = leads;
    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, status } : item));
    try {
      const response = await fetch("/api/marketing/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id: lead.id, status, outcome_note: lead.outcome_note }),
      });
      if (!response.ok) throw new Error("lead_update_failed");
      void loadDashboard();
    } catch {
      setLeads(previousLeads);
    }
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/marketing/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(response.status === 503 ? "not_configured" : "unauthorized");
        return;
      }
      setPassword("");
      setAuthenticated(true);
    } catch {
      setError("failed");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#EEEDF6] px-4 py-6 text-[#25292C] sm:grid sm:place-items-center sm:p-8">
        <section className="mx-auto w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(37,41,44,0.12)] sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25292C] text-[#FE5000]"><ShieldCheck className="h-5 w-5" /></div>
          <p className="mt-6 text-xs font-black uppercase tracking-wide text-[#FE5000]">TecPonto</p>
          <h1 className="mt-2 text-3xl font-black leading-none">Central de Marketing</h1>
          <form className="mt-8 space-y-3" onSubmit={login}>
            <label className="block text-sm font-bold" htmlFor="marketing-password">Senha de acesso</label>
            <input id="marketing-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="h-12 w-full rounded-xl border border-black/15 px-4 text-base outline-none transition focus:border-[#FE5000] focus:ring-2 focus:ring-[#FE5000]/20" />
            {error === "unauthorized" && <p className="text-sm font-semibold text-red-600">Senha inválida.</p>}
            {error === "not_configured" && <p className="text-sm font-semibold text-amber-700">A senha administrativa ainda não foi configurada no ambiente.</p>}
            {error === "failed" && <p className="text-sm font-semibold text-red-600">Não foi possível abrir a Central agora.</p>}
            <button disabled={!password || loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FE5000] text-sm font-black uppercase text-white transition hover:bg-[#df4600] disabled:cursor-not-allowed disabled:opacity-50">
              <LogIn className="h-4 w-4" /> {loading ? "Entrando" : "Acessar Central"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  const overview = data?.overview;
  const maxFunnelValue = Math.max(...(data?.funnel.map((item) => item.value) ?? [1]), 1);

  return (
    <main className="min-h-screen bg-[#EEEDF6] text-[#25292C]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div><p className="text-xs font-black uppercase tracking-wide text-[#FE5000]">TecPonto</p><h1 className="text-xl font-black">Central de Marketing</h1></div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-[#EEEDF6] p-1">{periods.map((period) => <button key={period} onClick={() => setDays(period)} className={`h-8 rounded-md px-3 text-xs font-black ${days === period ? "bg-white text-[#FE5000] shadow-sm" : "text-[#25292C]/55"}`}>{period}d</button>)}</div>
            <button onClick={() => { void loadDashboard(); void loadLeads(); void loadAudiences(); }} className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white transition hover:bg-[#EEEDF6]" aria-label="Atualizar dados"><RefreshCw className={`h-4 w-4 ${(loading || leadsLoading) ? "animate-spin" : ""}`} /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {error === "not_configured" ? (
          <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-950"><CircleAlert className="h-5 w-5" /><h2 className="mt-3 text-xl font-black">Banco ainda não conectado</h2><p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed">A interface está pronta. Configure as variáveis do Supabase na Vercel e aplique a migration para começar a receber os eventos do site.</p></section>
        ) : error === "failed" ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900"><CircleAlert className="h-5 w-5" /><h2 className="mt-3 text-xl font-black">Não foi possível carregar os dados</h2><button onClick={() => void loadDashboard()} className="mt-4 text-sm font-black underline">Tentar novamente</button></section>
        ) : (
          <>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Visitantes", value: overview?.visitors ?? 0, icon: Users },
                { label: "Formulários abertos", value: overview?.qualificationOpens ?? 0, icon: Smartphone },
                { label: "Leads qualificados", value: overview?.leads ?? 0, icon: MessageCircle },
                { label: "Vendas confirmadas", value: overview?.convertedLeads ?? 0, icon: CheckCircle2 },
              ].map((item) => <article key={item.label} className="rounded-xl border border-black/10 bg-white p-5"><item.icon className="h-4 w-4 text-[#FE5000]" /><p className="mt-5 text-3xl font-black">{item.value}</p><p className="mt-1 text-sm font-bold text-[#25292C]/60">{item.label}</p></article>)}
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <article className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#FE5000]" /><h2 className="font-black">Funil de intenção</h2></div><div className="mt-7 space-y-5">{data?.funnel.map((item, index) => <div key={item.label}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-bold">{item.label}</span><span className="font-black">{item.value} {index > 0 && <span className="text-[#25292C]/45">{ratio(item.value, data.funnel[index - 1].value)}</span>}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#EEEDF6]"><div className="h-full rounded-full bg-[#FE5000]" style={{ width: `${(item.value / maxFunnelValue) * 100}%` }} /></div></div>)}</div></article>
              <article className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="font-black">Campanhas e criativos</h2><p className="mt-1 text-sm font-medium text-[#25292C]/55">Ordenado por intenção de conversa.</p></div><span className="text-xs font-bold text-[#25292C]/45">{data?.days} dias</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-black/10 text-[10px] font-black uppercase tracking-wide text-[#25292C]/45"><tr><th className="pb-3">Campanha</th><th className="pb-3 text-right">Visitas</th><th className="pb-3 text-right">Qualificados</th><th className="pb-3 text-right">WhatsApp</th></tr></thead><tbody>{data?.campaigns.length ? data.campaigns.map((campaign) => <tr key={`${campaign.source}-${campaign.campaign}-${campaign.content}`} className="border-b border-black/5 last:border-0"><td className="py-3"><strong className="block font-black">{campaign.campaign}</strong><span className="text-xs font-medium text-[#25292C]/55">{campaign.source} · {campaign.content}</span></td><td className="py-3 text-right font-bold">{campaign.pageViews}</td><td className="py-3 text-right font-bold">{campaign.completed}</td><td className="py-3 text-right font-black text-[#FE5000]">{campaign.whatsapp}</td></tr>) : <tr><td colSpan={4} className="py-10 text-center font-medium text-[#25292C]/50">Sem eventos neste período.</td></tr>}</tbody></table></div></article>
            </section>

            <section className="mt-6 rounded-xl border border-black/10 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-black">Leads para acompanhar</h2><p className="mt-1 text-sm font-medium text-[#25292C]/55">Qualificacoes salvas apos a conclusao do atendimento guiado.</p></div><span className="text-xs font-bold text-[#25292C]/45">{leads.length} recentes</span></div>
              <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-black/10 text-[10px] font-black uppercase tracking-wide text-[#25292C]/45"><tr><th className="pb-3">Lead</th><th className="pb-3">Interesse</th><th className="pb-3">Origem</th><th className="pb-3">Recebido</th><th className="pb-3 text-right">Etapa</th></tr></thead><tbody>{leads.length ? leads.map((lead) => <tr key={lead.id} className="border-b border-black/5 last:border-0"><td className="py-3"><strong className="block font-black">{modalityLabels[lead.modality]}</strong><span className="block max-w-[260px] truncate text-xs font-medium text-[#25292C]/55">{Object.values(lead.qualification).join(" · ") || "Atendimento iniciado"}</span></td><td className="py-3 text-xs font-bold text-[#25292C]/70">{lead.campaign_name || lead.campaign_source || "Direto"}</td><td className="py-3 text-xs font-bold text-[#25292C]/70">{lead.campaign_content || lead.campaign_source || "Site"}</td><td className="py-3 text-xs font-bold text-[#25292C]/70">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(lead.created_at))}</td><td className="py-3 text-right"><label className="sr-only" htmlFor={`lead-${lead.id}`}>Etapa do lead</label><select id={`lead-${lead.id}`} value={lead.status} onChange={(event) => void updateLead(lead, event.target.value as LeadStatus)} className="h-9 rounded-lg border border-black/10 bg-white px-2 text-xs font-black outline-none focus:border-[#FE5000]">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td></tr>) : <tr><td colSpan={5} className="py-10 text-center font-medium text-[#25292C]/50">Nenhum lead qualificado ainda.</td></tr>}</tbody></table></div>
            </section>

            <section className="mt-6 rounded-xl border border-black/10 bg-white p-5 sm:p-6"><div><h2 className="font-black">Publicos para remarketing</h2><p className="mt-1 text-sm font-medium text-[#25292C]/55">Leitura dos ultimos 30 dias. Ative os eventos com o Pixel e crie estes publicos na Meta.</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{audiences.map((audience) => <article key={audience.id} className="rounded-lg border border-black/10 bg-[#EEEDF6]/60 p-4"><p className="text-2xl font-black text-[#FE5000]">{audience.visitors}</p><h3 className="mt-3 font-black">{audience.label}</h3><p className="mt-2 text-xs font-medium leading-relaxed text-[#25292C]/55">{audience.activation}</p></article>)}</div></section>
          </>
        )}
      </div>
    </main>
  );
};

export default Marketing;
