import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

const BookSummaries = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Book Summaries</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Get the key insights from bestselling books in concise, actionable PDF summaries. Save time and learn faster with our expertly crafted book summaries.
          </p>
        </div>
        <ProductGrid filterType="pdf" showFilters={true} />
      </main>
      <Footer />
    </div>
  );
};

export default BookSummaries;
