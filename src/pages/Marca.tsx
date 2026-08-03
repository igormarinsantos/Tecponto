import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";
import logo from "@/assets/brand/logo-horizontal.png";
import heroRepare from "@/assets/devices/home-hero-repare.webp";
import heroTroque from "@/assets/devices/home-hero-troque.webp";
import heroCompre from "@/assets/devices/home-hero-compre.webp";
import Footer from "@/layouts/Footer";

const colors = [
  { name: "Laranja TecPonto", value: "#FE5000", use: "Marca, ações e destaques", text: "#FFFFFF" },
  { name: "Laranja Digital", value: "#FF4B00", use: "Heros e grandes superfícies", text: "#FFFFFF" },
  { name: "Grafite", value: "#25292C", use: "Texto, navegação e contraste", text: "#FFFFFF" },
  { name: "Névoa", value: "#EEEDF6", use: "Fundo principal e respiro", text: "#25292C" },
  { name: "Branco", value: "#FFFFFF", use: "Superfícies e texto invertido", text: "#25292C" },
  { name: "WhatsApp", value: "#25D366", use: "Exclusivo para contato", text: "#FFFFFF" },
];

const navItems = [
  ["essencia", "Essência"],
  ["logo", "Logo"],
  ["cores", "Cores"],
  ["tipografia", "Tipografia"],
  ["voz", "Voz"],
  ["interface", "Interface"],
  ["imagem", "Imagem"],
  ["movimento", "Movimento"],
];

