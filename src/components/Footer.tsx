import { ExternalLink, Instagram, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo-horizontal.png";
import { SHOPEE_STORE_URL } from "@/lib/links";

const mainLinks = [
  { label: "Compre", path: SHOPEE_STORE_URL, external: true },
  { label: "Troque", path: "/troque" },
  { label: "Repare", path: "/repare" },
  { label: "Garantia", path: "/garantia" },
  { label: "FAQ", path: "/faq" },
  { label: "Contato", path: "/contato" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <NavLink to="/" className="inline-flex">
              <img src={logo} alt="TecPonto" className="h-5 w-auto" />
            </NavLink>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Compre. Troque. Repare.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-foreground">
            {mainLinks.map((item) =>
              item.external ? (
                <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.path} to={item.path} className="transition-colors hover:text-primary">
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} TecPonto. Todos os direitos reservados.</p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/5511930642742"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href="https://instagram.com/tecpontobrasil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a
              href={SHOPEE_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              Shopee
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
