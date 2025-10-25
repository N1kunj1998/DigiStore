import { ProductCard } from "./ProductCard";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const products = [
  {
    id: "1",
    title: "Atomic Habits - Complete Summary",
    description: "Master the art of habit formation with this comprehensive summary of James Clear's bestseller",
    price: 9.99,
    type: "pdf" as const,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Deep Work Mastery Course",
    description: "5-hour video course on implementing Cal Newport's deep work principles in your daily life",
    price: 49.99,
    type: "video" as const,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Productivity Workbook 2024",
    description: "Interactive workbook with exercises, templates, and frameworks for peak productivity",
    price: 19.99,
    type: "workbook" as const,
    image: "/placeholder.svg",
  },
  {
    id: "4",
    title: "Thinking Fast and Slow - Key Insights",
    description: "Essential takeaways from Daniel Kahneman's groundbreaking work on decision-making",
    price: 12.99,
    type: "pdf" as const,
    image: "/placeholder.svg",
  },
  {
    id: "5",
    title: "Communication Skills Masterclass",
    description: "Complete video training on effective communication in business and personal relationships",
    price: 59.99,
    type: "video" as const,
    image: "/placeholder.svg",
  },
  {
    id: "6",
    title: "Goal Setting & Achievement Workbook",
    description: "Proven frameworks and exercises to set meaningful goals and achieve them consistently",
    price: 24.99,
    type: "workbook" as const,
    image: "/placeholder.svg",
  },
];

interface ProductGridProps {
  filterType?: "pdf" | "video" | "workbook";
  showFilters?: boolean;
}

export const ProductGrid = ({ filterType, showFilters = false }: ProductGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<"price" | "title" | "newest">("newest");

  // Filter products based on type, search term, and price range
  const filteredProducts = products
    .filter((product) => {
      if (filterType && product.type !== filterType) return false;
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return 0; // Keep original order
      }
    });

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {filterType ? `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Products` : "Featured Digital Products"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Carefully curated content to help you learn faster and achieve more
          </p>
        </div>

        {showFilters && (
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === "newest" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("newest")}
                >
                  Newest
                </Button>
                <Button
                  variant={sortBy === "price" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("price")}
                >
                  Price
                </Button>
                <Button
                  variant={sortBy === "title" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("title")}
                >
                  Name
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Price Range: ${priceRange[0]} - ${priceRange[1]}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1 max-w-xs"
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};
