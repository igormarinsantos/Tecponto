import { motion } from "framer-motion";
import appleLogo from "@/assets/brands/apple.png";
import samsungLogo from "@/assets/brands/samsung.png";
import motorolaLogo from "@/assets/brands/motorola.png";
import xiaomiLogo from "@/assets/brands/xiaomi.png";
import asusLogo from "@/assets/brands/asus.png";

const brands = [
  { name: "Apple", logo: appleLogo },
  { name: "Samsung", logo: samsungLogo },
  { name: "Motorola", logo: motorolaLogo },
  { name: "Xiaomi", logo: xiaomiLogo },
  { name: "Asus", logo: asusLogo },
];

const BrandCarousel = () => {
  // Duplicar marcas para loop infinito suave
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-8 bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-center text-muted-foreground">
          Atendemos todas as marcas
        </h2>
      </div>

      <div className="relative">
        <div className="flex">
          <motion.div
            className="flex gap-8 items-center"
            animate={{
              x: [0, -1600],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex items-center justify-center min-w-[120px] h-16 px-4 py-2"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-8 w-auto object-contain opacity-40 hover:opacity-70 transition-opacity"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;