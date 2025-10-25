import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { LeadCapture } from "@/components/LeadCapture";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Video, BookOpen, Star, Download, Gift } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const products = [
  {
    id: "1",
    title: "Atomic Habits - Complete Summary",
    description: "Master the art of habit formation with this comprehensive summary of James Clear's bestseller",
    fullDescription: "This comprehensive 50-page summary breaks down every chapter of Atomic Habits, providing actionable insights and practical frameworks you can implement immediately. Learn about the four laws of behavior change, habit stacking, and environmental design.",
    price: 9.99,
    type: "pdf" as const,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Deep Work Mastery Course",
    description: "5-hour video course on implementing Cal Newport's deep work principles in your daily life",
    fullDescription: "Five hours of premium video content teaching you how to achieve deep work in our distracted world. Includes practical techniques, real-world examples, and downloadable resources.",
    price: 49.99,
    type: "video" as const,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Productivity Workbook 2024",
    description: "Interactive workbook with exercises, templates, and frameworks for peak productivity",
    fullDescription: "100+ pages of exercises, templates, and proven frameworks. Includes daily planning sheets, goal-setting templates, and productivity tracking systems.",
    price: 19.99,
    type: "workbook" as const,
    image: "/placeholder.svg",
  },
  {
    id: "4",
    title: "Thinking Fast and Slow - Key Insights",
    description: "Essential takeaways from Daniel Kahneman's groundbreaking work on decision-making",
    fullDescription: "A detailed summary of one of the most influential books on human cognition. Learn about System 1 and System 2 thinking, cognitive biases, and better decision-making.",
    price: 12.99,
    type: "pdf" as const,
    image: "/placeholder.svg",
  },
  {
    id: "5",
    title: "Communication Skills Masterclass",
    description: "Complete video training on effective communication in business and personal relationships",
    fullDescription: "Master the art of communication with 8 hours of professional training. Covers verbal communication, body language, active listening, and persuasion techniques.",
    price: 59.99,
    type: "video" as const,
    image: "/placeholder.svg",
  },
  {
    id: "6",
    title: "Goal Setting & Achievement Workbook",
    description: "Proven frameworks and exercises to set meaningful goals and achieve them consistently",
    fullDescription: "Transform your goal-setting approach with this comprehensive workbook. Includes the SMART framework, vision boarding exercises, and quarterly review templates.",
    price: 24.99,
    type: "workbook" as const,
    image: "/placeholder.svg",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
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
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>

          <div>
            <Badge className="mb-4" variant="secondary">
              {getIcon()}
              <span className="ml-2 uppercase">{product.type}</span>
            </Badge>
            
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {product.description}
            </p>

            <div className="text-3xl font-bold text-primary mb-8">
              ${product.price}
            </div>

            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/cart")}>
                View Cart
              </Button>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">About this product</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.fullDescription}
              </p>
              
              {/* Product Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What's included:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    Instant download after purchase
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Lifetime access to updates
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Mobile-friendly format
                  </li>
                </ul>
              </div>
            </div>

            {/* Lead Magnet Section */}
            <div className="border-t pt-8">
              <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Get a Free Sample First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Not sure if this is right for you? Download our free preview and see the quality for yourself.
                  </p>
                  <LeadCapture
                    productId={`sample-${product.id}`}
                    productTitle={`Free Sample: ${product.title}`}
                    productDescription={`Get a free preview of ${product.title} to see if it's right for you`}
                    isModal={true}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ProductRecommendations 
        currentProductId={product.id} 
        currentProductType={product.type} 
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;
