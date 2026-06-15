import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Check, CheckCheck } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import whatsappAssistant from "@/assets/whatsapp-assistant.png";
import whatsappIcon from "@/assets/whatsapp-icon.svg";

const WhatsAppButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");
  const [offerVisible, setOfferVisible] = useState(false);
  const lastScrollY = useRef(0);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const updateVisibility = () => {
      animationFrame.current = null;
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollY.current;
      const nextOfferVisible = currentScrollY > 200 && currentScrollY > previousScrollY;
      
      setOfferVisible((current) => current === nextOfferVisible ? current : nextOfferVisible);
      
      lastScrollY.current = currentScrollY;
    };

    const handleScroll = () => {
      if (animationFrame.current === null) {
        animationFrame.current = window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
      
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnYpBSh+zPLaizsIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEoPEFWr5O+zYBoGPJPY88p5LQUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45ZFDBFYr+ftrVoXCECY3PLEcSYELIHO8diJOQcZaLvt559NEAxQp+PwtmMcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnYpBSh+zPLaizsIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEoPEFWr5O+zYBoGPJPY88p5LQUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45ZFDBFYr+ftrVoXCECY3PLEcSYELIHO8diJOQcZaLvt559NEAxQp+PwtmMcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnYpBSh+zPLaizsIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEoPEFWr5O+zYBoGPJPY88p5LQUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45ZFDBFYr+ftrVoXCECY3PLEcSYELIHO8diJOQcZaLvt559NEAxQp+PwtmMcBj+a2/LDciUFLIHO8tiJNwgZaLvt55w=');
      audio.play().catch(() => {});
      
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }, 3000);
    
    return () => clearTimeout(notificationTimer);
  }, []);

  const handleSendMessage = () => {
    const encodedMessage = encodeURIComponent(
      message || "Olá! Gostaria de solicitar um orçamento para reparo de celular."
    );
    window.open(`https://wa.me/5511930642742?text=${encodedMessage}`, "_blank");
    setShowPopup(false);
    setMessage("");
  };

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {showNotification && !showPopup && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            style={{
              bottom: offerVisible ? '8.5rem' : '6rem'
            }}
            className="fixed right-3 md:right-6 z-40 bg-white rounded-2xl shadow-xl p-3 md:p-4 max-w-[280px] md:max-w-xs border border-gray-100"
          >
            <div className="flex items-start gap-2 md:gap-3">
              <img 
                src={whatsappAssistant}
                alt="Atendente TecPonto"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-semibold text-gray-900 mb-0.5">
                  TecPonto 👋
                </p>
                <p className="text-[10px] md:text-xs text-gray-600 leading-tight">
                  <span className="font-bold">Atendimento imediato!</span> Fale conosco
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Popup - Real WhatsApp Style */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              bottom: offerVisible ? '10rem' : '6.5rem'
            }}
            className="fixed right-3 md:right-6 z-40 w-[calc(100vw-1.5rem)] max-w-[340px] md:max-w-[380px] rounded-xl overflow-hidden shadow-2xl"
          >
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
              <div className="relative">
                <img 
                  src={whatsappAssistant}
                  alt="TecPonto"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#075E54]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">TecPonto Reparos</p>
                <p className="text-[11px] text-white/80">online agora</p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area - WhatsApp Background */}
            <div 
              className="p-4 min-h-[180px] md:min-h-[200px]"
              style={{
                backgroundColor: '#ECE5DD',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4ccc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              {/* Company Message */}
              <div className="flex gap-2 mb-3">
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] shadow-sm">
                  <p className="text-[13px] text-gray-800 leading-relaxed">
                    Olá! 👋 Sou o atendimento da <span className="font-semibold">TecPonto</span>. Como posso ajudar com o seu celular?
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-500">agora</span>
                    <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                  </div>
                </div>
              </div>
              
              {/* Second Message */}
              <div className="flex gap-2">
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] shadow-sm">
                  <p className="text-[13px] text-gray-800 leading-relaxed">
                    📱 Trabalhamos com <span className="font-semibold">todas as marcas</span>: iPhone, Samsung, Xiaomi, Motorola...
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-500">agora</span>
                    <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center">
                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.button
        onClick={() => {
          setShowPopup(!showPopup);
          setShowNotification(false);
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: showPopup ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          bottom: offerVisible ? '6.5rem' : '1.5rem'
        }}
        className="fixed right-3 md:right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center group transition-all duration-300"
        aria-label="Abrir WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="w-7 h-7 md:w-8 md:h-8 invert group-hover:scale-110 transition-transform" />
        
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
      </motion.button>
    </>
  );
};

export default WhatsAppButton;
