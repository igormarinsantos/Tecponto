import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import Footer from "@/layouts/Footer";

const summaryItems = [
  {
    icon: FileCheck2,
    title: "Condição registrada",
    description: "Prazo e cobertura são informados no atendimento, comprovante ou ordem de serviço.",
  },
  {
    icon: ShieldCheck,
    title: "Análise técnica",
    description: "Toda solicitação passa por uma avaliação para confirmar a origem do problema.",
  },
  {
    icon: MessageCircle,
    title: "Início pelo WhatsApp",
    description: "Envie os dados do aparelho e explique o ocorrido antes de levar o dispositivo.",
  },
];

const terms = [
  {
    id: "cobertura",
    number: "01",
    title: "Cobertura da garantia",
    content:
      "A garantia cobre exclusivamente o item, a peça ou o serviço informado no atendimento. Em reparos, a cobertura se aplica ao defeito corrigido pela TecPonto, conforme o registro da ordem de serviço.",
  },
  {
    id: "prazo",
    number: "02",
    title: "Prazo de garantia",
    content:
      "O prazo pode variar conforme o produto, a peça ou o serviço contratado. Quando aplicável, reparos podem contar com garantia de até 90 dias. A condição válida é a registrada no atendimento ou documento entregue ao cliente.",
  },
  {
    id: "cancelamento",
    number: "03",
    title: "Situações que invalidam a cobertura",
    content:
      "Quedas, contato com líquido, oxidação, mau uso, dano físico novo, violação por terceiros, tentativa de reparo externo ou uso contrário às orientações podem invalidar a garantia.",
  },
  {
    id: "analise",
    number: "04",
    title: "Análise técnica",
    content:
      "A avaliação verifica se o problema está relacionado ao reparo, produto ou peça coberta. Se for identificado um novo dano ou uma causa externa, a equipe apresenta o diagnóstico antes de qualquer novo serviço.",
  },
  {
    id: "aparelhos",
    number: "05",
    title: "Compras, trocas e aparelhos revisados",
    content:
      "Aparelhos vendidos ou envolvidos em troca passam por revisão antes da entrega. Estado do dispositivo, acessórios, prazo e condições comerciais são informados e confirmados em cada atendimento.",
  },
  {
    id: "acionamento",
    number: "06",
    title: "Como acionar a garantia",
    content:
      "Entre em contato pelo WhatsApp com seu nome, modelo do aparelho, comprovante ou ordem de serviço e uma descrição simples do problema. Fotos ou vídeos podem ser solicitados para a orientação inicial.",
  },
];

const coveredItems = [
  "Defeito relacionado ao serviço executado",
  "Peça indicada na ordem de serviço",
  "Condição registrada no atendimento",
];

const excludedItems = [
  "Queda ou novo dano físico",
  "Contato com líquido ou oxidação",
  "Abertura ou reparo realizado por terceiros",
  "Uso inadequado após o atendimento",
];

const warrantyWhatsAppUrl =
  "https://wa.me/5511930642742?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20a%20garantia%20do%20meu%20aparelho.";

const Garantia = () => {
  return (
    <main className="min-h-screen bg-background pt-24">
      <WhatsAppButton />

      <section className="overflow-hidden pb-12 pt-10 md:pb-20 md:pt-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="text-sm font-bold uppercase text-primary">Política de garantia</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Segurança antes, durante e depois do atendimento.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Consulte a cobertura, os prazos, as situações que podem invalidar a garantia e o caminho para solicitar uma análise.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-bold uppercase text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5 text-primary" />
              Atualizado em junho de 2026
            </div>
          </div>

        </div>
      </section>

      <section className="bg-[#F0EFF5] py-10 md:py-14">
        <div className="container mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-lg border border-border bg-background p-5 md:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <nav className="sticky top-28 border-l border-border pl-5" aria-label="Índice dos termos de garantia">
              <p className="mb-4 text-xs font-bold uppercase text-muted-foreground">Nesta página</p>
              <div className="space-y-3">
                {terms.map((term) => (
                  <a key={term.id} href={`#${term.id}`} className="block text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                    {term.number}. {term.title}
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          <div>
            <div className="mb-8">
              <p className="text-sm font-bold uppercase text-primary">Termos atualizados</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Condições gerais de garantia</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Leia as condições abaixo. O registro específico do seu atendimento complementa estas regras gerais.
              </p>
            </div>

            <div className="border-t border-border">
              {terms.map((term) => (
                <article key={term.id} id={term.id} className="scroll-mt-28 border-b border-border py-7 md:grid md:grid-cols-[64px_1fr] md:gap-4 md:py-9">
                  <span className="text-sm font-black text-primary">{term.number}</span>
                  <div>
                    <h3 className="mt-2 text-xl font-bold text-foreground md:mt-0 md:text-2xl">{term.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{term.content}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F0EFF5] py-14 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-9 text-center">
            <p className="text-sm font-bold uppercase text-primary">Consulta rápida</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">O que normalmente está coberto?</h2>
          </div>

          <div className="grid overflow-hidden rounded-lg border border-border bg-background md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-bold">Pode estar coberto</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {coveredItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground md:text-base">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border p-6 md:border-l md:border-t-0 md:p-8">
              <div className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Normalmente não está coberto</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {excludedItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground md:text-base">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            A confirmação depende da análise técnica e das condições registradas no atendimento.
          </p>
        </div>
      </section>

      <section className="bg-[#25292D] py-14 text-white md:py-20">
        <div className="container mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center justify-center gap-2 text-primary lg:justify-start">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm font-bold uppercase">Solicitar análise</span>
            </div>
            <h2 className="mt-3 text-center text-3xl font-bold md:text-4xl lg:text-left">Precisa acionar a garantia?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-white/70 md:text-base lg:mx-0 lg:text-left">
              Tenha em mãos o modelo do aparelho, comprovante ou ordem de serviço e uma descrição do problema.
            </p>
          </div>
          <Button asChild size="lg" className="mx-auto h-14 rounded-lg px-7 font-bold uppercase lg:mx-0">
            <a href={warrantyWhatsAppUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Acionar garantia
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Garantia;
