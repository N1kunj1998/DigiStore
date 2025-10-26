import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/services/api";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: "pdf" | "video" | "workbook";
  image: string;
  category: string;
  tags: string[];
  isActive: boolean;
}

interface ProductRecommendationsProps {
  currentProductId: string;
  currentProductType: "pdf" | "video" | "workbook";
}

export const ProductRecommendations = ({ currentProductId, currentProductType }: ProductRecommendationsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        if (response.status === 'success' && response.data?.products) {
          // Filter out current product and get same type products
          const filteredProducts = response.data.products
            .filter((product: Product) => 
              product._id !== currentProductId && 
              product.type === currentProductType &&
              product.isActive
            )
            .slice(0, 3); // Show only 3 recommendations
          setProducts(filteredProducts);
        }
      } catch (err) {
        console.error('Error fetching recommended products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentProductId, currentProductType]);

  if (products.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>You Might Also Like</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
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
      </CardContent>
    </Card>
  );
};