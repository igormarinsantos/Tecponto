import { Phone, Mail, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">TecPonto</h3>
            <p className="text-secondary-foreground/80 mb-4">
              Assistência técnica especializada em smartphones com mais de 10 anos de experiência.
            </p>
            <p className="text-sm text-secondary-foreground/60">
              @tecpontobrasil
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <div className="space-y-3">
              <a 
                href="https://wa.me/5511930642742" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>(11) 93064-2742</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@tecponto.com</span>
              </div>
              <a 
                href="https://instagram.com/tecpontobrasil" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span>@tecpontobrasil</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/20 text-center">
          <p className="text-secondary-foreground/80">
            &copy; {new Date().getFullYear()} TecPonto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;