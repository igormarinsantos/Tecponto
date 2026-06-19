import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const seoByPath: Record<string, {
  title: string;
  description: string;
  keywords: string;
}> = {
  "/": {
    title: "TecPonto | Compra, Troca e Reparo de Celular em Guarulhos",
    description: "A TecPonto atende em Guarulhos com reparo de celular, troca de usado como entrada e venda de celulares revisados pela loja Shopee.",
    keywords: "TecPonto, conserto de celular Guarulhos, trocar celular usado, celular revisado, assistencia tecnica Cumbica",
  },
  "/repare": {
    title: "Conserto de Celular em Guarulhos | TecPonto",
    description: "Reparo de celular em Guarulhos com diagnostico pelo WhatsApp, troca de tela, bateria, software e garantia de 90 dias conforme atendimento.",
    keywords: "conserto de celular Guarulhos, troca de tela, troca de bateria, reparo iPhone, assistencia tecnica celular",
  },
  "/troque": {
    title: "Troque Seu Celular Usado por Outro | TecPonto",
    description: "Use seu celular usado como entrada e receba uma pre-avaliacao pelo WhatsApp para trocar por um aparelho revisado.",
    keywords: "trocar celular usado, avaliar celular usado, celular usado como entrada, troca de celular Guarulhos",
  },
  "/compre": {
    title: "Celulares Revisados na Shopee | TecPonto",
    description: "Acesse a loja Shopee da TecPonto para ver celulares revisados e modelos disponiveis.",
    keywords: "celular revisado, comprar celular, loja Shopee TecPonto, celular usado revisado",
  },
  "/garantia": {
    title: "Politica de Garantia TecPonto | Compras, Trocas e Reparos",
    description: "Consulte as condicoes gerais de garantia da TecPonto para compras, trocas e reparos de celular.",
    keywords: "garantia TecPonto, garantia conserto celular, termos de garantia celular",
  },
  "/faq": {
    title: "Duvidas Frequentes | TecPonto",
    description: "Veja respostas sobre reparo de celular, troca de usado, compra de aparelhos revisados, garantia, pagamento e atendimento.",
    keywords: "FAQ TecPonto, duvidas conserto celular, duvidas troca celular, garantia celular",
  },
  "/contato": {
    title: "Contato TecPonto | Atendimento pelo WhatsApp",
    description: "Fale com a TecPonto pelo WhatsApp para comprar, trocar ou reparar seu celular em Guarulhos.",
    keywords: "contato TecPonto, WhatsApp TecPonto, orcamento celular Guarulhos",
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

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoByPath[pathname] ?? seoByPath["/"];
    document.title = seo.title;
    ensureMeta("description").content = seo.description;
    ensureMeta("keywords").content = seo.keywords;

    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", seo.title);
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", seo.description);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute("content", seo.title);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute("content", seo.description);
  }, [pathname]);

  return null;
};

export default RouteSeo;
