import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">Find answers to common questions about our products and services.</p>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I access my purchased products?</AccordionTrigger>
              <AccordionContent>
                After purchase, you'll receive an email with download links. You can also access all your products from your account dashboard at any time.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards, debit cards, and PayPal. All transactions are secure and encrypted.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I get a refund?</AccordionTrigger>
              <AccordionContent>
                Yes! We offer a 30-day money-back guarantee on all products. If you're not satisfied, contact our support team for a full refund.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Are the products downloadable?</AccordionTrigger>
              <AccordionContent>
                Yes, all our products are instantly downloadable. PDFs, videos, and workbooks can be saved to your device for offline access.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Do you offer bulk discounts?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer special pricing for bulk purchases and corporate licenses. Contact our sales team for more information.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>How often is new content added?</AccordionTrigger>
              <AccordionContent>
                We add new products weekly. Subscribe to our newsletter to stay updated on the latest releases and exclusive offers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
