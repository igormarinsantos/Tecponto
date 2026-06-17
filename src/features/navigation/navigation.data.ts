import perfectPhone from "@/assets/devices/compre.png";
import motoboy from "@/assets/devices/troca.png";
import brokenPhone from "@/assets/devices/reparo.png";
import { SHOPEE_STORE_URL } from "@/constants/links";

export const landingPages = [
  {
    label: "Compre",
    path: SHOPEE_STORE_URL,
    external: true,
    description: "Celulares revisados e prontos para uso",
    image: perfectPhone,
  },
  {
    label: "Troque",
    path: "/troque",
    external: false,
    description: "Use seu aparelho como entrada",
    image: motoboy,
  },
  {
    label: "Repare",
    path: "/repare",
    external: false,
    description: "Conserto rÃ¡pido com garantia",
    image: brokenPhone,
  },
] as const;

export const navPages = [
  { label: "Garantia", path: "/garantia" },
  { label: "FAQ", path: "/faq" },
  { label: "Contato", path: "/contato" },
] as const;
