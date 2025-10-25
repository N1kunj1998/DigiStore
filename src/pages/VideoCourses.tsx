import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

const VideoCourses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Video Courses</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Master new skills with our comprehensive video courses. Learn from industry experts with high-quality, engaging video content at your own pace.
          </p>
        </div>
        <ProductGrid filterType="video" showFilters={true} />
      </main>
      <Footer />
    </div>
  );
};

export default VideoCourses;
