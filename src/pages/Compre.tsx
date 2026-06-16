import { useEffect } from "react";
import { SHOPEE_STORE_URL } from "@/lib/links";

const Compre = () => {
  useEffect(() => {
    window.location.replace(SHOPEE_STORE_URL);
  }, []);

  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-sm font-bold uppercase text-primary">Redirecionando</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          Abrindo nossa loja na Shopee...
        </h1>
      </div>
    </main>
  );
};

export default Compre;
