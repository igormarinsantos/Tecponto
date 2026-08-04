create extension if not exists pgcrypto;

create table if not exists public.marketing_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  event_name text not null,
  visitor_id text not null,
  session_id text not null,
  campaign_source text not null default 'direct',
  campaign_medium text not null default 'direct',
  campaign_name text not null default '',
  campaign_content text not null default '',
  campaign_term text not null default '',
  click_id text not null default '',
  landing_path text not null default '',
  instagram_browser boolean not null default false,
  details jsonb not null default '{}'::jsonb
);

create index if not exists marketing_events_occurred_at_idx on public.marketing_events (occurred_at desc);
create index if not exists marketing_events_event_name_idx on public.marketing_events (event_name, occurred_at desc);
create index if not exists marketing_events_visitor_idx on public.marketing_events (visitor_id, occurred_at desc);
create index if not exists marketing_events_campaign_idx on public.marketing_events (campaign_source, campaign_name, occurred_at desc);

create table if not exists public.marketing_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  visitor_id text,
  session_id text,
  modality text not null check (modality in ('repare', 'troque', 'compre')),
  status text not null default 'novo' check (status in ('novo', 'em_atendimento', 'orcamento_enviado', 'aguardando_cliente', 'convertido', 'perdido')),
  campaign_source text not null default 'direct',
  campaign_name text not null default '',
  campaign_content text not null default '',
  qualification jsonb not null default '{}'::jsonb,
  outcome_note text not null default ''
);

create index if not exists marketing_leads_status_idx on public.marketing_leads (status, created_at desc);
create index if not exists marketing_leads_campaign_idx on public.marketing_leads (campaign_source, campaign_name, created_at desc);

create or replace function public.set_marketing_lead_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_marketing_lead_updated_at on public.marketing_leads;
create trigger set_marketing_lead_updated_at
before update on public.marketing_leads
for each row execute function public.set_marketing_lead_updated_at();

alter table public.marketing_events enable row level security;
alter table public.marketing_leads enable row level security;

-- No public policies: only the server-side API using SUPABASE_SERVICE_ROLE_KEY may write or read these tables.
