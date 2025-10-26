import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, FileText, Video, BookOpen } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useActivityTracking } from "@/hooks/useActivityTracking";

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
  };
  
  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center ${image ? 'hidden' : ''}`}>
            <Icon className="h-16 w-16 text-primary/40" />
          </div>
          <Badge className="absolute top-3 right-3 gap-1">
            <Icon className="h-3 w-3" />
            {typeLabels[type]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-sm text-muted-foreground">one-time</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full gap-2" size="lg" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
