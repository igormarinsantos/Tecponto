import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Repare from "@/pages/Repare";
import Troque from "@/pages/Troque";
import Compre from "@/pages/Compre";
import Garantia from "@/pages/Garantia";
import FAQ from "@/pages/FAQ";
import Contato from "@/pages/Contato";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/repare" element={<Repare />} />
    <Route path="/troque" element={<Troque />} />
    <Route path="/compre" element={<Compre />} />
    <Route path="/garantia" element={<Garantia />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/contato" element={<Contato />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