const CopyValue = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-current/20 px-2.5 text-xs font-bold transition-colors hover:bg-black/5"
      aria-label={`Copiar ${value}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
      {copied ? "Copiado" : value}
    </button>
  );
};

const SectionTitle = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) => (
  <div className="mb-10 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
    <div>
      <p className="text-xs font-black uppercase text-primary">{eyebrow}</p>
      <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight text-foreground md:text-5xl">{title}</h2>
    </div>
    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
  </div>
);

const Marca = () => {
  return (
    <main className="min-h-screen bg-[#EEEDF6] pt-20 text-[#25292C]">
      <section className="mx-[10px] overflow-hidden rounded-[24px] bg-[#25292C] text-white md:rounded-[30px]">
        <div className="grid min-h-[620px] items-end gap-10 px-6 pb-10 pt-20 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:pb-14">
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase text-[#FE5000]">Brand rules · v1.0</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.98] md:text-7xl lg:text-8xl">TecPonto, em cada ponto de contato.</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-xl">
              Um sistema de marca direto, humano e técnico para comunicar compra, troca e reparo com a mesma confiança.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 text-xs font-black uppercase">
              <span className="rounded-full bg-white px-4 py-2 text-[#25292C]">Compre</span>
              <span className="rounded-full border border-white/30 px-4 py-2">Troque</span>
              <span className="rounded-full border border-white/30 px-4 py-2">Repare</span>
            </div>
          </div>

          <div className="relative flex min-h-[340px] items-end justify-end lg:min-h-[500px]">
            <div className="absolute bottom-[8%] right-[4%] h-[72%] w-[72%] rounded-full bg-[#FE5000] opacity-45 blur-[90px]" />
            <img src={heroTroque} alt="Celulares representando a troca TecPonto" className="relative z-10 w-[min(760px,115%)] max-w-none translate-x-[14%] object-contain" />
          </div>
        </div>
      </section>

      <nav className="sticky top-[72px] z-30 mt-4 border-y border-black/10 bg-[#EEEDF6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-5 py-3 md:px-10">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-3 py-2 text-xs font-bold transition-colors hover:bg-white hover:text-primary">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="essencia" className="scroll-mt-36 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="01 · Essência"
            title="Resolva seu celular sem enrolação."
            description="A TecPonto elimina incerteza. A pessoa precisa entender rapidamente o que pode fazer, confiar em quem vai atender e avançar pelo WhatsApp com o mínimo de esforço."
          />
          <div className="grid border-y border-black/15 md:grid-cols-4">
            {[
              ["Direta", "Explica o próximo passo antes de explicar o processo inteiro."],
              ["Humana", "Conversa como Rodrigo: presente, educado e sem frases robóticas."],
              ["Técnica", "Demonstra segurança por diagnóstico, garantia e clareza."],
              ["Ágil", "Reduz escolhas, antecipa dúvidas e conduz para uma ação."],
            ].map(([title, copy], index) => (
              <div key={title} className={`py-7 md:px-6 ${index > 0 ? "border-t border-black/15 md:border-l md:border-t-0" : ""}`}>
                <span className="text-xs font-black text-primary">0{index + 1}</span>
                <h3 className="mt-8 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 bg-[#FE5000] p-6 text-white md:grid-cols-[0.7fr_1.3fr] md:p-10">
            <p className="text-sm font-black uppercase">Ideia central</p>
            <p className="text-3xl font-black leading-tight md:text-5xl">Compre. Troque. Repare.<br />Seu celular resolvido.</p>
          </div>
        </div>
      </section>

      <section id="logo" className="scroll-mt-36 bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="02 · Logo"
            title="Reconhecível antes de ser decorativa."
            description="A assinatura horizontal é a forma principal. Ela deve aparecer limpa, com contraste alto e espaço suficiente para manter sua leitura em qualquer tamanho."
          />
          <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 lg:grid-cols-3">
            <div className="flex min-h-64 items-center justify-center bg-white p-10">
              <img src={logo} alt="Logo TecPonto sobre fundo branco" className="w-full max-w-[310px]" />
            </div>
            <div className="flex min-h-64 items-center justify-center bg-[#25292C] p-10">
              <img src={logo} alt="Logo TecPonto branco sobre grafite" className="w-full max-w-[310px] brightness-0 invert" />
            </div>
            <div className="flex min-h-64 items-center justify-center bg-[#FE5000] p-10">
              <img src={logo} alt="Logo TecPonto branco sobre laranja" className="w-full max-w-[310px] brightness-0 invert" />
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="border-t-2 border-primary pt-4"><strong className="text-sm">Área de proteção</strong><p className="mt-2 text-sm text-muted-foreground">Mantenha ao redor da marca ao menos a altura da letra T.</p></div>
            <div className="border-t-2 border-primary pt-4"><strong className="text-sm">Tamanho mínimo</strong><p className="mt-2 text-sm text-muted-foreground">120 px no digital. Abaixo disso, priorize legibilidade.</p></div>
            <div className="border-t-2 border-primary pt-4"><strong className="text-sm">Nunca alterar</strong><p className="mt-2 text-sm text-muted-foreground">Não esticar, inclinar, contornar ou aplicar sombras no logo.</p></div>
          </div>
        </div>
      </section>

      <section id="cores" className="scroll-mt-36 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="03 · Cores"
            title="Energia laranja, confiança grafite."
            description="O laranja conduz a ação. O grafite dá peso técnico. Névoa e branco criam respiro. O verde aparece apenas quando a ação pertence ao WhatsApp."
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {colors.map((color) => (
              <div key={color.value} className="flex min-h-56 flex-col justify-between rounded-lg p-6" style={{ backgroundColor: color.value, color: color.text }}>
                <div>
                  <h3 className="text-xl font-black">{color.name}</h3>
                  <p className="mt-1 text-sm opacity-70">{color.use}</p>
                </div>
                <div><CopyValue value={color.value} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex h-14 overflow-hidden rounded-lg" aria-label="Proporção recomendada das cores">
            <div className="w-[45%] bg-[#EEEDF6]" title="45% Névoa" />
            <div className="w-[25%] bg-white" title="25% Branco" />
            <div className="w-[20%] bg-[#25292C]" title="20% Grafite" />
            <div className="w-[10%] bg-[#FE5000]" title="10% Laranja" />
          </div>
        </div>
      </section>

      <section id="tipografia" className="scroll-mt-36 bg-[#25292C] px-5 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="04 · Tipografia"
            title="Uma família. Hierarquia forte."
            description="Space Grotesk mantém a marca contemporânea e técnica. O contraste acontece pelo peso e pelo tamanho, não pela mistura de várias famílias tipográficas."
          />
          <div className="grid gap-12 border-t border-white/20 pt-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[4rem] font-black leading-[0.92] md:text-[7rem]">Space<br />Grotesk</p>
              <p className="mt-8 max-w-xl text-sm text-white/60">Títulos em 800–900. Textos em 400–500. Botões e rótulos em 700–900. Entreletra sempre neutra.</p>
            </div>
            <div className="space-y-8">
              <div><span className="text-xs font-bold text-[#FE5000]">DISPLAY · 72/70</span><p className="mt-2 text-5xl font-black leading-none">Seu celular resolvido.</p></div>
              <div><span className="text-xs font-bold text-[#FE5000]">TÍTULO · 40/44</span><p className="mt-2 text-3xl font-black">Troque com confiança.</p></div>
              <div><span className="text-xs font-bold text-[#FE5000]">CORPO · 16/26</span><p className="mt-2 max-w-lg text-base leading-relaxed text-white/70">Diagnóstico direto, orientação clara e garantia para você decidir sem pressão.</p></div>
              <div><span className="text-xs font-bold text-[#FE5000]">AÇÃO · 14/14</span><p className="mt-2 text-sm font-black uppercase">Iniciar avaliação</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="voz" className="scroll-mt-36 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="05 · Voz"
            title="Conversa simples. Segurança real."
            description="Falamos como uma pessoa experiente que quer resolver. Sem pressão artificial, sem excesso de termos técnicos e sem promessas que dependem de avaliação."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 md:p-8">
              <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /><span className="text-xs font-black uppercase">TecPonto fala assim</span></div>
              <div className="mt-8 space-y-5">
                <p className="border-l-2 border-primary pl-4 text-xl font-bold">“Me conta o modelo e o que aconteceu. A gente te orienta por aqui.”</p>
                <p className="border-l-2 border-primary pl-4 text-xl font-bold">“Seu usado pode virar entrada. Primeiro fazemos uma pré-avaliação clara.”</p>
                <p className="border-l-2 border-primary pl-4 text-xl font-bold">“A garantia depende do serviço realizado. Veja as condições.”</p>
              </div>
            </div>
            <div className="rounded-lg border border-black/15 p-6 md:p-8">
              <div className="flex items-center gap-2 text-muted-foreground"><span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs font-black">×</span><span className="text-xs font-black uppercase">Evite</span></div>
              <div className="mt-8 space-y-5 text-muted-foreground">
                <p className="border-l-2 border-black/15 pl-4 text-xl font-bold">“A melhor assistência do Brasil com preço imbatível.”</p>
                <p className="border-l-2 border-black/15 pl-4 text-xl font-bold">“Seu aparelho será aceito e valerá muito.”</p>
                <p className="border-l-2 border-black/15 pl-4 text-xl font-bold">“Clique já e não perca esta oportunidade única.”</p>
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-px overflow-hidden rounded-lg bg-black/10 md:grid-cols-3">
            {["Frases curtas", "Verbos de ação", "Uma decisão por vez"].map((item) => <div key={item} className="bg-white p-5 text-center text-sm font-black">{item}</div>)}
          </div>
        </div>
      </section>

      <section id="interface" className="scroll-mt-36 bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="06 · Interface"
            title="A próxima ação sempre é óbvia."
            description="Controles compactos, contraste alto e poucos níveis de decisão. Cantos arredondados aparecem para organizar interação, não como decoração em todas as superfícies."
          />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-lg bg-[#EEEDF6] p-6 md:p-8">
              <p className="text-xs font-black uppercase text-primary">Botões</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#FE5000] px-5 text-sm font-black uppercase text-white">Quero orçamento <ArrowRight className="h-4 w-4" /></button>
                <button className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#25292C] px-5 text-sm font-black uppercase text-white"><ShoppingBag className="h-4 w-4" /> Acessar loja</button>
                <button className="inline-flex h-12 items-center gap-2 rounded-lg border border-black/20 bg-white px-5 text-sm font-black uppercase"><MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp</button>
              </div>
              <p className="mt-8 text-xs font-black uppercase text-primary">Modos</p>
              <div className="mt-4 inline-flex rounded-full bg-[#25292C] p-1 text-sm font-bold text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-primary"><Wrench className="h-4 w-4" /> Repare</span>
                <span className="px-4 py-2">Troque</span>
                <span className="px-4 py-2">Compre</span>
              </div>
            </div>
            <div className="rounded-lg border border-black/10 p-6 md:p-8">
              <p className="text-xs font-black uppercase text-primary">Formulário conversacional</p>
              <div className="mt-6 max-w-md rounded-lg bg-[#ECE5DD] p-4">
                <div className="max-w-[86%] rounded-lg bg-white p-4 text-sm shadow-sm">Oi, que bom ter você aqui. O que você precisa resolver hoje?</div>
                <div className="mt-4 ml-auto max-w-[68%] rounded-lg bg-[#D9FDD3] p-3 text-sm font-semibold">Quero reparar meu celular</div>
                <div className="mt-4 grid gap-2">
                  <button className="rounded-lg border border-black/10 bg-white px-4 py-3 text-left text-sm font-bold">Tela quebrada</button>
                  <button className="rounded-lg border border-black/10 bg-white px-4 py-3 text-left text-sm font-bold">Bateria</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              [ShieldCheck, "Garantia", "Confiança antes da ação"],
              [Smartphone, "Modalidade", "Um caminho por intenção"],
              [MessageCircle, "WhatsApp", "Contato sem formulário longo"],
              [Sparkles, "Destaque", "Use com moderação"],
            ].map(([Icon, title, copy]) => {
              const IconComponent = Icon as typeof ShieldCheck;
              return <div key={title as string} className="rounded-lg border border-black/10 p-5"><IconComponent className="h-5 w-5 text-primary" /><h3 className="mt-7 font-black">{title as string}</h3><p className="mt-2 text-sm text-muted-foreground">{copy as string}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section id="imagem" className="scroll-mt-36 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="07 · Imagem"
            title="O produto e a ação são protagonistas."
            description="Celulares reais, mãos brasileiras e recortes limpos. A imagem deve explicar compra, troca ou reparo mesmo antes da pessoa ler o título."
          />
          <div className="grid gap-3 lg:grid-cols-3">
            {[
              [heroCompre, "Compre", "Produto revisado, acessórios e acabamento limpo."],
              [heroTroque, "Troque", "O aparelho atual e o próximo modelo na mesma cena."],
              [heroRepare, "Repare", "Dano visível, ferramenta e intenção de conserto."],
            ].map(([image, title, copy]) => (
              <figure key={title} className="overflow-hidden rounded-lg bg-[#FF4B00]">
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-[20%] rounded-full bg-amber-300 blur-[60px]" />
                  <img src={image} alt={`Direção de imagem para ${title}`} className="relative h-full w-full object-contain" />
                </div>
                <figcaption className="bg-white p-5"><strong className="text-lg">{title}</strong><p className="mt-1 text-sm text-muted-foreground">{copy}</p></figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="border-t-2 border-emerald-500 pt-4"><strong>Usar</strong><p className="mt-2 text-sm text-muted-foreground">Fundo transparente, luz comercial limpa, enquadramento central, textura real e glow laranja sutil.</p></div>
            <div className="border-t-2 border-red-500 pt-4"><strong>Evitar</strong><p className="mt-2 text-sm text-muted-foreground">Ícones genéricos como imagem principal, banco de imagem corporativo, fundos azuis abstratos e excesso de efeitos.</p></div>
          </div>
        </div>
      </section>

      <section id="movimento" className="scroll-mt-36 bg-[#FE5000] px-5 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="08 · Movimento"
            title="Movimento reforça direção, nunca distração."
            description="A experiência deve parecer leve mesmo quando há imagens grandes. Animações existem para orientar mudança de estado e dar profundidade ao produto."
          />
          <div className="grid gap-px overflow-hidden rounded-lg bg-white/25 md:grid-cols-4">
            {[
              ["Parallax", "Somente vertical no desktop"],
              ["Transição", "600–800 ms, suave"],
              ["Hover", "Resposta curta e previsível"],
              ["Acessibilidade", "Respeitar reduced motion"],
            ].map(([title, copy]) => <div key={title} className="bg-[#FE5000] p-6"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 text-sm text-white/75">{copy}</p></div>)}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-8 border-t border-white/30 pt-10 md:flex-row md:items-end">
            <div><p className="text-sm font-bold text-white/70">Regra de decisão</p><p className="mt-2 max-w-3xl text-3xl font-black md:text-5xl">Se o efeito chama mais atenção que a mensagem, reduza o efeito.</p></div>
            <a href="#essencia" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black uppercase text-[#25292C]">Voltar ao início <ArrowRight className="h-4 w-4 -rotate-90" /></a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Marca;
