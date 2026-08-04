import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLandingContent } from "@/content/landingContent";

const SITE_URL = "https://www.tecponto.sbs";

type SeoRoute = {
  title: string;
  description: string;
  keywords: string;
  indexable?: boolean;
};

const seoByPath: Record<string, SeoRoute> = {
  "/": {
    title: "TecPonto | Compra, Troca e Reparo de Celular em Guarulhos",
    description: "Repare, troque ou compre celular em Guarulhos. A TecPonto atende pelo WhatsApp, avalia seu usado e oferece aparelhos revisados.",
    keywords: "conserto de celular em Guarulhos, troca de celular usado, celular revisado, assistência técnica em Cumbica, TecPonto",
  },
  "/repare": {
    title: "Conserto de Celular em Guarulhos | TecPonto",
    description: "Conserto de celular em Guarulhos com diagnóstico pelo WhatsApp, reparo de tela, bateria, software e garantia de 90 dias conforme atendimento.",
    keywords: "conserto de celular Guarulhos, troca de tela, troca de bateria, reparo iPhone, assistência técnica celular",
  },
  "/troque": {
    title: "Troque Seu Celular Usado por Outro | TecPonto",
    description: "Use seu celular usado como entrada e receba uma pré-avaliação pelo WhatsApp para trocar por um aparelho revisado.",
    keywords: "trocar celular usado, avaliar celular usado, celular usado como entrada, troca de celular Guarulhos",
  },
  "/compre": {
    title: "Celulares Revisados na Shopee | TecPonto",
    description: "Acesse a loja Shopee da TecPonto para ver celulares revisados e modelos disponíveis.",
    keywords: "celular revisado, comprar celular, loja Shopee TecPonto, celular usado revisado",
  },
  "/garantia": {
    title: "Política de Garantia TecPonto | Compras, Trocas e Reparos",
    description: "Consulte as condições gerais de garantia da TecPonto para compras, trocas e reparos de celular.",
    keywords: "garantia TecPonto, garantia conserto celular, termos de garantia celular",
  },
  "/faq": {
    title: "Dúvidas Frequentes | TecPonto",
    description: "Veja respostas sobre reparo de celular, troca de usado, compra de aparelhos revisados, garantia, pagamento e atendimento.",
    keywords: "FAQ TecPonto, dúvidas conserto celular, dúvidas troca celular, garantia celular",
  },
  "/contato": {
    title: "Contato TecPonto | Atendimento pelo WhatsApp",
    description: "Fale com a TecPonto pelo WhatsApp para comprar, trocar ou reparar seu celular em Guarulhos.",
    keywords: "contato TecPonto, WhatsApp TecPonto, orçamento celular Guarulhos",
  },
  "/links": {
    title: "TecPonto | Compre, Troque e Repare",
    description: "Escolha entre reparar, trocar ou comprar seu celular com a TecPonto em Guarulhos.",
    keywords: "TecPonto, reparo de celular, troca de celular, celular revisado",
    indexable: false,
  },
  "/bio": {
    title: "TecPonto | Compre, Troque e Repare",
    description: "Escolha entre reparar, trocar ou comprar seu celular com a TecPonto em Guarulhos.",
    keywords: "TecPonto, reparo de celular, troca de celular, celular revisado",
    indexable: false,
  },
  "/marketing": {
    title: "Central de Marketing | TecPonto",
    description: "",
    keywords: "",
    indexable: false,
  },
};

const ensureMeta = (name: string) => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  return meta;
};

const ensureProperty = (property: string) => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  return meta;
};

const ensureCanonical = () => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  return link;
};

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "TecPonto",
  url: SITE_URL,
  image: `${SITE_URL}/favicon.png`,
  telephone: "+55 11 93064-2742",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Itatira, 341 - Parque Uirapuru",
    addressLocality: "Guarulhos",
    addressRegion: "SP",
    postalCode: "07230-300",
    addressCountry: "BR",
  },
  areaServed: { "@type": "City", name: "Guarulhos" },
  sameAs: ["https://instagram.com/tecpontobrasil"],
  knowsAbout: ["Reparo de celular", "Troca de celular usado", "Celulares revisados"],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: (["repare", "troque", "compre"] as const).flatMap((variant) => getLandingContent(variant).faq).map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const setStructuredData = (data: Record<string, unknown>) => {
  let script = document.getElementById("tecponto-structured-data") as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = "tecponto-structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
};

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoByPath[pathname] ?? seoByPath["/"];
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    const indexable = seo.indexable !== false;

    document.title = seo.title;
    ensureMeta("description").content = seo.description;
    ensureMeta("keywords").content = seo.keywords;
    ensureMeta("robots").content = indexable ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" : "noindex, nofollow, noarchive";
    ensureCanonical().href = canonicalUrl;

    ensureProperty("og:title").content = seo.title;
    ensureProperty("og:description").content = seo.description;
    ensureProperty("og:url").content = canonicalUrl;
    ensureProperty("og:type").content = "website";
    ensureMeta("twitter:title").content = seo.title;
    ensureMeta("twitter:description").content = seo.description;

    const verificationCode = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
    if (verificationCode) ensureMeta("google-site-verification").content = verificationCode;

    setStructuredData(pathname === "/faq" ? { "@context": "https://schema.org", "@graph": [businessSchema, faqSchema] } : businessSchema);
  }, [pathname]);

  return null;
};

export default RouteSeo;
