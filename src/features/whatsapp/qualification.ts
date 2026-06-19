import type { LandingVariant } from "@/types/landing";

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
    title: "Repare",
    subtitle: "Responda rapidinho para a equipe entender o reparo antes do atendimento.",
    button: "Enviar pedido de reparo",
    fields: [
      { id: "name", label: "Nome", placeholder: "Seu nome" },
      {
        id: "brand",
        label: "Marca",
        placeholder: "Qual a marca?",
        type: "select",
        options: ["iPhone", "Samsung", "Xiaomi", "Motorola", "LG", "Outra"],
      },
      { id: "model", label: "Modelo", placeholder: "Digite só o modelo. Ex: iPhone 13, A32" },
      {
        id: "problem",
        label: "Problema",
        placeholder: "O que aconteceu com o aparelho?",
        type: "select",
        options: ["Tela quebrada", "Bateria ruim", "Não carrega", "Molhou", "Sem áudio", "Software/travando", "Outro"],
      },
      {
        id: "urgency",
        label: "Urgência",
        placeholder: "Quando você precisa resolver?",
        type: "select",
        options: ["Hoje", "Amanhã", "Essa semana", "Só orçamento"],
      },
      {
        id: "pickup",
        label: "Atendimento",
        placeholder: "Como prefere ser atendido?",
        type: "select",
        options: ["Quero busca/entrega", "Vou até a loja", "Ainda não sei"],
      },
    ],
  },
  troque: {
    title: "Troque",
    subtitle: "Vamos pré-avaliar seu usado com poucas respostas objetivas.",
    button: "Enviar pedido de troca",
    fields: [
      { id: "name", label: "Nome", placeholder: "Seu nome" },
      {
        id: "currentBrand",
        label: "Marca atual",
        placeholder: "Qual a marca do seu usado?",
        type: "select",
        options: ["iPhone", "Samsung", "Xiaomi", "Motorola", "LG", "Outra"],
      },
      { id: "currentModel", label: "Modelo atual", placeholder: "Digite só o modelo do usado" },
      {
        id: "condition",
        label: "Estado do aparelho",
        placeholder: "Selecione o estado",
        type: "select",
        options: ["Muito conservado", "Marcas de uso", "Tela trincada", "Bateria ruim", "Com defeito", "Não sei avaliar"],
      },
      {
        id: "desiredType",
        label: "Quer trocar por",
        placeholder: "Que tipo de aparelho você procura?",
        type: "select",
        options: ["iPhone", "Samsung", "Xiaomi", "Motorola", "Melhor custo-benefício", "Ainda não sei"],
      },
      {
        id: "budget",
        label: "Volta em dinheiro",
        placeholder: "Quanto pretende voltar?",
        type: "select",
        options: ["Até R$ 500", "R$ 500 a R$ 1.000", "R$ 1.000 a R$ 2.000", "Depende da avaliação", "Não quero voltar"],
      },
    ],
  },
  compre: {
    title: "Compre",
    subtitle: "Diga o que procura para ver opções revisadas e a loja Shopee.",
    button: "Enviar interesse de compra",
    fields: [
      { id: "name", label: "Nome", placeholder: "Seu nome" },
      {
        id: "brand",
        label: "Preferência",
        placeholder: "Selecione uma preferência",
        type: "select",
        options: ["iPhone", "Samsung", "Xiaomi", "Motorola", "Sem preferência"],
      },
      {
        id: "budget",
        label: "Faixa de preço",
        placeholder: "Qual faixa combina com você?",
        type: "select",
        options: ["Até R$ 800", "R$ 800 a R$ 1.500", "R$ 1.500 a R$ 2.500", "Acima de R$ 2.500", "Quero opções"],
      },
      {
        id: "priority",
        label: "Prioridade",
        placeholder: "O que é mais importante?",
        type: "select",
        options: ["Preço", "Câmera", "Bateria", "Memória", "Desempenho", "Garantia"],
      },
      {
        id: "payment",
        label: "Pagamento",
        placeholder: "Como pretende pagar?",
        type: "select",
        options: ["PIX", "Cartão", "Parcelado", "Dinheiro", "Ainda não sei"],
      },
    ],
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
    "",
    ...flow.fields.map((field) => `${field.label}: ${values[field.id] || "Não informado"}`),
  ];

  return lines.join("\n");
};

export const buildWhatsAppUrl = (variant: LandingVariant, values: QualificationValues) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildQualificationMessage(variant, values))}`;
