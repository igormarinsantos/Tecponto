# Central de Marketing - configuracao

## 1. Banco no Supabase

1. Abra o SQL Editor do projeto Supabase.
2. Execute `supabase/migrations/001_marketing.sql` por inteiro.
3. Confirme que as tabelas `marketing_events` e `marketing_leads` foram criadas.

As tabelas usam RLS e nao tem politica publica. Somente as funcoes da Vercel com a chave service role acessam os dados.

## 2. Variaveis da Vercel

Cadastre em Production, Preview e Development quando fizer sentido:

```text
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service_role_do_supabase
MARKETING_ADMIN_PASSWORD=senha-forte-para-central
MARKETING_SESSION_SECRET=segredo-longo-aleatorio
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=123456789012345
META_CONVERSIONS_API_TOKEN=token-da-conversions-api
META_TEST_EVENT_CODE=opcional-para-teste-no-meta
```

`SUPABASE_SERVICE_ROLE_KEY`, `MARKETING_ADMIN_PASSWORD`, `MARKETING_SESSION_SECRET` e `META_CONVERSIONS_API_TOKEN` sao segredos de servidor: nunca entram no codigo do navegador. Apenas as variaveis com prefixo `VITE_` sao expostas ao site.

Depois de salvar as variaveis, faca um novo deploy. Variaveis `VITE_` so entram no bundle durante o build.

## 3. Checagem pratica

1. Acesse o site em janela anonima e aceite a medicao.
2. Abra o formulario, responda e conclua uma rota de reparo ou troca.
3. Acesse `/marketing`, entre com `MARKETING_ADMIN_PASSWORD` e confirme o evento e o lead.
4. No Meta Events Manager, use Test Events com `META_TEST_EVENT_CODE` e confira Browser + Server com o mesmo `event_id`.
5. No GA4 DebugView, confirme eventos com prefixo `tecponto_`.

Se o visitante recusar a medicao, o atendimento continua normalmente, mas eventos, identificadores anonimos persistentes e armazenamento de lead para campanha nao sao enviados.

## 4. Publicos de remarketing na Meta

Depois de o Pixel receber volume suficiente, crie estes Publicos Personalizados para 30 dias:

- `qualification_open` sem `qualification_complete`: retomar quem abandonou a qualificacao.
- `bio_shopee_open` ou `external_click` com `destination = shopee`: oferta de aparelhos revisados.
- `qualification_option_select` com `modality = repare`: diagnostico e prazo de reparo.
- `qualification_option_select` com `modality = troque`: pre-avaliacao do usado.

Exclua `qualification_complete` e `bio_whatsapp_start` das campanhas de recuperacao quando a estrategia for gerar apenas novos atendimentos.

## 5. Convencao de links de campanha

Use sempre UTMs completas, por exemplo:

```text
https://tecponto.com.br/repare?utm_source=instagram&utm_medium=paid_social&utm_campaign=reparo_guarulhos&utm_content=video_tela_quebrada_a
```

O painel agrupa por source, campaign e content. O valor de `utm_content` deve identificar criativo, publico ou variacao do anuncio.
