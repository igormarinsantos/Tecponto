import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BadgeAlert, BatteryCharging, CheckCheck, CircleCheck, CircleHelp, Clock3, Droplets, ExternalLink, FileText, Gauge, MoreHorizontal, Pencil, PlugZap, RotateCcw, ScanLine, Send, ShoppingBag, Smartphone, Sparkles, Wrench, X, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import appleLogo from "@/assets/brands/apple.png";
import chatBackground from "@/assets/whatsapp/chat-background.png";
import rodrigoWelcomeGif from "@/assets/whatsapp/rodrigo-welcome.gif";
import whatsappAssistant from "@/assets/people/whatsapp-assistant.png";
import { SHOPEE_STORE_URL } from "@/constants/links";
import { trackCampaignEvent, withCampaignParameters } from "@/features/analytics/campaign";
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
const STORAGE_VERSION = 6;
const STORAGE_TTL = 30 * 60 * 1000;
const TIMESTAMP_COOKIE_KEY = "tecponto_chat_timestamps";

const getSavedMessageTimes = (): Record<string, number> => {
  const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${TIMESTAMP_COOKIE_KEY}=`));
  if (!cookie) return {};

  try {
    return JSON.parse(decodeURIComponent(cookie.slice(TIMESTAMP_COOKIE_KEY.length + 1)));
  } catch {
    return {};
  }
};

const saveMessageTimesCookie = (messageTimes: Record<string, number>) => {
  const expires = new Date(Date.now() + STORAGE_TTL).toUTCString();
  document.cookie = `${TIMESTAMP_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(messageTimes))}; expires=${expires}; path=/; SameSite=Lax`;
};

const clearMessageTimesCookie = () => {
  document.cookie = `${TIMESTAMP_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

const formatMessageTime = (timestamp?: number) => new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
}).format(timestamp ?? Date.now());

const renderMessageText = (text: string) => text.split("\n").map((line, lineIndex) => (
  <span key={`${line}-${lineIndex}`}>
    {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={`${part}-${partIndex}`} className="font-black">{part.slice(2, -2)}</strong>
        : part,
    )}
    {lineIndex < text.split("\n").length - 1 && <br />}
  </span>
));

const initialOptions: Array<{ label: string; value: LandingVariant; icon: LucideIcon }> = [
  { label: "Reparar meu celular", value: "repare", icon: Wrench },
  { label: "Trocar meu usado", value: "troque", icon: RotateCcw },
  { label: "Comprar um celular", value: "compre", icon: ShoppingBag },
];

const optionVisuals: Record<string, { icon?: LucideIcon; iconClassName?: string; logo?: string; mark?: string; markClassName?: string }> = {
  iPhone: { logo: appleLogo },
  Samsung: { mark: "S", markClassName: "bg-[#1428A0] text-white" },
  Motorola: { mark: "M", markClassName: "bg-[#E60000] text-white" },
  Xiaomi: { mark: "mi", markClassName: "bg-[#FF6900] text-white" },
  "Outro aparelho": { icon: MoreHorizontal },
  "Tela quebrada": { icon: Smartphone, iconClassName: "text-red-500" },
  Bateria: { icon: BatteryCharging, iconClassName: "text-amber-500" },
  "Não carrega": { icon: PlugZap, iconClassName: "text-sky-600" },
  Molhou: { icon: Droplets, iconClassName: "text-cyan-600" },
  Travando: { icon: Gauge, iconClassName: "text-orange-600" },
  "Outro problema": { icon: Wrench, iconClassName: "text-[#FE5000]" },
  "Quero resolver hoje": { icon: Clock3, iconClassName: "text-[#FE5000]" },
  "Quero um orçamento": { icon: FileText, iconClassName: "text-[#FE5000]" },
  "Posso ir nos próximos dias": { icon: Clock3 },
  "Muito conservado": { icon: Sparkles },
  "Marcas de uso": { icon: Smartphone },
  "Tela trincada": { icon: ScanLine },
  "Com defeito": { icon: BadgeAlert },
  "Não sei avaliar": { icon: CircleHelp },
  "Usar como entrada": { icon: RotateCcw, iconClassName: "text-[#FE5000]" },
  "Trocar por outro iPhone": { logo: appleLogo },
  "Só descobrir quanto vale": { icon: ScanLine, iconClassName: "text-[#FE5000]" },
};

