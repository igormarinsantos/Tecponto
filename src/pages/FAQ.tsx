import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, RefreshCw, Search, ShoppingBag, Wrench } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import Footer from "@/layouts/Footer";
import { getLandingContent } from "@/content/landingContent";
import type { LandingVariant } from "@/types/landing";

const faqGroups = [
  {
    variant: "repare" as const,
    label: "Repare",
    description: "Prazos, garantia e orçamento",
    icon: Wrench,
    items: getLandingContent("repare").faq,
  },
  {
    variant: "troque" as const,
    label: "Troque",
    description: "Avaliação e troca do seu usado",
    icon: RefreshCw,
    items: getLandingContent("troque").faq,
  },
  {
    variant: "compre" as const,
    label: "Compre",
    description: "Aparelhos, pagamento e retirada",
    icon: ShoppingBag,
    items: getLandingContent("compre").faq,
  },
];

const FAQ = () => {
  const [activeGroup, setActiveGroup] = useState<LandingVariant>("repare");
  const [search, setSearch] = useState("");

  const selectedGroup = faqGroups.find((group) => group.variant === activeGroup) ?? faqGroups[0];
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

  const visibleFaqs = useMemo(() => {
    if (!normalizedSearch) {
      return selectedGroup.items.map((item) => ({ ...item, category: selectedGroup.label }));
    }

    return faqGroups.flatMap((group) =>
      group.items
        .filter((item) =>
          `${item.question} ${item.answer}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
        )
        .map((item) => ({ ...item, category: group.label })),
    );
  }, [normalizedSearch, selectedGroup]);

  return (
    <main className="min-h-screen bg-background pt-24">
      <WhatsAppButton />

      <section className="pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold uppercase text-primary">Central de ajuda</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Encontre sua resposta sem enrolação.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Informações claras sobre reparo, troca de usado e compra de aparelhos revisados.
          </p>

          <label className="relative mx-auto mt-8 block max-w-2xl text-left">
            <span className="sr-only">Buscar uma dúvida</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busque por garantia, prazo, pagamento..."
              className="h-14 w-full rounded-lg border border-border bg-background pl-12 pr-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
        </div>
      </section>

      <section className="bg-[#F0EFF5] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
            <aside>
              <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">Escolha um assunto</p>
              <div className="grid grid-cols-3 gap-2 lg:sticky lg:top-28 lg:grid-cols-1">
                {faqGroups.map((group) => {
                  const Icon = group.icon;
                  const isActive = group.variant === activeGroup && !normalizedSearch;

                  return (
                    <button
                      key={group.variant}
                      type="button"
                      onClick={() => {
                        setActiveGroup(group.variant);
                        setSearch("");
                      }}
                      className={`flex min-w-0 items-center justify-center gap-2 rounded-lg border px-2 py-3 text-sm font-bold transition-colors lg:justify-start lg:px-4 lg:py-4 ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{group.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-primary">
                    {normalizedSearch ? "Resultados da busca" : selectedGroup.label}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
                    {normalizedSearch ? `Encontramos ${visibleFaqs.length} resposta${visibleFaqs.length === 1 ? "" : "s"}` : selectedGroup.description}
                  </h2>
                </div>
                {!normalizedSearch && (
                  <span className="hidden text-sm font-semibold text-muted-foreground sm:block">
                    {visibleFaqs.length} perguntas
                  </span>
                )}
              </div>

              {visibleFaqs.length > 0 ? (
                <Accordion key={`${activeGroup}-${normalizedSearch}`} type="single" collapsible className="space-y-3">
                  {visibleFaqs.map((faq, index) => {
                    const Icon = faq.icon;
                    return (
                      <AccordionItem
                        key={`${faq.category}-${faq.question}`}
                        value={`item-${index}`}
                        className="overflow-hidden rounded-lg border border-border bg-background px-4 transition-colors data-[state=open]:border-primary/40 md:px-6"
                      >
                        <AccordionTrigger className="gap-4 py-5 text-left text-sm font-bold text-foreground hover:text-primary hover:no-underline md:text-base">
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span>{faq.question}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5 pl-12 text-sm leading-relaxed text-muted-foreground md:pb-6 md:text-base">
                          {normalizedSearch && (
                            <span className="mb-2 block text-xs font-bold uppercase text-primary">{faq.category}</span>
                          )}
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <div className="border-t border-border py-12 text-center">
                  <p className="text-lg font-bold text-foreground">Não encontramos essa dúvida.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Tente outro termo ou fale diretamente com nossa equipe.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#25292D] py-14 text-white md:py-20">
        <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-7 px-4 text-center md:flex-row md:text-left">
          <div>
            <p className="text-sm font-bold uppercase text-primary">Atendimento humano</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Ainda ficou com alguma dúvida?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              Fale com a TecPonto no WhatsApp e conte o que você precisa. A gente direciona seu atendimento.
            </p>
          </div>
          <Button asChild size="lg" className="h-14 shrink-0 rounded-lg px-7 font-bold uppercase">
            <a href="https://wa.me/5511930642742" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chamar no WhatsApp
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FAQ;
