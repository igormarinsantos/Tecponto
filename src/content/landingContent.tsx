import type { ReactNode } from "react";
import {
  Award,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LandingVariant } from "@/types/landing";

import reparoPhone from "@/assets/repare/repare-hero-phone.png";
import trocaPhone from "@/assets/devices/troca.png";
import comprePhone from "@/assets/devices/compre.png";
import screenRepair from "@/assets/services/screen-repair.png";
import battery from "@/assets/services/battery.png";
import internalRepair from "@/assets/services/internal-repair.png";
import software from "@/assets/services/software.png";
import speaker from "@/assets/services/speaker.png";
import warrantyImg from "@/assets/services/warranty.png";
import motoboyImg from "@/assets/devices/motoboy.png";
import perfectPhone from "@/assets/devices/perfect-phone.jpg";
import troqueUsedAssessmentImg from "@/assets/devices/troque-used-assessment.png";
import troqueUsedEntryImg from "@/assets/devices/troque-used-entry.png";
import troquePremiumReviewedImg from "@/assets/devices/troque-premium-reviewed.png";
import troqueTechnicalSecurityImg from "@/assets/devices/troque-technical-security.png";
import troqueUpgradeImg from "@/assets/devices/troque-upgrade.png";
import troquePremiumImg from "@/assets/devices/troque-premium-line.png";
import troqueUsedValueImg from "@/assets/devices/troque-used-value.png";

export type LandingServiceItem = {
  image: string;
  title: string;
  description: string;
};

export type LandingComparisonRow = {
  other: string;
  tecponto: string;
};

export type LandingFaqItem = {
  icon: LucideIcon;
  question: string;
  answer: string;
};

export type LandingVariantContent = {
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: ReactNode;
    features: Array<{ icon: LucideIcon; text: string }>;
    floatingBadge: string;
    image: string;
    imageAlt: string;
  };
  services: {
    title: string;
    subtitle: ReactNode;
    ctaTitle: string;
    ctaDescription: ReactNode;
    ctaButton: string;
    items: LandingServiceItem[];
  };
  warranty: {
    image: string;
    title: string;
    description: ReactNode;
    buttonText: string;
  };
  delivery: {
    image: string;
    title: string;
    description: ReactNode;
    buttonText: string;
  };
  comparison: {
    title: string;
    subtitle: string;
    rows: LandingComparisonRow[];
  };
  faq: LandingFaqItem[];
  finalCta: {
    title: ReactNode;
    subtitle: string;
    button: string;
    bullets: string[];
  };
  whatsappChat: {
    title: string;
    subtitle: string;
    button: string;
    firstMessage: string;
    secondMessage: string;
    userReply: string;
  };
};

const repareComparisonRows: LandingComparisonRow[] = [
  { other: "Sem garantia ou apenas 30 dias", tecponto: "Garantia de 90 dias" },
  { other: "Qualidade da peça pouco clara", tecponto: "Peças informadas antes do reparo" },
  { other: "Atendimento sem orientação pelo WhatsApp", tecponto: "Atendimento inicial pelo WhatsApp" },
  { other: "Demora de dias ou semanas", tecponto: "Reparo em até 2 horas" },
];

const tradeComparisonRows: LandingComparisonRow[] = [
  {
    other: "Avaliação pouco clara do aparelho usado",
    tecponto: "Pré-avaliação objetiva pelo WhatsApp",
  },
  {
    other: "Proposta confusa na hora da troca",
    tecponto: "Seu usado pode entrar como parte do pagamento",
  },
  {
    other: "Aparelhos sem histórico de revisão",
    tecponto: "Celulares revisados e conferidos pela equipe",
  },
  {
    other: "Atendimento sem orientação sobre próximo aparelho",
    tecponto: "Indicação de opções conforme seu uso e orçamento",
  },
];

export const defaultWhatsAppChatContent = {
  title: "Fale com a TecPonto",
  subtitle: "Comece pelo WhatsApp e siga para compra, troca ou reparo.",
  button: "Iniciar conversa",
  firstMessage: "Oi! Sou o Rodrigo, da TecPonto. O que você gostaria de fazer hoje?",
  secondMessage: "Posso te ajudar com compra, troca ou reparo de celular.",
  userReply: "Quero atendimento",
};

