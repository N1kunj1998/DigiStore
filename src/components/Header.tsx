import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/")}
          >
            DigiStore
          </h1>
          <nav className="hidden md:flex gap-6">
            <button onClick={() => navigate("/book-summaries")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Book Summaries
            </button>
            <button onClick={() => navigate("/video-courses")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Video Courses
            </button>
            <button onClick={() => navigate("/workbook")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Workbooks
            </button>
            <button onClick={() => navigate("/about")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </button>
            <button onClick={() => navigate("/faq")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </button>
            <button onClick={() => navigate("/contact")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </form>
          
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <nav className="space-y-2">
            <button 
              onClick={() => { navigate("/book-summaries"); closeMobileMenu(); }} 
              className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Book Summaries
            </button>
            <button 
              onClick={() => { navigate("/video-courses"); closeMobileMenu(); }} 
              className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Video Courses
            </button>
            <button 
              onClick={() => { navigate("/workbook"); closeMobileMenu(); }} 
              className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Workbooks
            </button>
            <button 
              onClick={() => { navigate("/about"); closeMobileMenu(); }} 
              className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => { navigate("/faq"); closeMobileMenu(); }} 
              className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </button>
            <button 
              onClick={() => { navigate("/contact"); closeMobileMenu(); }} 
              className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
