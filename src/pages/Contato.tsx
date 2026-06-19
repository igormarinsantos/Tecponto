import { MapPin, Navigation } from "lucide-react";
import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import WhatsAppChatSection from "@/features/whatsapp/WhatsAppChatSection";
import { Button } from "@/components/ui/button";
import Footer from "@/layouts/Footer";

const address = "R. Itatira, 341 - Parque Uirapuru, Guarulhos - SP, 07230-300";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

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

      <section className="bg-[#F0EFF5] py-12 md:py-20">
        <div className="container mx-auto grid items-center gap-8 px-4 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground lg:mx-0">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-bold uppercase text-primary">Nossa localização</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">Visite a TecPonto.</h2>
            <address className="mx-auto mt-5 max-w-md text-base not-italic leading-relaxed text-muted-foreground md:text-lg lg:mx-0">
              {address}
            </address>
            <Button asChild size="lg" className="mt-6 h-12 rounded-lg px-6 font-bold uppercase">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-2 h-4 w-4" />
                Abrir rota
              </a>
            </Button>
          </div>

          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-background md:aspect-[16/9]">
            <iframe
              title="Localização da TecPonto na Rua Itatira, 341"
              src={mapsEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <WhatsAppChatSection />
      <Footer />
    </main>
  );
};

export default Contato;