export const landingContent: Record<LandingVariant, LandingVariantContent> = {
  repare: {
    hero: {
      eyebrow: "10% OFF Novos Clientes",
      title: "Seu celular",
      highlight: "quebrou?",
      description: (
        <>
          <span className="font-bold text-foreground">Conserto rápido</span>,{" "}
          <span className="font-bold text-foreground">garantia de 90 dias</span> e{" "}
          <span className="font-bold text-foreground">atendimento especializado</span> que você merece
        </>
      ),
      features: [
        { icon: Zap, text: "Reparo Rápido" },
        { icon: Shield, text: "90 Dias Garantia" },
        { icon: Award, text: "Peças Originais" },
      ],
      floatingBadge: "Reparo em 2h",
      image: reparoPhone,
      imageAlt: "Celular quebrado - Conserto profissional",
    },
    services: {
      title: "Nossas Soluções",
      subtitle: (
        <>
          <span className="font-bold text-foreground">Reparos para os problemas mais comuns</span> em celulares iPhone, Samsung, Motorola e Xiaomi
        </>
      ),
      ctaTitle: "Pronto pra consertar?",
      ctaDescription: (
        <>
          <span className="font-bold text-foreground">Receba um orçamento gratuito</span> em até 5 minutos
        </>
      ),
      ctaButton: "Solicitar Orçamento",
      items: [
        { image: screenRepair, title: "Troca de Tela", description: "Substituição de tela com avaliação do modelo e orientação antes do reparo" },
        { image: battery, title: "Troca de Bateria", description: "Bateria nova, teste de funcionamento e garantia de 90 dias" },
        { image: internalRepair, title: "Reparos Internos", description: "Análise de placa, conectores e componentes internos do aparelho" },
        { image: software, title: "Problemas de Software", description: "Formatação, atualização e correção de travamentos com orientação técnica" },
        { image: speaker, title: "Áudio e Microfone", description: "Reparo de alto-falante, microfone e falhas de som no celular" },
      ],
    },
    warranty: {
      image: warrantyImg,
      title: "Garantia de 90 Dias",
      description: (
        <>
          <span className="font-bold text-white">Todos os nossos reparos</span> incluem{" "}
          <span className="font-bold text-primary">garantia de 90 dias</span>.
          Trabalhamos com <span className="font-semibold">peças de qualidade</span> e <span className="font-semibold">técnicos especializados</span> para
          entregar um reparo explicado antes da aprovação.
        </>
      ),
      buttonText: "Solicitar Garantia",
    },
    delivery: {
      image: motoboyImg,
      title: "Leva e Traz",
      description: (
        <>
          <span className="font-bold text-white">Combinamos busca e entrega</span> do seu celular com <span className="font-semibold">orientação pelo WhatsApp</span> na região de{" "}
          <span className="font-bold text-white">Guarulhos e São Paulo</span>,
          <span className="font-bold"> conforme disponibilidade</span>. Você acompanha o atendimento com mais praticidade.
        </>
      ),
      buttonText: "Solicitar Coleta",
    },
    comparison: {
      title: "Por Que Escolher a TecPonto?",
      subtitle: "Veja como a TecPonto reduz risco, prazo e dúvida no atendimento",
      rows: repareComparisonRows,
    },
    faq: [
      { icon: Clock, question: "Quanto tempo demora o reparo?", answer: "A maioria dos reparos é feita em até 2 horas. Casos mais complexos podem levar até 24 horas, mas sempre informamos o prazo antes de iniciar." },
      { icon: MapPin, question: "Vocês começam o atendimento pelo WhatsApp?", answer: "Sim. Você envia o modelo, explica o problema e recebe uma orientação inicial antes de seguir com o reparo." },
      { icon: Shield, question: "Qual a garantia dos serviços?", answer: "Todos os nossos reparos incluem garantia de 90 dias para peças e mão de obra. Trabalhamos apenas com componentes de qualidade." },
      { icon: CreditCard, question: "Aceitam quais formas de pagamento?", answer: "Aceitamos dinheiro, PIX, cartões de crédito e débito. Também parcelamos em até 3x sem juros." },
      { icon: FileText, question: "Fazem orçamento sem compromisso?", answer: "Sim. Avaliamos o caso, explicamos o caminho recomendado e informamos o valor antes de iniciar o serviço." },
      { icon: Smartphone, question: "Atendem iPhone e Android?", answer: "Sim. Atendemos iPhone, Samsung, Motorola, Xiaomi e outras marcas populares conforme disponibilidade de peça e diagnóstico." },
    ],
    finalCta: {
      title: (
        <>
          Seu celular funcionando em pouco
          <br />
          tempo, <span className="text-primary">rápido e sem dor de cabeça</span>
        </>
      ),
      subtitle: "Diagnóstico, orientação pelo WhatsApp e garantia de 90 dias no reparo",
      button: "Quero um Orçamento Gratuito",
      bullets: ["Resposta em até 5 minutos", "Garantia de 90 dias", "Busca e entrega grátis"],
    },
    whatsappChat: {
      title: "Comece seu reparo pelo WhatsApp",
      subtitle: "O Rodrigo organiza as informações para agilizar o orçamento.",
      button: "Iniciar orçamento",
      firstMessage: "Oi! Sou o Rodrigo, da TecPonto. Vamos entender o que aconteceu com seu celular?",
      secondMessage: "Responda rapidinho e eu organizo seu pedido para a equipe técnica.",
      userReply: "Quero reparar meu celular",
    },
  },
  troque: {
    hero: {
      eyebrow: "Avaliação rápida do seu usado",
      title: "Troque seu celular",
      highlight: "sem enrolação",
      description: (
        <>
          <span className="font-bold text-foreground">Avaliamos seu aparelho</span>,{" "}
          <span className="font-bold text-foreground">aceitamos como entrada</span> e te ajudamos a sair com um modelo melhor
        </>
      ),
      features: [
        { icon: Zap, text: "Avaliação Rápida" },
        { icon: Shield, text: "Troca Segura" },
        { icon: Award, text: "Modelos Selecionados" },
      ],
      floatingBadge: "Troca facilitada",
      image: trocaPhone,
      imageAlt: "Celular para troca - Avaliação TecPonto",
    },
    services: {
      title: "Troque com Segurança",
      subtitle: (
        <>
          <span className="font-bold text-foreground">Seu celular usado pode virar entrada</span> para um aparelho revisado, testado e escolhido com orientação da TecPonto
        </>
      ),
      ctaTitle: "Quer descobrir quanto vale?",
      ctaDescription: (
        <>
          <span className="font-bold text-foreground">Responda rapidinho no WhatsApp</span> e receba uma pré-avaliação clara do seu aparelho
        </>
      ),
      ctaButton: "Descobrir Valor do Meu Usado",
      items: [
        { image: troqueUsedAssessmentImg, title: "Avaliação Clara do Seu Usado", description: "Analisamos modelo, estado, bateria, tela e funcionamento para chegar em uma proposta objetiva." },
        { image: troqueUsedEntryImg, title: "Seu Usado Vira Entrada", description: "Seu aparelho atual pode abater parte do valor de um modelo melhor, sem proposta confusa." },
        { image: troquePremiumReviewedImg, title: "Celulares Revisados para Troca", description: "Modelos selecionados, testados e prontos para você sair usando com confiança." },
        { image: troqueTechnicalSecurityImg, title: "Segurança Técnica", description: "A TecPonto revisa os aparelhos antes de indicar a melhor opção para sua troca." },
        { image: troqueUpgradeImg, title: "Upgrade Sem Complicação", description: "Você manda as informações pelo WhatsApp e recebe um caminho claro para trocar de aparelho." },
      ],
    },
    warranty: {
      image: troquePremiumImg,
      title: "Linha Premium",
      description: (
        <>
          Temos uma <span className="font-bold text-white">seleção de celulares revisados</span> para troca. Cada aparelho passa por{" "}
          <span className="font-bold text-primary">checagem técnica</span> antes de ser indicado, com informações claras sobre estado e condições.
        </>
      ),
      buttonText: "Ver Modelos Premium",
    },
    delivery: {
      image: troqueUsedValueImg,
      title: "Seu Usado Vale Dinheiro",
      description: (
        <>
          <span className="font-bold text-white">Avaliamos seu celular atual</span> com critérios claros. Ele pode entrar como <span className="font-semibold">parte do pagamento</span> para você escolher um aparelho revisado.
        </>
      ),
      buttonText: "Avaliar Meu Usado",
    },
    comparison: {
      title: "Por Que Trocar com a TecPonto?",
      subtitle: "Entenda a diferença na hora de avaliar seu usado e escolher outro aparelho",
      rows: tradeComparisonRows,
    },
    faq: [
      { icon: Smartphone, question: "Quais aparelhos vocês aceitam na troca?", answer: "Avaliamos celulares de várias marcas. O valor depende do modelo, estado da tela, bateria, carcaça e funcionamento geral." },
      { icon: FileText, question: "Como funciona a avaliação?", answer: "Você envia modelo, fotos e detalhes pelo WhatsApp. A equipe faz uma pré-avaliação e confirma o valor após checar o aparelho." },
      { icon: Shield, question: "A troca é segura?", answer: "Sim. A TecPonto confere os aparelhos tecnicamente e orienta cada etapa para você entender valor, condição e opções disponíveis." },
      { icon: CreditCard, question: "Posso usar meu celular como entrada?", answer: "Sim. O valor aprovado pode ser usado como entrada para outro aparelho disponível." },
      { icon: MapPin, question: "Preciso ir até a loja?", answer: "Você pode começar pelo WhatsApp. Dependendo da região e disponibilidade, combinamos a melhor forma de avaliar e finalizar." },
      { icon: Clock, question: "Dá para trocar no mesmo dia?", answer: "Em muitos casos sim, principalmente quando o modelo desejado está disponível e a avaliação é aprovada rapidamente." },
    ],
    finalCta: {
      title: (
        <>
          Troque seu celular com
          <br />
          <span className="text-primary">avaliação justa e rápida</span>
        </>
      ),
      subtitle: "Use seu aparelho como entrada e veja opções revisadas para o seu dia a dia",
      button: "Avaliar Meu Celular",
      bullets: ["Pré-avaliação por WhatsApp", "Troca segura", "Atendimento em Guarulhos"],
    },
    whatsappChat: {
      title: "Pré-avalie seu usado pelo WhatsApp",
      subtitle: "Envie poucas informações e veja se seu aparelho pode virar entrada.",
      button: "Iniciar avaliação",
      firstMessage: "Oi! Sou o Rodrigo, da TecPonto. Quer usar seu celular como entrada?",
      secondMessage: "Responda poucas perguntas e eu preparo sua pré-avaliação.",
      userReply: "Quero avaliar meu usado",
    },
  },
  compre: {
    hero: {
      eyebrow: "Celulares revisados e com garantia",
      title: "Compre seu próximo",
      highlight: "celular",
      description: (
        <>
          <span className="font-bold text-foreground">Aparelhos selecionados</span>,{" "}
          <span className="font-bold text-foreground">testados pela assistência</span> e prontos para você comprar com confiança
        </>
      ),
      features: [
        { icon: Zap, text: "Pronta Entrega" },
        { icon: Shield, text: "Garantia TecPonto" },
        { icon: Award, text: "Curadoria Técnica" },
      ],
      floatingBadge: "Compra segura",
      image: comprePhone,
      imageAlt: "Celular revisado para venda - TecPonto",
    },
    services: {
      title: "Compre com Confiança",
      subtitle: (
        <>
          <span className="font-bold text-foreground">Celulares revisados pela TecPonto</span> para comprar com suporte de assistência técnica
        </>
      ),
      ctaTitle: "Quer ver os disponíveis?",
      ctaDescription: (
        <>
          <span className="font-bold text-foreground">Peça a lista atualizada</span> de modelos pelo WhatsApp
        </>
      ),
      ctaButton: "Ver Modelos",
      items: [
        { image: perfectPhone, title: "Aparelhos Revisados", description: "Modelos testados pela assistência antes de serem indicados para compra" },
        { image: battery, title: "Bateria Conferida", description: "Checagem de saúde e funcionamento para compra mais segura" },
        { image: screenRepair, title: "Tela Testada", description: "Toque, brilho, manchas e acabamento avaliados pela equipe" },
        { image: software, title: "Sistema Pronto", description: "Aparelho limpo, funcional e preparado para o novo dono" },
        { image: internalRepair, title: "Suporte TecPonto", description: "Compra com orientação de quem entende de assistência técnica" },
      ],
    },
    warranty: {
      image: warrantyImg,
      title: "Garantia de 90 Dias",
      description: (
        <>
          <span className="font-bold text-white">Todos os nossos reparos</span> incluem{" "}
          <span className="font-bold text-primary">garantia de 90 dias</span>.
          Trabalhamos com <span className="font-semibold">peças de qualidade</span> e <span className="font-semibold">técnicos especializados</span> para
          entregar um reparo explicado antes da aprovação.
        </>
      ),
      buttonText: "Solicitar Garantia",
    },
    delivery: {
      image: motoboyImg,
      title: "Leva e Traz",
      description: (
        <>
          <span className="font-bold text-white">Combinamos busca e entrega</span> do seu celular com <span className="font-semibold">orientação pelo WhatsApp</span> na região de{" "}
          <span className="font-bold text-white">Guarulhos e São Paulo</span>,
          <span className="font-bold"> conforme disponibilidade</span>. Você acompanha o atendimento com mais praticidade.
        </>
      ),
      buttonText: "Solicitar Coleta",
    },
    comparison: {
      title: "Por Que Escolher a TecPonto?",
      subtitle: "Veja como a TecPonto reduz risco, prazo e dúvida no atendimento",
      rows: repareComparisonRows,
    },
    faq: [
      { icon: Smartphone, question: "Os celulares são revisados?", answer: "Sim. Os aparelhos passam por checagem técnica antes de serem oferecidos para venda." },
      { icon: Shield, question: "Tem garantia?", answer: "Sim. As condições variam conforme o aparelho, e explicamos tudo antes da compra." },
      { icon: FileText, question: "Como vejo os modelos disponíveis?", answer: "Você pode acessar nossa loja Shopee ou pedir orientação pelo WhatsApp. Como o estoque gira, confirmamos modelos, cores e valores em tempo real." },
      { icon: CreditCard, question: "Quais formas de pagamento aceitam?", answer: "Aceitamos PIX, dinheiro, débito e crédito. As opções de parcelamento podem variar conforme o aparelho." },
      { icon: MapPin, question: "Posso retirar na loja?", answer: "Sim. Também combinamos atendimento pelo WhatsApp para você confirmar o aparelho antes de sair de casa." },
      { icon: Clock, question: "O aparelho já vem pronto para uso?", answer: "Sim. Entregamos o celular testado e preparado para você configurar seus dados." },
    ],
    finalCta: {
      title: (
        <>
          Compre seu próximo celular
          <br />
          <span className="text-primary">revisado pela TecPonto</span>
        </>
      ),
      subtitle: "Modelos selecionados, testados e disponíveis pela loja Shopee",
      button: "Ver Modelos Disponíveis",
      bullets: ["Lista atualizada", "Aparelhos testados", "Compra com suporte"],
    },
    whatsappChat: {
      title: "Encontre um celular revisado",
      subtitle: "Veja opções com orientação da TecPonto e acesso à loja Shopee.",
      button: "Ver opções",
      firstMessage: "Oi! Sou o Rodrigo, da TecPonto. Posso te ajudar a encontrar um celular revisado.",
      secondMessage: "Também temos nossa loja na Shopee para você ver os aparelhos disponíveis.",
      userReply: "Quero comprar um celular",
    },
  },
};

export const getLandingContent = (variant: LandingVariant = "repare") => landingContent[variant];
