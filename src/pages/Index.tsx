import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FreeProducts } from "@/components/FreeProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <FreeProducts />
      <ProductGrid searchTerm={searchTerm} />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
