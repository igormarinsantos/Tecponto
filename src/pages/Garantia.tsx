import { NavLink } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import Footer from "@/layouts/Footer";

const summaryCards = [
  "Garantia informada antes da compra, troca ou servico",
  "Atendimento pelo WhatsApp para analise inicial",
  "Comprovante ou ordem de servico podem ser solicitados",
];

const terms = [
  {
    title: "1. Cobertura da garantia",
    content:
      "A garantia cobre exclusivamente o item, peca ou servico informado no momento do atendimento. Em reparos, a cobertura se aplica ao defeito corrigido pela TecPonto, conforme a ordem de servico.",
  },
  {
    title: "2. Prazo de garantia",
    content:
      "O prazo pode variar conforme o tipo de produto, peca ou servico contratado. Quando aplicavel, reparos podem contar com garantia de ate 90 dias, sempre conforme combinado e registrado no atendimento.",
  },
  {
    title: "3. O que pode cancelar a garantia",
    content:
      "A garantia pode ser invalidada em casos de queda, oxidação, contato com liquido, mau uso, violacao por terceiros, tentativa de reparo externo, dano fisico novo ou uso fora das orientacoes passadas pela equipe.",
  },
  {
    title: "4. Analise tecnica",
    content:
      "Toda solicitacao de garantia passa por analise tecnica. A avaliacao identifica se o problema esta relacionado ao reparo, produto ou peca coberta, ou se houve novo dano ou causa externa.",
  },
  {
    title: "5. Compras, trocas e aparelhos revisados",
    content:
      "Aparelhos vendidos ou envolvidos em troca sao revisados antes da entrega. Condicoes de garantia, estado do aparelho, acessorios e detalhes comerciais devem ser confirmados no atendimento.",
  },
  {
    title: "6. Como acionar",
    content:
      "Para acionar a garantia, entre em contato pelo WhatsApp com nome, modelo do aparelho, comprovante ou ordem de servico e uma descricao simples do que aconteceu.",
  },
];

const Garantia = () => {
  return (
    <main className="min-h-screen bg-background pt-24">
      <WhatsAppButton />

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-bold uppercase text-primary">Termos de garantia</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Politica de garantia TecPonto.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Veja quando a garantia se aplica, quais casos precisam de analise tecnica e como acionar o suporte da TecPonto.
            </p>
            <div className="mt-6 inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase text-muted-foreground">
              Atualizado em junho de 2026
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {summaryCards.map((item) => (
              <div key={item} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold leading-relaxed text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            {terms.map((term, index) => (
              <article key={term.title} className={`p-6 md:p-8 ${index > 0 ? "border-t border-border" : ""}`}>
                <h2 className="text-xl font-bold text-foreground">{term.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {term.content}
                </p>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-[#25292D] p-6 text-white md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase">Precisa acionar garantia?</span>
                </div>
                <p className="text-lg font-semibold">
                  Fale com a equipe e envie as informacoes do aparelho, comprovante ou ordem de servico.
                </p>
              </div>
              <Button asChild size="lg" className="rounded-full px-8 py-6 font-bold uppercase">
                <NavLink to="/contato">
                  Falar no WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Garantia;
