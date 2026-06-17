import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, ExternalLink, Send, X, RotateCcw, ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import whatsappAssistant from "@/assets/whatsapp-assistant.png";
import { buildWhatsAppUrl, qualificationFlow, type QualificationField, type QualificationValues } from "@/lib/qualification";
import type { LandingVariant } from "@/types/landing";

type WhatsAppQualificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant?: LandingVariant;
};

type ChatMessage = {
  id: string;
  from: "assistant" | "user";
  text: string;
  label?: string;
};

const SHOPEE_STORE_URL = "https://shopee.com.br/";

const initialOptions: Array<{ label: string; value: LandingVariant }> = [
  { label: "Quero comprar", value: "compre" },
  { label: "Quero trocar", value: "troque" },
  { label: "Quero reparar", value: "repare" },
];

const detectVariant = (text: string): LandingVariant | null => {
  const normalized = text.toLowerCase();
  if (normalized.includes("compr") || normalized.includes("venda") || normalized.includes("aparelho")) return "compre";
  if (normalized.includes("troc") || normalized.includes("entrada") || normalized.includes("usado")) return "troque";
  if (normalized.includes("repar") || normalized.includes("consert") || normalized.includes("arrum") || normalized.includes("quebr")) return "repare";
  return null;
};

const variantIntro: Record<LandingVariant, string> = {
  compre: "Boa. Para comprar, o caminho mais rapido e seguro e pela nossa loja na Shopee.",
  troque: "Perfeito. Vou fazer uma pre-avaliacao simples do seu usado para o atendimento continuar no WhatsApp.",
  repare: "Certo. Vou pegar o essencial para o tecnico entender o caso e continuar com voce no WhatsApp.",
};

const fieldQuestion = (label: string, placeholder: string) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("nome")) return "Como posso te chamar?";
  if (normalized.includes("marca")) return placeholder;
  if (normalized.includes("modelo")) return `${placeholder}. Pode mandar bem curto.`;
  if (normalized.includes("problema")) return "O que aconteceu com o aparelho?";
  if (normalized.includes("urg")) return "Pra quando voce precisa resolver?";
  if (normalized.includes("atendimento")) return "Como voce prefere ser atendido?";
  if (normalized.includes("estado")) return "Como esta o aparelho hoje?";
  if (normalized.includes("quer trocar")) return "Que tipo de aparelho voce quer pegar?";
  if (normalized.includes("volta")) return "Sobre volta em dinheiro, qual opcao combina melhor?";

  return placeholder;
};

const TypingBubble = () => (
  <div className="flex justify-start">
    <div className="rounded-[18px] rounded-tl-md bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
      </div>
    </div>
  </div>
);

const getFlowFields = (selectedVariant: LandingVariant | null, flowFields: QualificationField[] = []) =>
  selectedVariant === "compre" ? [] : flowFields;

