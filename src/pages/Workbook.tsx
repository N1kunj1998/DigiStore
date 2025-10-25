import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

const Workbook = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Workbooks</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Practice makes perfect. Our interactive workbooks help you apply what you learn with exercises, templates, and practical activities.
          </p>
        </div>
        <ProductGrid filterType="workbook" showFilters={true} />
      </main>
      <Footer />
    </div>
  );
};

export default Workbook;
