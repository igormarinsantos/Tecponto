import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCheck, ExternalLink, Pencil, RotateCcw, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import whatsappAssistant from "@/assets/people/whatsapp-assistant.png";
import { SHOPEE_STORE_URL } from "@/constants/links";
import { buildWhatsAppUrl, qualificationFlow, type QualificationField, type QualificationValues } from "@/features/whatsapp/qualification";
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

const STORAGE_KEY = "tecponto_chat_state";
const STORAGE_VERSION = 2;
const STORAGE_TTL = 30 * 60 * 1000;

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

const fieldAcknowledgement = (field?: QualificationField, answer?: string) => {
  if (!field || !answer) return "";
  const normalized = field.label.toLowerCase();

  if (normalized.includes("modelo")) return `Boa, ${answer}.`;
  if (normalized.includes("problema") || normalized.includes("estado")) return "Entendi.";
  if (normalized.includes("urg")) return "Certo, vou considerar esse prazo.";
  if (normalized.includes("atendimento")) return "Perfeito.";
  if (normalized.includes("trocar") || normalized.includes("volta")) return "Boa, isso já ajuda na pré-avaliação.";

  return "Perfeito.";
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
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const flow = selectedVariant ? qualificationFlow[selectedVariant] : null;
  const activeFields = getFlowFields(selectedVariant, flow?.fields);
  const currentField = activeFields.find((field) => !values[field.id]);
  const isComplete = Boolean(flow && !currentField);
  const answeredFieldCount = activeFields.filter((field) => values[field.id]).length;
  const progressStep = Math.min(answeredFieldCount + 1, activeFields.length);

  const messages = useMemo<ChatMessage[]>(() => {
    const chat: ChatMessage[] = [
      {
        id: "hello",
        from: "assistant",
        text: "Oi, sou o Rodrigo, da TecPonto. O que você gostaria de resolver agora?",
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

    const lastAnsweredField = [...activeFields].reverse().find((field) => values[field.id]);
    const acknowledgement = fieldAcknowledgement(lastAnsweredField, lastAnsweredField ? values[lastAnsweredField.id] : undefined);

    if (currentField) {
      chat.push({
        id: `${currentField.id}-current`,
        from: "assistant",
        text: `${acknowledgement ? `${acknowledgement}\n\n` : ""}${fieldQuestion(currentField.label, currentField.placeholder)}`,
      });
    } else {
      chat.push({
        id: "complete",
        from: "assistant",
        text: `${acknowledgement ? `${acknowledgement} ` : ""}Já organizei tudo para você continuar com um atendente no WhatsApp.`,
      });
    }

    return chat;
  }, [activeFields, currentField, needsClearerIntent, selectedVariant, values]);

  const nextMessage = messages[visibleMessageCount];
  const visibleMessages = messages.slice(0, visibleMessageCount);
  const canAnswer = visibleMessageCount >= messages.length && !isTyping;
  const optionLabels = !selectedVariant
    ? initialOptions.map((option) => option.label)
    : currentField?.options ?? [];
  const expectsOption = optionLabels.length > 0;
  const shouldUseOptionMenu = Boolean(selectedVariant && optionLabels.length > 4);

  useEffect(() => {
    if (!isOpen) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const isFresh = parsed.version === STORAGE_VERSION && Date.now() - parsed.updatedAt < STORAGE_TTL;
        const matchesEntryPoint = !variant || parsed.selectedVariant === variant;

        if (isFresh && matchesEntryPoint) {
          setSelectedVariant(parsed.selectedVariant ?? null);
          setValues(parsed.values ?? {});
          setNeedsClearerIntent(parsed.needsClearerIntent ?? false);
          setVisibleMessageCount(parsed.visibleMessageCount ?? 0);
          setDraft(parsed.draft ?? "");
          return;
        }

        localStorage.removeItem(STORAGE_KEY);
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

  useEffect(() => {
    if (!isOpen) return;

    const stateToSave = {
      version: STORAGE_VERSION,
      updatedAt: Date.now(),
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
        const fieldIndex = activeFields.findIndex((field) => field.id === lastField.id);
        setValues((current) => {
          const updated = { ...current };
          delete updated[lastField.id];
          return updated;
        });
        setVisibleMessageCount(3 + fieldIndex * 2);
        return;
      }
    }

    if (selectedVariant) {
      setSelectedVariant(null);
      setValues({});
      setNeedsClearerIntent(false);
      setVisibleMessageCount(1);
      return;
    }
  };

  const editField = (fieldId: string) => {
    const fieldIndex = activeFields.findIndex((field) => field.id === fieldId);
    if (fieldIndex < 0) return;

    setValues((current) => {
      const updated = { ...current };
      activeFields.slice(fieldIndex).forEach((field) => delete updated[field.id]);
      return updated;
    });
    setVisibleMessageCount(3 + fieldIndex * 2);
    setIsTyping(true);
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
    }, Math.min(800, 260 + (nextMessage?.text?.length ?? 0) * 6));

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
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => modalRef.current?.focus(), 50);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !canAnswer || isComplete || currentField?.options?.length) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [canAnswer, currentField?.id, currentField?.options?.length, isComplete, isOpen]);

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-3 sm:p-6 md:p-10 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-chat-title"
            tabIndex={-1}
            className="flex h-[min(650px,calc(100dvh-24px))] w-full max-w-[430px] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-2xl sm:h-[min(650px,calc(100dvh-64px))] sm:rounded-[2rem]"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center gap-2 bg-[#25292D] px-4 py-3.5 sm:gap-3 sm:px-5 sm:py-4">
              <div className="relative">
                <img src={whatsappAssistant} alt="TecPonto" className="h-11 w-11 rounded-full border-2 border-white/20 object-cover sm:h-12 sm:w-12" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#25292D] bg-[#25D366]" />
              </div>
              <div className="flex-1">
                <p id="whatsapp-chat-title" className="text-sm font-black text-white">Rodrigo - TecPonto</p>
                <p className="text-[11px] font-black uppercase tracking-wide text-primary">
                  {isTyping
                    ? "Digitando..."
                    : selectedVariant && activeFields.length
                      ? isComplete
                        ? "Informações prontas"
                        : `Etapa ${progressStep} de ${activeFields.length}`
                      : "Atendimento online"}
                </p>
              </div>
              {(selectedVariant || Object.keys(values).length > 0) && (
                <button
                  onClick={resetChat}
                  className="flex items-center gap-1 rounded-lg bg-white/5 p-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10 hover:text-white"
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

            {selectedVariant && activeFields.length > 0 && (
              <div className="h-1 shrink-0 bg-[#364047]">
                <motion.div
                  className="h-full bg-[#25D366]"
                  animate={{ width: `${isComplete ? 100 : (answeredFieldCount / activeFields.length) * 100}%` }}
                  transition={{ duration: 0.25 }}
                />
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col bg-[#ece5dd]">
              <div
                ref={scrollAreaRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pr-2 sm:p-4 sm:pr-3"
              >
                {visibleMessages.map((message) => (
                  <div key={message.id} className={message.from === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={`max-w-[86%] px-4 py-3 shadow-sm ${
                        message.from === "user"
                          ? "rounded-[18px] rounded-tr-md bg-[#e7ffdb]"
                          : "rounded-[18px] rounded-tl-md bg-white"
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm font-normal leading-relaxed text-[#111b21] sm:text-[15px]">{message.text}</p>
                      <span className={`mt-1 flex text-[10px] text-gray-400 ${message.from === "user" ? "justify-end gap-1" : "justify-end"}`}>
                        agora
                        {message.from === "user" && <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />}
                      </span>
                    </div>
                  </div>
                ))}

                {nextMessage?.from === "assistant" && isTyping && <TypingBubble />}
              </div>

              {canAnswer && !isComplete && expectsOption && (
                <div className="shrink-0 border-t border-black/5 bg-[#f0f2f5] p-3">
                  <div className="flex items-center gap-2">
                    {canGoBack && (
                      <button
                        onClick={goBack}
                        title="Voltar pergunta"
                        aria-label="Voltar para a pergunta anterior"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    )}

                    {shouldUseOptionMenu ? (
                      <Select key={currentField?.id} onValueChange={answerCurrent}>
                        <SelectTrigger className="h-11 flex-1 rounded-full border-black/[0.08] bg-white px-4 text-sm font-semibold shadow-sm">
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent className="z-[120] max-h-72">
                          {optionLabels.map((option) => (
                            <SelectItem key={option} value={option} className="py-3">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex flex-1 flex-wrap justify-center gap-2">
                        {optionLabels.map((option) => (
                          <button
                            key={option}
                            onClick={() => answerCurrent(option)}
                            className="min-h-10 rounded-full border border-primary/20 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-primary shadow-sm transition-colors hover:bg-primary hover:text-white"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {canAnswer && !isComplete && !expectsOption && (
                <div className="shrink-0 border-t border-black/5 bg-[#f0f2f5] p-3">
                  <div className="flex items-center gap-2">
                    {canGoBack && (
                      <button
                        onClick={goBack}
                        title="Voltar pergunta"
                        aria-label="Voltar para a pergunta anterior"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    )}
                    <div className="flex flex-1 items-center rounded-full border border-black/[0.04] bg-white px-4 py-2 shadow-sm">
                      <input
                        ref={inputRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && answerCurrent(draft)}
                        placeholder="Digite uma resposta..."
                        className="h-8 w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
                      />
                    </div>
                    <button
                      onClick={() => answerCurrent(draft)}
                      disabled={!draft.trim()}
                      aria-label="Enviar resposta"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-all ${
                        draft.trim() ? "bg-[#25D366] hover:bg-[#20BA5A]" : "cursor-not-allowed bg-gray-300"
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {canAnswer && isComplete && (
                <div className="shrink-0 border-t border-black/5 bg-[#f0f2f5] p-3">
                  {activeFields.length > 0 && (
                    <div className="mb-3 max-h-28 space-y-1.5 overflow-y-auto rounded-lg bg-white p-3 shadow-sm">
                      {activeFields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between gap-3 text-xs">
                          <span className="min-w-0 truncate text-gray-600">
                            <strong className="text-[#111b21]">{field.label}:</strong> {values[field.id]}
                          </span>
                          <button
                            type="button"
                            onClick={() => editField(field.id)}
                            className="shrink-0 p-1 text-primary hover:text-primary/80"
                            aria-label={`Alterar ${field.label}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handleFinalAction}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-green-500/20 transition-colors hover:bg-[#20BA5A]"
                  >
                    {selectedVariant === "compre" ? "Abrir loja na Shopee" : "Enviar no WhatsApp"}
                    {selectedVariant === "compre" ? <ExternalLink className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppQualificationModal;
