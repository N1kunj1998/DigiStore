import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Order Successful!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your digital products are ready for download.
            </p>
          </div>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent download links to your email address. Check your inbox and spam folder.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Download Your Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the download links in your email to access your digital products instantly.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Lifetime Access</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive free updates and can re-download your products anytime.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
              Need Help? Contact Us
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Success;
