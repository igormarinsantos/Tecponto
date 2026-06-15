import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/logo-horizontal.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const animationFrame = useRef<number | null>(null);

  const menuItems = useMemo(
    () => [
      { label: "Início", id: "hero" },
      { label: "Soluções", id: "services" },
      { label: "Avaliações", id: "testimonials" },
      { label: "FAQ", id: "faq" },
      { label: "Contato", id: "whatsapp-chat" },
    ],
    [],
  );

  useEffect(() => {
    const updateHeaderState = () => {
      animationFrame.current = null;

      const nextIsScrolled = window.scrollY > 50;
      setIsScrolled((current) => current === nextIsScrolled ? current : nextIsScrolled);

      const currentSection = menuItems.find(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection((current) =>
          current === currentSection.id ? current : currentSection.id,
        );
      }
    };

    const handleScroll = () => {
      if (animationFrame.current === null) {
        animationFrame.current = window.requestAnimationFrame(updateHeaderState);
      }
    };

    updateHeaderState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [menuItems]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft transition-all duration-300 ${
        isScrolled ? "mx-4 mt-4 rounded-2xl" : ""
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between md:justify-center md:gap-12">
          <div className="flex items-center md:absolute md:left-8">
            <img src={logo} alt="TecPonto" className="h-3 md:h-4" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative text-foreground hover:text-primary transition-colors font-medium py-2 px-4 group"
              >
                <span className={`relative z-10 ${activeSection === item.id ? "text-primary" : ""}`}>
                  {item.label}
                </span>
                <motion.span
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: activeSection === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </button>
            ))}
          </div>

          <Button
            onClick={() => scrollToSection("whatsapp-chat")}
            className="hidden md:flex bg-primary text-primary-foreground font-bold md:absolute md:right-8 uppercase hover:bg-primary/90 transition-colors"
          >
            Quero Orçamento
          </Button>

          <button
            className="md:hidden text-foreground bg-primary/10 p-2 rounded-lg"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-card/95 backdrop-blur-lg rounded-xl mt-4 shadow-strong border border-border"
            >
              <div className="flex flex-col gap-2 p-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left hover:text-primary hover:bg-primary/10 transition-all font-medium py-3 px-4 rounded-lg ${
                      activeSection === item.id ? "text-primary bg-primary/10" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-2 border-t border-border mt-2">
                  <Button
                    onClick={() => scrollToSection("whatsapp-chat")}
                    className="bg-primary text-primary-foreground w-full font-bold uppercase hover:bg-primary/90"
                  >
                    Quero Orçamento
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    @tecpontobrasil
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
