import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using DigiStore, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">2. License and Usage</h2>
              <p className="text-muted-foreground">
                Upon purchase, you receive a non-exclusive, non-transferable license to use our digital products for personal use only. You may not reproduce, distribute, or create derivative works without permission.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">3. Payment and Pricing</h2>
              <p className="text-muted-foreground">
                All prices are in USD. Payment is required at the time of purchase. We reserve the right to change prices at any time without notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">4. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, features, and functionality are owned by DigiStore and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                DigiStore shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-3">6. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
