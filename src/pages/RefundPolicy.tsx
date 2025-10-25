import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">30-Day Money-Back Guarantee</h2>
              <p className="text-muted-foreground">
                We stand behind the quality of our products. If you're not completely satisfied with your purchase, we offer a full refund within 30 days of purchase, no questions asked.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">How to Request a Refund</h2>
              <p className="text-muted-foreground mb-3">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Contact our support team at support@digistore.com</li>
                <li>Include your order number and reason for refund (optional)</li>
                <li>We'll process your refund within 5-7 business days</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">Refund Processing</h2>
              <p className="text-muted-foreground">
                Refunds will be issued to the original payment method used for purchase. Please allow 5-7 business days for the refund to appear in your account.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">Non-Refundable Items</h2>
              <p className="text-muted-foreground">
                Please note that certain items may not be eligible for refunds, including products purchased with promotional codes or during special sales (unless otherwise stated).
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">Questions?</h2>
              <p className="text-muted-foreground">
                If you have any questions about our refund policy, please don't hesitate to contact us at support@digistore.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
