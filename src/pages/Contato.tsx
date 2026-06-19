import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import WhatsAppChatSection from "@/features/whatsapp/WhatsAppChatSection";

const Contato = () => {
  return (
    <main className="min-h-screen bg-background pt-24">
      <WhatsAppButton />
      <section className="py-12 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-bold uppercase text-primary">Contato</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold text-foreground">
            Fale com a TecPonto pelo WhatsApp.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Responda poucas perguntas em formato de conversa e envie uma mensagem pronta para compra, troca ou reparo.
          </p>
        </div>
      </section>
      <WhatsAppChatSection />
    </main>
  );
};

export default Contato;
