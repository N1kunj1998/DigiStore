import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { LeadCapture } from "@/components/LeadCapture";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Video, BookOpen, Star, Download, Gift, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        if (response.status === 'success' && response.data?.product) {
          setProduct(response.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading product...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getIcon = () => {
    switch (product.type) {
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "workbook":
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      type: product.type
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                {getIcon()}
              </div>
            </div>
            
            {/* Product Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                {getIcon()}
                {product.type.toUpperCase()}
              </Badge>
              <Badge variant="outline">{product.category}</Badge>
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{product.description}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold">${product.price}</span>
                <span className="text-muted-foreground">one-time purchase</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              
              <Button variant="outline" size="lg" className="w-full gap-2">
                <Gift className="h-5 w-5" />
                Gift This Product
              </Button>
            </div>

            {/* Product Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-primary" />
                  <span>Instant download after purchase</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-primary" />
                  <span>High-quality content</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-primary" />
                  <span>Lifetime access</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">About This Product</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg leading-relaxed">
              {product.fullDescription || product.description}
            </p>
          </div>
        </div>

        {/* Lead Capture */}
        <div className="mb-12">
          <LeadCapture />
        </div>

        {/* Product Recommendations */}
        <ProductRecommendations 
          currentProductId={product._id}
          currentProductType={product.type}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;