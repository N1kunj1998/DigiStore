import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { LeadCapture } from "@/components/LeadCapture";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Video, BookOpen, Star, Download, Gift, Loader2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <div className="container py-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-primary/20"></div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Loading Product</h2>
                <p className="text-muted-foreground">Please wait while we fetch the product details...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">Product Not Found</h1>
                <p className="text-xl text-muted-foreground">
                  {error || "The product you're looking for doesn't exist or has been removed."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate("/")} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/book-summaries")}>
                  Browse Products
                </Button>
              </div>
            </div>
          </div>
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
      id: `local_${Date.now()}`,
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      type: product.type
    });
    
    toast({
      title: "Added to Cart!",
      description: `${product.title} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
          >
            Home
          </Button>
          <span>/</span>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
          >
            Products
          </Button>
          <span>/</span>
          <span className="text-foreground font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center ${product.image ? 'hidden' : ''}`}>
                <div className="text-center">
                  <div className="mb-4">{getIcon()}</div>
                  <p className="text-sm text-muted-foreground">Product Preview</p>
                </div>
              </div>
            </div>
            
            {/* Product Tags */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="gap-2 px-3 py-1.5 text-sm font-medium">
                {getIcon()}
                {product.type.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="px-3 py-1.5 text-sm">{product.category}</Badge>
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="px-3 py-1.5 text-sm">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">{product.title}</h1>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-5xl font-bold text-primary">${product.price}</span>
                <div className="text-muted-foreground">
                  <p className="text-sm">one-time purchase</p>
                  <p className="text-xs">No recurring fees</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button size="lg" className="w-full gap-3 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={handleAddToCart}>
                <ShoppingCart className="h-6 w-6" />
                Add to Cart - ${product.price}
              </Button>
              
              <Button variant="outline" size="lg" className="w-full gap-3 h-12 text-base border-2 hover:bg-muted/50 transition-all duration-300">
                <Gift className="h-5 w-5" />
                Gift This Product
              </Button>
            </div>

            {/* Product Features */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <Download className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Instant Download</p>
                    <p className="text-sm text-muted-foreground">Access immediately after purchase</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <Star className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">High-Quality Content</p>
                    <p className="text-sm text-muted-foreground">Professionally crafted materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <Gift className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Lifetime Access</p>
                    <p className="text-sm text-muted-foreground">Keep forever, no expiration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">30</div>
                <div className="text-sm text-muted-foreground">Day Guarantee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">About This Product</h2>
            <div className="prose prose-lg prose-gray max-w-none">
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8 border border-border/50 shadow-lg">
                <div className="text-lg leading-relaxed whitespace-pre-line">
                  {product.fullDescription || product.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* What's Included */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">Comprehensive Summary</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <Star className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">Key Insights & Takeaways</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">Actionable Strategies</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <Gift className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">Bonus Materials</span>
                  </div>
                </CardContent>
              </Card>

              {/* Format Details */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {getIcon()}
                    Format Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">Format:</span>
                    <Badge variant="secondary">{product.type.toUpperCase()}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">Pages:</span>
                    <span className="text-sm">15-25 pages</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">Reading Time:</span>
                    <span className="text-sm">30-45 minutes</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">File Size:</span>
                    <span className="text-sm">2-5 MB</span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Reviews */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Customer Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">4.9</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">Based on 1,247 reviews</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Excellent</span>
                        <span>89%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '89%'}}></div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Good</span>
                        <span>8%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '8%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">How do I access my purchase?</h3>
                  <p className="text-muted-foreground">After completing your purchase, you'll receive an email with a download link. You can also access your files anytime from your account dashboard.</p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Can I share this with others?</h3>
                  <p className="text-muted-foreground">This is a personal license for your individual use. Sharing or distributing the content violates our terms of service.</p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">What if I'm not satisfied?</h3>
                  <p className="text-muted-foreground">We offer a 30-day money-back guarantee. If you're not completely satisfied, contact us for a full refund.</p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Is this a complete book?</h3>
                  <p className="text-muted-foreground">This is a comprehensive summary that captures all the key concepts, insights, and actionable strategies from the original book in an easy-to-digest format.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Lead Capture */}
        <div className="mb-16">
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