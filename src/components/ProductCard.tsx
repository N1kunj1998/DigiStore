import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, FileText, Video, BookOpen } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useActivityTracking } from "@/hooks/useActivityTracking";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  type: "pdf" | "video" | "workbook";
  image: string;
}

const typeIcons = {
  pdf: FileText,
  video: Video,
  workbook: BookOpen,
};

const typeLabels = {
  pdf: "PDF Summary",
  video: "Video Course",
  workbook: "Workbook",
};

export const ProductCard = ({ id, title, description, price, type, image }: ProductCardProps) => {
  const Icon = typeIcons[type];
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { trackProductView, trackAddToCart } = useActivityTracking();
  const { toast } = useToast();

  const handleCardClick = () => {
    trackProductView(id, title, price);
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackAddToCart(id, title, price, 1);
    addToCart({ 
      id: `local_${Date.now()}`, 
      productId: id, 
      title, 
      price, 
      image, 
      type 
    });
    
    toast({
      title: "Added to Cart!",
      description: `${title} has been added to your cart.`,
      duration: 3000,
    });
  };
  
  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center ${image ? 'hidden' : ''}`}>
            <div className="text-center">
              <Icon className="h-20 w-20 text-primary/60 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Preview</p>
            </div>
          </div>
          <Badge className="absolute top-3 right-3 gap-1.5 px-2 py-1 bg-background/90 backdrop-blur-sm border border-border/50">
            <Icon className="h-3 w-3" />
            {typeLabels[type]}
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-3xl font-bold text-primary">${price}</span>
          <div className="text-muted-foreground">
            <p className="text-sm">one-time</p>
            <p className="text-xs">purchase</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full gap-2 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
          size="lg" 
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
