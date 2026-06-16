import FAQSection from "@/components/FAQSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const FAQ = () => {
  return (
    <main className="min-h-screen bg-background pt-24">
      <WhatsAppButton />
      <section className="py-12 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-bold uppercase text-primary">Perguntas frequentes</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold text-foreground">
            Dúvidas comuns antes de falar com a TecPonto.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Veja respostas rápidas sobre reparo, troca, compra, garantia, pagamento e atendimento.
          </p>
        </div>
      </section>
      <FAQSection />
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-[#25292D] p-8 text-center text-white shadow-strong">
            <h2 className="text-2xl font-bold md:text-4xl">
              Ainda ficou com alguma dúvida?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              Chame a TecPonto no WhatsApp e conte rapidamente se você quer comprar, trocar ou reparar.
            </p>
            <Button asChild size="lg" className="mt-6 rounded-full px-8 py-6 font-bold uppercase">
              <a href="https://wa.me/5511930642742" target="_blank" rel="noopener noreferrer">
                Chamar no WhatsApp
                <MessageCircle className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQ;
