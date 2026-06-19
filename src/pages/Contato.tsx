import { ArrowDown, Instagram, MapPin, MessageCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/features/whatsapp/WhatsAppButton";
import WhatsAppChatSection from "@/features/whatsapp/WhatsAppChatSection";
import { LANDING_QUALIFICATION_EVENT } from "@/features/whatsapp/landingQualification";
import Footer from "@/layouts/Footer";

const address = "R. Itatira, 341 - Parque Uirapuru, Guarulhos - SP, 07230-300";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const Contato = () => {
  const openQualification = () => {
    window.dispatchEvent(new Event(LANDING_QUALIFICATION_EVENT));
  };

  const scrollToLocation = () => {
    document.getElementById("localizacao")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <WhatsAppButton />

      <section className="pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold uppercase text-primary">Contato TecPonto</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Fale com quem entende do seu celular.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Comece pelo WhatsApp para comprar, trocar ou reparar. Se preferir, encontre nossa unidade em Guarulhos.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={openQualification} size="lg" className="h-14 rounded-lg px-7 font-bold uppercase">
              <MessageCircle className="mr-2 h-5 w-5" />
              Iniciar atendimento
            </Button>
            <Button onClick={scrollToLocation} size="lg" variant="outline" className="h-14 rounded-lg px-7 font-bold uppercase">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              Como chegar
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="container mx-auto grid max-w-5xl gap-3 px-4 md:grid-cols-3">
          <button
            type="button"
            onClick={openQualification}
            className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#1EAF54]">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-foreground">WhatsApp</span>
              <span className="block text-xs text-muted-foreground">Atendimento guiado</span>
            </span>
          </button>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-foreground">Loja física</span>
              <span className="block text-xs text-muted-foreground">Parque Uirapuru, Guarulhos</span>
            </span>
          </a>

          <a
            href="https://instagram.com/tecpontobrasil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E1306C]/10 text-[#E1306C]">
              <Instagram className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-foreground">Instagram</span>
              <span className="block text-xs text-muted-foreground">@tecpontobrasil</span>
            </span>
          </a>
        </div>
      </section>

      <WhatsAppChatSection />

      <section id="localizacao" className="scroll-mt-24 py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground lg:mx-0">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-bold uppercase text-primary">Atendimento presencial</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">Visite a TecPonto.</h2>
            <address className="mx-auto mt-5 max-w-md text-base not-italic leading-relaxed text-muted-foreground md:text-lg lg:mx-0">
              {address}
            </address>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground lg:mx-0">
              Confirme seu atendimento pelo WhatsApp antes de se deslocar até a unidade.
            </p>
            <Button asChild size="lg" className="mt-6 h-12 rounded-lg px-6 font-bold uppercase">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-2 h-4 w-4" />
                Abrir rota
              </a>
            </Button>
          </div>

          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-[#F0EFF5] md:aspect-[16/9]">
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

      <Footer />
    </main>
  );
};

export default Contato;
