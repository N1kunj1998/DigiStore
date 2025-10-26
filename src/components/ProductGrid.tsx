import { ProductCard } from "./ProductCard";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2, X } from "lucide-react";
import { apiService } from "@/services/api";

interface Product {
  _id: string;
  title: string;
  description: string;
  fullDescription?: string;
  price: number;
  type: "pdf" | "video" | "workbook";
  image: string;
  category: string;
  tags: string[];
  isActive: boolean;
}

interface ProductGridProps {
  filterType?: "pdf" | "video" | "workbook";
  showFilters?: boolean;
  searchTerm?: string | null;
}

export const ProductGrid = ({ filterType, showFilters = false, searchTerm }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [sortBy, setSortBy] = useState<"price" | "title" | "newest">("newest");

  // Update local search term when prop changes
  useEffect(() => {
    if (searchTerm !== null) {
      setLocalSearchTerm(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let response;
        if (localSearchTerm && localSearchTerm.trim()) {
          // Use search API when there's a search term
          response = await apiService.searchProducts(localSearchTerm.trim(), { type: filterType });
        } else {
          // Use regular products API with type filtering
          const params = filterType ? { type: filterType } : {};
          response = await apiService.getProducts(params);
        }
        
        if (response.status === 'success' && response.data?.products) {
          setProducts(response.data.products);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filterType, localSearchTerm]);

  // Filter products based on price range (search and type filtering is done by backend)
  const filteredProducts = products
    .filter((product) => {
      if (!product.isActive) return false;
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
            {localSearchTerm ? 
              `Search Results for "${localSearchTerm}"` : 
              filterType ? `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Products` : 
              "Featured Digital Products"
            }
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {localSearchTerm ? 
              `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching your search` :
              "Carefully curated content to help you learn faster and achieve more"
            }
          </p>
          {localSearchTerm && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setLocalSearchTerm("")}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
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
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  id={product._id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  type={product.type}
                  image={product.image}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
