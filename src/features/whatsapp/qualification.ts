import type { LandingVariant } from "@/types/landing";
import { getCampaignWhatsAppContext } from "@/features/analytics/campaign";

export const WHATSAPP_PHONE = "5511930642742";

export type QualificationValues = Record<string, string>;

export type QualificationField = {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
};

export const qualificationFlow: Record<LandingVariant, {
  title: string;
  subtitle: string;
  button: string;
  fields: QualificationField[];
}> = {
  repare: {
    title: "Reparar meu celular",
    subtitle: "Três respostas rápidas para a equipe entender o reparo.",
    button: "Enviar pedido de reparo",
    fields: [
      {
        id: "device",
        label: "Aparelho",
        placeholder: "Qual aparelho vamos olhar?",
        type: "select",
        options: ["iPhone", "Samsung", "Motorola", "Xiaomi", "Outro aparelho"],
      },
      {
        id: "problem",
        label: "Problema",
        placeholder: "O que aconteceu com o aparelho?",
        type: "select",
        options: ["Tela quebrada", "Bateria", "Não carrega", "Molhou", "Travando", "Outro problema"],
      },
      {
        id: "timing",
        label: "Próximo passo",
        placeholder: "Como podemos te ajudar agora?",
        type: "select",
        options: ["Quero resolver hoje", "Quero um orçamento", "Posso ir nos próximos dias"],
      },
    ],
  },
  troque: {
    title: "Trocar meu usado",
    subtitle: "Três respostas para uma pré-avaliação clara do seu usado.",
    button: "Enviar pedido de troca",
    fields: [
      {
        id: "currentDevice",
        label: "Aparelho para avaliar",
        placeholder: "Qual celular você quer avaliar?",
        type: "select",
        options: ["iPhone", "Samsung", "Motorola", "Xiaomi", "Outro aparelho"],
      },
      {
        id: "condition",
        label: "Estado do aparelho",
        placeholder: "Como ele está hoje?",
        type: "select",
        options: ["Muito conservado", "Marcas de uso", "Tela trincada", "Com defeito", "Não sei avaliar"],
      },
      {
        id: "desiredType",
        label: "Objetivo da troca",
        placeholder: "O que você quer fazer?",
        type: "select",
        options: ["Usar como entrada", "Trocar por outro iPhone", "Só descobrir quanto vale"],
      },
    ],
  },
  compre: {
    title: "Comprar um celular",
    subtitle: "Veja os aparelhos revisados e com garantia na nossa Shopee.",
    button: "Abrir loja na Shopee",
    fields: [],
  },
};

export const buildQualificationMessage = (
  variant: LandingVariant,
  values: QualificationValues,
) => {
  const flow = qualificationFlow[variant];
  const lines = [
    "Olá! Vim pelo site da TecPonto.",
    `Modalidade: ${flow.title}`,
    getCampaignWhatsAppContext(),
    "",
    ...flow.fields.map((field) => `${field.label}: ${values[field.id] || "Não informado"}`),
  ];

  return lines.filter(Boolean).join("\n");
};

export const buildWhatsAppUrl = (variant: LandingVariant, values: QualificationValues) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildQualificationMessage(variant, values))}`;
