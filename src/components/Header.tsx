import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "@/assets/logo-horizontal.png";
import perfectPhone from "@/assets/compre.png";
import motoboy from "@/assets/troca.png";
import brokenPhone from "@/assets/reparo.png";
import { SHOPEE_STORE_URL } from "@/lib/links";

const landingPages = [
  { label: "Compre", path: SHOPEE_STORE_URL, external: true, description: "Celulares revisados e prontos para uso", image: perfectPhone },
  { label: "Troque", path: "/troque", description: "Use seu aparelho como entrada", image: motoboy },
  { label: "Repare", path: "/repare", description: "Conserto rápido com garantia", image: brokenPhone },
];

const navPages = [
  { label: "Garantia", path: "/garantia" },
  { label: "FAQ", path: "/faq" },
  { label: "Contato", path: "/contato" },
];

const pageClass = (isTransparent: boolean) => ({ isActive }: { isActive: boolean }) =>
  `px-2.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors ${
    isActive
      ? isTransparent ? "bg-white text-primary" : "bg-primary text-primary-foreground"
      : isTransparent ? "text-white hover:bg-white/15" : "text-foreground hover:bg-primary/10 hover:text-primary"
  }`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomeTop = location.pathname === "/" && !isScrolled && !isMenuOpen;

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSolutionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 50;
      setIsScrolled((current) => current === nextIsScrolled ? current : nextIsScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200 ${
        isHomeTop
          ? "border-transparent bg-transparent shadow-none"
          : `border-border bg-background/95 shadow-soft backdrop-blur-sm ${isScrolled ? "mx-4 mt-4 rounded-2xl" : ""}`
      }`}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:min-w-[330px]">
            <NavLink to="/" aria-label="TecPonto" className="flex items-center">
              <img
                src={logo}
                alt="TecPonto"
                className={`h-3.5 md:h-4 transition duration-200 ${
                  isHomeTop ? "brightness-0 invert" : ""
                }`}
              />
            </NavLink>

            <div className="hidden sm:flex items-center gap-1">
              {landingPages.map((item) =>
                item.external ? (
                  <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" className={pageClass(isHomeTop)({ isActive: false })}>
                    {item.label}
                  </a>
                ) : (
                  <NavLink key={item.path} to={item.path} className={pageClass(isHomeTop)}>
                    {item.label}
                  </NavLink>
                )
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsSolutionsOpen((open) => !open)}
                aria-expanded={isSolutionsOpen}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isHomeTop ? "text-white hover:bg-white/15" : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                Soluções
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSolutionsOpen ? "rotate-180" : ""}`} />
              </button>

              <div
                data-header-solutions-menu
                className={`absolute left-1/2 top-full z-50 mt-5 w-[760px] -translate-x-1/2 rounded-2xl border border-border bg-background p-5 shadow-strong transition-[opacity,visibility] duration-150 ${
                  isSolutionsOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">Soluções TecPonto</p>
                    <p className="text-xs text-muted-foreground">Escolha o caminho que resolve seu celular hoje.</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
                    Compre. Troque. Repare.
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {landingPages.map((item) => {
                    const cardContent = (
                      <>
                        <div className="h-28 bg-primary/5">
                          <img
                            src={item.image}
                            alt={item.label}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <span className="block text-sm font-bold text-foreground">{item.label}</span>
                          <span className="mt-1 block min-h-[40px] text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </>
                    );

                    const cardClass = "group/card overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-soft";

                    return item.external ? (
                      <a
                        key={item.path}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-header-solution-link={item.label}
                        onMouseDown={() => setIsSolutionsOpen(false)}
                        onClick={() => setIsSolutionsOpen(false)}
                        className={cardClass}
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        data-header-solution-link={item.label}
                        onMouseDown={() => setIsSolutionsOpen(false)}
                        onClick={() => setIsSolutionsOpen(false)}
                        className={cardClass}
                      >
                        {cardContent}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>

            {navPages.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? isHomeTop ? "bg-white text-primary" : "bg-primary/10 text-primary"
                      : isHomeTop ? "text-white hover:bg-white/15" : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex md:min-w-[320px] justify-end gap-2">
            <Button
              asChild
              variant="outline"
              className={`font-bold uppercase ${
                isHomeTop
                  ? "border-white/55 bg-white/10 text-white hover:bg-white hover:text-primary"
                  : "border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <a href={SHOPEE_STORE_URL} target="_blank" rel="noopener noreferrer">
                Nossa Loja
              </a>
            </Button>
            <Button
              asChild
              className={`font-bold uppercase transition-colors ${
                isHomeTop
                  ? "bg-white text-primary hover:bg-white/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <NavLink to="/contato">Quero Orçamento</NavLink>
            </Button>
          </div>

          <button
            className={`md:hidden rounded-lg p-2 ${isHomeTop ? "bg-white/10 text-white" : "bg-primary/10 text-foreground"}`}
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
                {landingPages.map((item) =>
                  item.external ? (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-primary/10 px-2 py-3 text-center text-xs font-bold uppercase text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
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
                  )
                )}
              </div>

              <div className="h-px bg-border my-2" />

              {navPages.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-left hover:text-primary hover:bg-primary/10 transition-colors font-medium py-3 px-4 rounded-lg ${
                      isActive ? "text-primary bg-primary/10" : "text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <Button
                asChild
                variant="outline"
                className="border-primary/30 text-primary w-full font-bold uppercase hover:bg-primary/10 hover:text-primary mt-2"
              >
                <a href={SHOPEE_STORE_URL} target="_blank" rel="noopener noreferrer">
                  Nossa Loja
                </a>
              </Button>

              <Button
                asChild
                className="bg-primary text-primary-foreground w-full font-bold uppercase hover:bg-primary/90"
              >
                <NavLink to="/contato">Quero Orçamento</NavLink>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
