import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "@/assets/brand/logo-horizontal.png";
import { SHOPEE_STORE_URL } from "@/constants/links";
import { landingPages, navPages } from "@/features/navigation/navigation.data";


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
  const isHome = location.pathname === "/";
  const isHomeTop = isHome && !isScrolled && !isMenuOpen;

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

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed z-50 transition-all duration-200 ${
        isMenuOpen
          ? "left-0 right-0 top-0 bottom-0 h-screen w-screen bg-background border-none shadow-none"
          : isHomeTop
          ? "left-[10px] right-[10px] top-[10px] border-b border-transparent bg-transparent shadow-none"
          : `left-0 right-0 top-0 border-b border-border bg-background/95 shadow-soft backdrop-blur-sm ${isScrolled ? "mx-4 mt-4 rounded-2xl" : ""}`
      }`}
    >
      <nav className={isHome ? "w-full px-5 py-3 md:px-8 lg:px-10 xl:px-12 2xl:px-14" : "container mx-auto px-4 py-3"}>
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

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[80] overflow-y-auto bg-background px-4 pb-8 pt-4 shadow-strong md:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, delay: 0.08, ease: "easeOut" }}
                className="mx-auto flex min-h-[calc(100svh-32px)] max-w-md flex-col gap-4"
              >
              <div className="flex h-14 items-center justify-between rounded-2xl border border-border bg-card px-4 shadow-soft">
                <NavLink to="/" aria-label="TecPonto" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <img src={logo} alt="TecPonto" className="h-3.5" />
                </NavLink>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-foreground"
                  aria-label="Fechar menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {landingPages.map((item) =>
                  item.external ? (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-xl bg-primary/10 px-2 py-4 text-center text-xs font-bold uppercase text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `rounded-xl px-2 py-4 text-center text-xs font-bold uppercase transition-colors ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-foreground"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )
                )}
              </div>

              <div className="my-2 h-px bg-border" />

              {navPages.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-4 text-left font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
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
                className="mt-auto h-12 w-full border-primary/30 font-bold uppercase text-primary hover:bg-primary/10 hover:text-primary"
              >
                <a href={SHOPEE_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                  Nossa Loja
                </a>
              </Button>

              <Button
                asChild
                className="h-12 w-full bg-primary font-bold uppercase text-primary-foreground hover:bg-primary/90"
              >
                <NavLink to="/contato" onClick={() => setIsMenuOpen(false)}>Quero Orçamento</NavLink>
              </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
