import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "@/assets/logo-horizontal.png";

const landingPages = [
  { label: "Compre", path: "/compre", description: "Celulares revisados e prontos para uso" },
  { label: "Troque", path: "/troque", description: "Use seu aparelho como entrada" },
  { label: "Repare", path: "/repare", description: "Conserto rápido com garantia" },
];

const sectionItems = [
  { label: "Soluções", id: "services" },
  { label: "Garantia", id: "warranty" },
  { label: "Provas", id: "testimonials" },
  { label: "Dúvidas", id: "faq" },
  { label: "Contato", id: "whatsapp-chat" },
];

const pageClass = ({ isActive }: { isActive: boolean }) =>
  `px-2.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-foreground hover:bg-primary/10 hover:text-primary"
  }`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const animationFrame = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentLanding = useMemo(
    () => landingPages.some((item) => item.path === location.pathname) ? location.pathname : "/repare",
    [location.pathname],
  );

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateHeaderState = () => {
      animationFrame.current = null;
      const nextIsScrolled = window.scrollY > 50;
      setIsScrolled((current) => current === nextIsScrolled ? current : nextIsScrolled);

      const currentSection = sectionItems.find(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
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
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    const runScroll = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    if (landingPages.some((item) => item.path === location.pathname)) {
      runScroll();
    } else {
      navigate("/repare");
      window.setTimeout(runScroll, 80);
    }

    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft transition-[margin,border-radius] duration-200 ${
        isScrolled ? "mx-4 mt-4 rounded-2xl" : ""
      }`}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:min-w-[330px]">
            <NavLink to={currentLanding} aria-label="TecPonto" className="flex items-center">
              <img src={logo} alt="TecPonto" className="h-3.5 md:h-4" />
            </NavLink>

            <div className="hidden sm:flex items-center gap-1 border-l border-border pl-3">
              {landingPages.map((item) => (
                <NavLink key={item.path} to={item.path} className={pageClass}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-1">
            <div className="relative group">
              <button
                type="button"
                onClick={() => scrollToSection("services")}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === "services" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                Soluções
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-[520px] -translate-x-1/2 rounded-xl border border-border bg-background p-3 opacity-0 shadow-strong transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="grid grid-cols-3 gap-2">
                  {landingPages.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className="rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span className="block text-sm font-bold text-foreground">{item.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {sectionItems.slice(1).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex md:min-w-[190px] justify-end">
            <Button
              onClick={() => scrollToSection("whatsapp-chat")}
              className="bg-primary text-primary-foreground font-bold uppercase hover:bg-primary/90 transition-colors"
            >
              Quero Orçamento
            </Button>
          </div>

          <button
            className="md:hidden text-foreground bg-primary/10 p-2 rounded-lg"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-lg rounded-xl mt-4 shadow-strong border border-border">
            <div className="flex flex-col gap-2 p-4">
              <div className="grid grid-cols-3 gap-2">
                {landingPages.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `text-center rounded-lg px-2 py-3 text-xs font-bold uppercase transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-foreground"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className="h-px bg-border my-2" />

              {sectionItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left hover:text-primary hover:bg-primary/10 transition-colors font-medium py-3 px-4 rounded-lg ${
                    activeSection === item.id ? "text-primary bg-primary/10" : "text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <Button
                onClick={() => scrollToSection("whatsapp-chat")}
                className="bg-primary text-primary-foreground w-full font-bold uppercase hover:bg-primary/90 mt-2"
              >
                Quero Orçamento
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