const WhatsAppQualificationModal = ({ isOpen, onClose, variant }: WhatsAppQualificationModalProps) => {
  const [selectedVariant, setSelectedVariant] = useState<LandingVariant | null>(variant ?? null);
  const [values, setValues] = useState<QualificationValues>({});
  const [draft, setDraft] = useState("");
  const [needsClearerIntent, setNeedsClearerIntent] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [visibleMessageCount, setVisibleMessageCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const flow = selectedVariant ? qualificationFlow[selectedVariant] : null;
  const activeFields = getFlowFields(selectedVariant, flow?.fields);
  const currentField = activeFields.find((field) => !values[field.id]);
  const isComplete = Boolean(flow && !currentField);

  const messages = useMemo<ChatMessage[]>(() => {
    const chat: ChatMessage[] = [
      {
        id: "hello",
        from: "assistant",
        text: "Oi, que bom te ter aqui. Eu sou o Rodrigo, da TecPonto.",
      },
      {
        id: "start",
        from: "assistant",
        text: "Vou te direcionar rapidinho. O que voce gostaria de fazer agora?",
      },
    ];

    if (!selectedVariant) {
      if (needsClearerIntent) {
        chat.push({
          id: "intent-clearer",
          from: "assistant",
          text: "So para eu te mandar para o lugar certo: voce quer comprar, trocar ou reparar?",
        });
      }
      return chat;
    }

    const selectedFlow = qualificationFlow[selectedVariant];

    chat.push({
      id: "selected-variant",
      from: "user",
      text: selectedFlow.title,
      label: "Quero atendimento para",
    });
    chat.push({
      id: "variant-intro",
      from: "assistant",
      text: variantIntro[selectedVariant],
    });

    if (selectedVariant === "compre") {
      chat.push({
        id: "shopee-link",
        from: "assistant",
        text: `Temos nossa loja na Shopee. Voce pode ver os aparelhos disponiveis por aqui: ${SHOPEE_STORE_URL}`,
      });
      return chat;
    }

    activeFields.forEach((field) => {
      if (!values[field.id]) return;

      chat.push({
        id: `${field.id}-question`,
        from: "assistant",
        text: fieldQuestion(field.label, field.placeholder),
      });
      chat.push({
        id: `${field.id}-answer`,
        from: "user",
        text: values[field.id],
        label: field.label,
      });
    });

    if (currentField) {
      chat.push({
        id: `${currentField.id}-current`,
        from: "assistant",
        text: fieldQuestion(currentField.label, currentField.placeholder),
      });
    } else {
      chat.push({
        id: "complete",
        from: "assistant",
        text: "Fechado. Ja organizei as informacoes para continuar com um atendente no WhatsApp.",
      });
    }

    return chat;
  }, [activeFields, currentField, needsClearerIntent, selectedVariant, values]);

  const nextMessage = messages[visibleMessageCount];
  const visibleMessages = messages.slice(0, visibleMessageCount);
  const canAnswer = visibleMessageCount >= messages.length && !isTyping;

  const STORAGE_KEY = "tecponto_chat_state";

  // Load state on mount/open
  useEffect(() => {
    if (!isOpen) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedVariant(parsed.selectedVariant ?? null);
        setValues(parsed.values ?? {});
        setNeedsClearerIntent(parsed.needsClearerIntent ?? false);
        setVisibleMessageCount(parsed.visibleMessageCount ?? 0);
        setDraft(parsed.draft ?? "");
        return;
      }
    } catch (e) {
      console.error("Error loading chat state", e);
    }

    // Default if no saved state
    setSelectedVariant(variant ?? null);
    setValues({});
    setDraft("");
    setNeedsClearerIntent(false);
    setVisibleMessageCount(0);
  }, [isOpen, variant]);

  // Save state to localStorage on changes
  useEffect(() => {
    if (!isOpen) return;

    const stateToSave = {
      selectedVariant,
      values,
      needsClearerIntent,
      visibleMessageCount,
      draft,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [isOpen, selectedVariant, values, needsClearerIntent, visibleMessageCount, draft]);

  const resetChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSelectedVariant(variant ?? null);
    setValues({});
    setDraft("");
    setNeedsClearerIntent(false);
    setVisibleMessageCount(0);
    setIsTyping(true);
  };

  const canGoBack = Boolean(selectedVariant);

  const goBack = () => {
    if (!canAnswer) return;

    if (selectedVariant && activeFields.length > 0) {
      const answeredFields = activeFields.filter((f) => values[f.id]);
      if (answeredFields.length > 0) {
        const lastField = answeredFields[answeredFields.length - 1];
        setValues((current) => {
          const updated = { ...current };
          delete updated[lastField.id];
          return updated;
        });
        setVisibleMessageCount((prev) => Math.max(0, prev - 2));
        return;
      }
    }

    if (selectedVariant) {
      setSelectedVariant(null);
      setValues({});
      setNeedsClearerIntent(false);
      setVisibleMessageCount(2);
      return;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (visibleMessageCount >= messages.length) {
      setIsTyping(false);
      return;
    }

    if (nextMessage?.from === "user") {
      setIsTyping(false);
      const timer = window.setTimeout(() => {
        setVisibleMessageCount((current) => Math.min(current + 1, messages.length));
      }, 140);
      return () => window.clearTimeout(timer);
    }

    setIsTyping(true);
    const timer = window.setTimeout(() => {
      setVisibleMessageCount((current) => Math.min(current + 1, messages.length));
    }, Math.min(1150, 420 + (nextMessage?.text?.length ?? 0) * 9));

    return () => window.clearTimeout(timer);
  }, [isOpen, messages.length, nextMessage?.from, nextMessage?.text?.length, visibleMessageCount]);

  useEffect(() => {
    if (!isOpen) return;
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessageCount, isTyping, canAnswer, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const answerCurrent = (answer: string) => {
    const cleanedAnswer = answer.trim();
    if (!cleanedAnswer || !canAnswer) return;

    if (!selectedVariant) {
      const detected = detectVariant(cleanedAnswer);
      if (!detected) {
        setNeedsClearerIntent(true);
        setDraft("");
        setVisibleMessageCount(0);
        return;
      }

      setSelectedVariant(detected);
      setNeedsClearerIntent(false);
      setDraft("");
      return;
    }

    if (!currentField) return;
    setValues((current) => ({ ...current, [currentField.id]: cleanedAnswer }));
    setDraft("");
  };

  const handleFinalAction = () => {
    if (!selectedVariant) return;

    if (selectedVariant === "compre") {
      window.open(SHOPEE_STORE_URL, "_blank");
      localStorage.removeItem(STORAGE_KEY);
      onClose();
      return;
    }

    window.open(buildWhatsAppUrl(selectedVariant, values), "_blank");
    localStorage.removeItem(STORAGE_KEY);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-6 md:p-10 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="flex h-[min(650px,calc(100dvh-64px))] w-full max-w-[430px] flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center gap-3 bg-[#25292D] px-5 py-4">
              <div className="relative">
                <img src={whatsappAssistant} alt="TecPonto" className="h-12 w-12 rounded-full border-2 border-white/20 object-cover" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#25292D] bg-[#25D366]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white">Rodrigo - TecPonto</p>
                <p className="text-[11px] font-black uppercase tracking-wide text-primary">
                  {isTyping ? "Digitando..." : "Atendimento online"}
                </p>
              </div>
              {(selectedVariant || Object.keys(values).length > 0) && (
                <button
                  onClick={resetChat}
                  className="p-1.5 text-white/80 hover:text-white flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors bg-white/5 hover:bg-white/10 rounded-lg"
                  title="Reiniciar conversa"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </button>
              )}
              <button onClick={onClose} className="p-1 text-white/80 hover:text-white" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col bg-[#ece5dd]">
              <div ref={scrollAreaRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 pr-3">
                {visibleMessages.map((message) => (
                  <div key={message.id} className={message.from === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={`max-w-[86%] px-4 py-3 shadow-sm ${
                        message.from === "user"
                          ? "rounded-[18px] rounded-tr-md bg-[#e7ffdb]"
                          : "rounded-[18px] rounded-tl-md bg-white"
                      }`}
                    >
                      <p className="whitespace-pre-line text-[15px] font-normal leading-relaxed text-[#111b21]">{message.text}</p>
                      <span className={`mt-1 flex text-[10px] text-gray-400 ${message.from === "user" ? "justify-end gap-1" : "justify-end"}`}>
                        agora
                        {message.from === "user" && <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />}
                      </span>
                    </div>
                  </div>
                ))}

                {nextMessage?.from === "assistant" && isTyping && <TypingBubble />}
              </div>

              {/* Botões de Opção Rápidas estilo WhatsApp Business */}
              {canAnswer && !isComplete && (
                <div className="px-3 py-2 flex flex-wrap gap-2 justify-center bg-transparent max-h-40 overflow-y-auto shrink-0 border-t border-black/[0.03]">
                  {!selectedVariant ? (
                    initialOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => answerCurrent(option.label)}
                        className="px-3.5 py-2 rounded-full border border-primary/20 bg-white text-xs font-bold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-white transition-all duration-200"
                      >
                        {option.label}
                      </button>
                    ))
                  ) : currentField?.options?.length ? (
                    currentField.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => answerCurrent(option)}
                        className="px-3.5 py-2 rounded-full border border-primary/20 bg-white text-xs font-bold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-white transition-all duration-200"
                      >
                        {option}
                      </button>
                    ))
                  ) : null}
                </div>
              )}

              {/* Input Bar no estilo WhatsApp Real (Sempre Visível) */}
              <div className="shrink-0 bg-[#f0f2f5] p-3 border-t border-black/5">
                {isComplete ? (
                  <button onClick={handleFinalAction} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-green-500/20 transition-colors hover:bg-[#20BA5A]">
                    {selectedVariant === "compre" ? "Abrir loja na Shopee" : "Enviar no WhatsApp"}
                    {selectedVariant === "compre" ? <ExternalLink className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    {canGoBack && (
                      <button
                        onClick={goBack}
                        title="Voltar pergunta"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white border border-black/[0.08] text-gray-600 shadow-sm transition-all hover:bg-gray-100 active:scale-95"
                      >
                        <ArrowLeft className="h-4.5 w-4.5" />
                      </button>
                    )}
                    <div className="flex flex-1 items-center bg-white rounded-full px-4 py-2 shadow-sm border border-black/[0.04]">
                      <input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && canAnswer && answerCurrent(draft)}
                        disabled={!canAnswer}
                        placeholder={
                          !canAnswer
                            ? "Rodrigo está digitando..."
                            : !selectedVariant || currentField?.options?.length
                              ? "Escolha uma opção ou digite..."
                              : "Digite uma resposta..."
                        }
                        className="h-8 w-full bg-transparent text-[14px] font-medium outline-none disabled:text-gray-400 placeholder:text-gray-400"
                      />
                    </div>
                    <button
                      onClick={() => canAnswer && answerCurrent(draft)}
                      disabled={!canAnswer || !draft.trim()}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-all ${
                        canAnswer && draft.trim()
                          ? "bg-[#25D366] hover:bg-[#20BA5A] scale-100"
                          : "bg-gray-300 scale-95 cursor-not-allowed"
                      }`}
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppQualificationModal;
