import { ExternalLink, Instagram, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/brand/logo-horizontal.png";
import { SHOPEE_STORE_URL } from "@/constants/links";

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
    <footer className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-[1360px]">
        {/* Top row: Navigation and Socials */}
        <div className="flex flex-col items-start justify-between gap-8 pb-10 md:flex-row md:items-center">
          {/* Navigation links */}
          <nav className="grid w-full grid-cols-2 gap-x-8 gap-y-3 text-left text-sm font-semibold text-muted-foreground md:flex md:w-auto md:flex-wrap md:justify-start md:gap-x-8">
            {mainLinks.map((item) =>
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-fit py-1 transition-colors hover:text-foreground group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative w-fit py-1 transition-colors hover:text-foreground group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </NavLink>
              )
            )}
          </nav>

          {/* Socials / Contact */}
          <div className="grid w-full grid-cols-2 gap-x-8 gap-y-3 text-sm text-muted-foreground md:flex md:w-auto md:flex-wrap md:gap-6">
            <a
              href="https://wa.me/5511930642742"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span className="font-semibold">WhatsApp</span>
            </a>
            <a
              href="https://instagram.com/tecpontobrasil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Instagram className="h-4 w-4 text-[#E1306C]" />
              <span className="font-semibold">Instagram</span>
            </a>
            <a
              href={SHOPEE_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <span className="font-semibold">Shopee</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom row: Large full width logo as watermark */}
        <div className="pt-4 flex justify-center items-center">
          <NavLink
            to="/"
            className="w-full flex justify-center opacity-[0.06] hover:opacity-[0.12] transition-opacity duration-500 select-none"
          >
            <img
              src={logo}
              alt="TecPonto"
              className="w-full max-w-[1200px] h-auto object-contain py-4"
            />
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
