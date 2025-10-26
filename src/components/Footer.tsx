import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail("");
      toast.success("Successfully subscribed to newsletter!");
    }, 1000);
  };
  
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              DigiStore
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Premium digital products for continuous learning and growth.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                  required
                />
                <Button type="submit" size="sm" disabled={isSubscribing}>
                  {isSubscribing ? "..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => navigate("/book-summaries")} className="hover:text-foreground transition-colors">Book Summaries</button></li>
              <li><button onClick={() => navigate("/video-courses")} className="hover:text-foreground transition-colors">Video Courses</button></li>
              <li><button onClick={() => navigate("/workbook")} className="hover:text-foreground transition-colors">Workbooks</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => navigate("/about")} className="hover:text-foreground transition-colors">About Us</button></li>
              <li><button onClick={() => navigate("/contact")} className="hover:text-foreground transition-colors">Contact</button></li>
              <li><button onClick={() => navigate("/faq")} className="hover:text-foreground transition-colors">FAQ</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => navigate("/privacy-policy")} className="hover:text-foreground transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate("/terms-of-service")} className="hover:text-foreground transition-colors">Terms of Service</button></li>
              <li><button onClick={() => navigate("/refund-policy")} className="hover:text-foreground transition-colors">Refund Policy</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DigiStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