const detectVariant = (text: string): LandingVariant | null => {
  const normalized = text.toLowerCase();
  if (normalized.includes("compr") || normalized.includes("venda") || normalized.includes("aparelho")) return "compre";
  if (normalized.includes("troc") || normalized.includes("entrada") || normalized.includes("usado")) return "troque";
  if (normalized.includes("repar") || normalized.includes("consert") || normalized.includes("arrum") || normalized.includes("quebr")) return "repare";
  return null;
};

const variantIntro: Record<LandingVariant, string> = {
  compre: "Boa escolha! 🛍️ Temos aparelhos **revisados** e com **garantia** na nossa Shopee.",
  troque: "Perfeito! 🔄 São só **três respostas rápidas** para eu encaminhar sua pré-avaliação.",
  repare: "Certo! 🔧 Me responda **três coisas rápidas** e eu preparo seu atendimento.",
};

const fieldQuestion = (label: string, placeholder: string) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("nome")) return "**Como posso te chamar?**";
  if (normalized.includes("marca") || normalized.includes("aparelho")) return `**${placeholder}**`;
  if (normalized.includes("problema")) return "🔧 **Qual é o problema principal do aparelho?**";
  if (normalized.includes("prazo")) return "⏱️ **Para quando você quer resolver isso?**";
  if (normalized.includes("atendimento")) return "**Como você prefere ser atendido?**";
  if (normalized.includes("estado")) return "📱 **Como ele está hoje?**";
  if (normalized.includes("quer trocar")) return "**Qual aparelho você quer pegar?**";
  if (normalized.includes("volta")) return "**Qual opção combina melhor com sua volta em dinheiro?**";

  return `**${placeholder}**`;
};

const fieldAcknowledgement = (field?: QualificationField, answer?: string) => {
  if (!field || !answer) return "";
  const normalized = field.label.toLowerCase();

  if (normalized.includes("aparelho")) return `Boa! 📱 **${answer}** anotado.`;
  if (normalized.includes("problema") || normalized.includes("estado")) return "**Entendi.** ✅";
  if (normalized.includes("prazo")) return "Certo! ⏱️ Vou considerar esse **prazo**.";
  if (normalized.includes("atendimento")) return "Perfeito.";
  if (normalized.includes("trocar") || normalized.includes("volta")) return "Boa, isso já ajuda na pré-avaliação.";

  return "Perfeito.";
};

const TypingBubble = ({ messageId }: { messageId: string }) => (
  <div className="flex justify-start">
    <motion.div
      layoutId={`assistant-bubble-${messageId}`}
      className="w-[62px] rounded-[18px] rounded-tl-md bg-white px-4 py-3 shadow-sm"
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
    >
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
      </div>
    </motion.div>
  </div>
);

const getFlowFields = (selectedVariant: LandingVariant | null, flowFields: QualificationField[] = []) =>
  selectedVariant === "compre" ? [] : flowFields;

const shouldAnimateAssistantMessage = (message: ChatMessage | undefined, messageCount: number) => Boolean(
  message?.from === "assistant"
  && (message.id.endsWith("-current") || message.id === "intent-clearer" || (message.id === "hello" && messageCount === 1)),
);

