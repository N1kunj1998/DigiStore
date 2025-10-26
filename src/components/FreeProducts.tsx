import { useState, useEffect } from "react";
import { LeadCapture } from "./LeadCapture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Users, Clock, Loader2 } from "lucide-react";
import { apiService } from "@/services/api";

interface FreeProduct {
  _id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  type: "pdf" | "video" | "workbook";
  image: string;
  category: string;
  tags: string[];
  downloadCount: number;
  createdAt: string;
}

export const FreeProducts = () => {
  const [freeProducts, setFreeProducts] = useState<FreeProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts({
          minPrice: 0,
          maxPrice: 0,
          limit: 3
        });
        
        if (response.status === 'success') {
          setFreeProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching free products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Download className="h-3 w-3 mr-1" />
              Free Downloads
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Get Started with Our Free Resources</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download our most popular free PDFs and start your journey to peak productivity. 
              No credit card required, just your email address.
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (freeProducts.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Download className="h-3 w-3 mr-1" />
              Free Downloads
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Get Started with Our Free Resources</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No free resources available at the moment. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Download className="h-3 w-3 mr-1" />
            Free Downloads
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Get Started with Our Free Resources</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download our most popular free PDFs and start your journey to peak productivity. 
            No credit card required, just your email address.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {freeProducts.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    <FileText className="h-3 w-3 mr-1" />
                    {product.type.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What's included:</h4>
                  <ul className="space-y-1">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{product.downloadCount.toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Category: {product.category}</span>
                  </div>
                </div>

                <LeadCapture
                  productId={product._id}
                  productTitle={product.title}
                  productDescription={product.description}
                  isModal={true}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Join over 50,000+ professionals who have downloaded our free resources
          </p>
        </div>
      </div>
    </section>
  );
};