const WhatsAppQualificationModal = ({ isOpen, onClose, variant }: WhatsAppQualificationModalProps) => {
  const [selectedVariant, setSelectedVariant] = useState<LandingVariant | null>(variant ?? null);
  const [values, setValues] = useState<QualificationValues>({});
  const [draft, setDraft] = useState("");
  const [needsClearerIntent, setNeedsClearerIntent] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [typedMessageLength, setTypedMessageLength] = useState(0);
  const [visibleMessageCount, setVisibleMessageCount] = useState(0);
  const [messageTimes, setMessageTimes] = useState<Record<string, number>>({});
  const [customOption, setCustomOption] = useState<string | null>(null);
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
        text: "Oi! 👋 Sou o **Rodrigo**, da **TecPonto**. Em até **3 respostas**, eu organizo seu próximo passo.",
      },
    ];

    if (!selectedVariant) {
      if (needsClearerIntent) {
        chat.push({
          id: "intent-clearer",
          from: "assistant",
          text: "💬 **Para eu te ajudar sem perder tempo: você quer comprar, trocar ou reparar?**",
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
        text: `🛍️ Você pode ver os aparelhos disponíveis na nossa **loja Shopee**: ${SHOPEE_STORE_URL}`,
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
      const completionText = selectedVariant === "repare"
        ? "✅ **Pronto.** Vou encaminhar seu pedido. **Se quiser acelerar o orçamento**, envie uma foto do aparelho no WhatsApp."
        : "✅ **Pronto.** Vou encaminhar sua pré-avaliação. **Se quiser acelerar a análise**, envie uma foto do aparelho no WhatsApp.";

      chat.push({
        id: "complete",
        from: "assistant",
        text: `${acknowledgement ? `${acknowledgement} ` : ""}${completionText}`,
      });
    }

    return chat;
  }, [activeFields, currentField, needsClearerIntent, selectedVariant, values]);

  const nextMessage = messages[visibleMessageCount];
  const visibleMessages = messages.slice(0, visibleMessageCount);
  const canAnswer = visibleMessageCount >= messages.length && !isTyping && !typingMessageId;
  const optionLabels = !selectedVariant
    ? initialOptions.map((option) => option.label)
    : currentField?.options ?? [];
  const expectsOption = optionLabels.length > 0;

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
          setIsResuming(Object.keys(parsed.values ?? {}).length > 0);
          setVisibleMessageCount(parsed.visibleMessageCount ?? 0);
          setDraft(parsed.draft ?? "");
          setMessageTimes(parsed.messageTimes ?? getSavedMessageTimes());
          setCustomOption(parsed.customOption ?? null);
          setTypingMessageId(null);
          setTypedMessageLength(0);
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
    setIsResuming(false);
    setVisibleMessageCount(0);
    setMessageTimes(getSavedMessageTimes());
    setCustomOption(null);
    setTypingMessageId(null);
    setTypedMessageLength(0);
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
      messageTimes,
      customOption,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    saveMessageTimesCookie(messageTimes);
  }, [isOpen, selectedVariant, values, needsClearerIntent, visibleMessageCount, draft, messageTimes, customOption]);

  const resetChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    clearMessageTimesCookie();
    setSelectedVariant(variant ?? null);
    setValues({});
    setDraft("");
    setNeedsClearerIntent(false);
    setIsResuming(false);
    setVisibleMessageCount(0);
    setMessageTimes({});
    setCustomOption(null);
    setTypingMessageId(null);
    setTypedMessageLength(0);
    setIsTyping(true);
  };

  const canGoBack = Boolean(selectedVariant);

  const goBack = () => {
    if (!canAnswer) return;
    setCustomOption(null);

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
    setCustomOption(null);
    setIsTyping(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (visibleMessageCount >= messages.length) {
      setIsTyping(false);
      return;
    }

    const shouldTypeNextMessage = shouldAnimateAssistantMessage(nextMessage, messages.length);

    if (nextMessage?.from === "user" || !shouldTypeNextMessage) {
      setIsTyping(false);
      const timer = window.setTimeout(() => {
        if (nextMessage) {
          setMessageTimes((current) => current[nextMessage.id] ? current : { ...current, [nextMessage.id]: Date.now() });
        }
        setVisibleMessageCount((current) => Math.min(current + 1, messages.length));
      }, nextMessage?.from === "user" ? 140 : 80);
      return () => window.clearTimeout(timer);
    }

    setIsTyping(true);
    const timer = window.setTimeout(() => {
      if (nextMessage) {
        setMessageTimes((current) => current[nextMessage.id] ? current : { ...current, [nextMessage.id]: Date.now() });
        setTypingMessageId(nextMessage.id);
        setTypedMessageLength(0);
      }
      setVisibleMessageCount((current) => Math.min(current + 1, messages.length));
    }, Math.min(560, 180 + (nextMessage?.text?.length ?? 0) * 4));

    return () => window.clearTimeout(timer);
  }, [isOpen, messages.length, nextMessage?.from, nextMessage?.text?.length, visibleMessageCount]);

  useEffect(() => {
    if (!typingMessageId) return;

    const message = messages.find((item) => item.id === typingMessageId);
    if (!message) {
      setTypingMessageId(null);
      return;
    }

    if (typedMessageLength >= message.text.length) {
      setTypingMessageId(null);
      return;
    }

    const timer = window.setTimeout(() => {
      setTypedMessageLength((current) => Math.min(current + 2, message.text.length));
    }, 14);

    return () => window.clearTimeout(timer);
  }, [messages, typedMessageLength, typingMessageId]);

  useEffect(() => {
    if (!isOpen) return;
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessageCount, isTyping, canAnswer, isOpen, typedMessageLength]);

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
    if (!isOpen || !canAnswer || isComplete || (currentField?.options?.length && !customOption)) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [canAnswer, currentField?.id, currentField?.options?.length, customOption, isComplete, isOpen]);

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
      setIsResuming(false);
      setDraft("");
      setCustomOption(null);
      return;
    }

    if (!currentField) return;
    setValues((current) => ({ ...current, [currentField.id]: cleanedAnswer }));
    setIsResuming(false);
    setDraft("");
    setCustomOption(null);
  };

  const selectOption = (option: string) => {
    if (option.toLowerCase().startsWith("outro")) {
      setCustomOption(option);
      setDraft("");
      return;
    }

    answerCurrent(option);
  };

  const submitCustomOption = () => {
    if (!customOption || !draft.trim()) return;
    answerCurrent(`${customOption}: ${draft.trim()}`);
  };

  const handleFinalAction = () => {
    if (!selectedVariant) return;

    if (selectedVariant === "compre") {
      trackCampaignEvent("bio_shopee_open", { placement: "qualification_modal" });
      window.open(withCampaignParameters(SHOPEE_STORE_URL), "_blank");
      localStorage.removeItem(STORAGE_KEY);
      onClose();
      return;
    }

    trackCampaignEvent("bio_whatsapp_start", { modality: selectedVariant, completed_fields: Object.keys(values).length });
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
                    ? "Rodrigo está digitando..."
                    : selectedVariant && activeFields.length
                      ? isComplete
                        ? "Pronto para continuar"
                        : `${progressStep} de ${activeFields.length} etapas`
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

            <div
              className="flex min-h-0 flex-1 flex-col bg-[#f8f3e9]"
              style={{ backgroundImage: `url(${chatBackground})`, backgroundSize: "360px auto", backgroundRepeat: "repeat" }}
            >
              <div
                ref={scrollAreaRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pr-2 sm:p-4 sm:pr-3"
              >
                {visibleMessages.map((message) => {
                  const isBeingTyped = message.from === "assistant" && typingMessageId === message.id;
                  const visibleText = isBeingTyped ? message.text.slice(0, typedMessageLength) : message.text;

                  return (
                    <div key={message.id} className={message.from === "user" ? "flex justify-end" : "flex justify-start"}>
                      <motion.div
                        layoutId={message.from === "assistant" ? `assistant-bubble-${message.id}` : undefined}
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                        className={`max-w-[86%] px-4 py-3 shadow-sm ${
                          message.from === "user"
                            ? "rounded-[18px] rounded-tr-md bg-[#e7ffdb]"
                            : "rounded-[18px] rounded-tl-md bg-white"
                        }`}
                      >
                        <p className="text-sm font-normal leading-relaxed text-[#111b21] sm:text-[15px]">{renderMessageText(visibleText)}</p>
                        {!isBeingTyped && (
                          <span className={`mt-1 flex text-[10px] text-gray-400 ${message.from === "user" ? "justify-end gap-1" : "justify-end"}`}>
                            {formatMessageTime(messageTimes[message.id])}
                            {message.from === "user" && <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" aria-label="Visualizada" />}
                          </span>
                        )}
                      </motion.div>
                    </div>
                  );
                })}

                {nextMessage?.from === "assistant" && isTyping && <TypingBubble messageId={nextMessage.id} />}

                {!selectedVariant && canAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-[136px] overflow-hidden rounded-[18px] rounded-tl-md bg-[#FE5000] shadow-sm"
                  >
                    <img
                      src={rodrigoWelcomeGif}
                      alt="Rodrigo, da TecPonto, pronto para ajudar"
                      className="aspect-[3/4] w-full object-cover object-top"
                    />
                  </motion.div>
                )}
              </div>

              {canAnswer && !isComplete && expectsOption && !customOption && (
                <div className="shrink-0 border-t border-black/5 bg-[#f0f2f5] p-3">
                  <p className="mb-2 text-center text-[10px] font-black uppercase tracking-wide text-[#667781]">
                    {isResuming ? "Você já está quase lá. Escolha uma opção para continuar" : "Escolha uma opção para avançar"}
                  </p>
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

                    <div className={`${selectedVariant ? "grid grid-cols-2" : "flex flex-col"} flex-1 gap-2`}>
                      {optionLabels.map((option, optionIndex) => {
                        const initialOption = !selectedVariant ? initialOptions.find((item) => item.label === option) : null;
                        const OptionIcon = initialOption?.icon ?? optionVisuals[option]?.icon;
                        const optionIconClassName = optionVisuals[option]?.iconClassName;
                        const optionLogo = optionVisuals[option]?.logo;
                        const optionMark = optionVisuals[option]?.mark;
                        const optionMarkClassName = optionVisuals[option]?.markClassName;

                        return (
                          <button
                            key={option}
                              onClick={() => selectOption(option)}
                            className={`${selectedVariant ? "min-h-9 px-3 py-1.5 text-xs" : "min-h-11 px-4 py-2 text-[11px]"} ${selectedVariant && optionLabels.length % 2 !== 0 && optionIndex === optionLabels.length - 1 ? "col-span-2" : ""} inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-white text-center font-bold uppercase tracking-wide text-primary shadow-sm shadow-primary/10 transition-all hover:-translate-y-px hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
                          >
                            {optionLogo && <img src={optionLogo} alt="" aria-hidden="true" className="h-4 w-4 shrink-0 object-contain" />}
                            {optionMark && <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-black lowercase ${optionMarkClassName}`}>{optionMark}</span>}
                            {OptionIcon && <OptionIcon className={`h-4 w-4 shrink-0 ${optionIconClassName ?? ""}`} aria-hidden="true" />}
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {canAnswer && !isComplete && (!expectsOption || Boolean(customOption)) && (
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
                        onKeyDown={(event) => event.key === "Enter" && (customOption ? submitCustomOption() : answerCurrent(draft))}
                        placeholder={customOption ? `Digite ${currentField?.label.toLowerCase() ?? "a resposta"}...` : "Digite uma resposta..."}
                        className="h-8 w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
                      />
                    </div>
                    <button
                      onClick={() => customOption ? submitCustomOption() : answerCurrent(draft)}
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
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-green-500/25 transition-all hover:-translate-y-px hover:bg-[#20BA5A] hover:shadow-xl hover:shadow-green-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                  >
                    {selectedVariant === "compre"
                      ? "Abrir a loja na Shopee"
                      : selectedVariant === "repare"
                        ? "Enviar pedido no WhatsApp"
                        : "Enviar para pré-avaliação"}
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
