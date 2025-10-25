import { LeadCapture } from "./LeadCapture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Users, Clock } from "lucide-react";

const freeProducts = [
  {
    id: "free-1",
    title: "The Ultimate Productivity Checklist",
    description: "A comprehensive 5-page checklist covering the most effective productivity techniques used by top performers.",
    benefits: ["Immediate implementation", "Proven techniques", "Actionable steps"],
    downloads: "12,847",
    rating: 4.9
  },
  {
    id: "free-2", 
    title: "Goal Setting Framework Template",
    description: "A step-by-step template to set and achieve your most important goals using the SMART framework.",
    benefits: ["SMART goal template", "Progress tracking", "Success metrics"],
    downloads: "8,923",
    rating: 4.8
  },
  {
    id: "free-3",
    title: "Daily Habit Tracker",
    description: "A simple yet powerful habit tracking system to build consistency and achieve your long-term goals.",
    benefits: ["30-day tracker", "Habit stacking guide", "Motivation tips"],
    downloads: "15,234",
    rating: 4.9
  }
];

export const FreeProducts = () => {
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
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    <FileText className="h-3 w-3 mr-1" />
                    PDF
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What's included:</h4>
                  <ul className="space-y-1">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{product.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>★ {product.rating}</span>
                  </div>
                </div>

                <LeadCapture
                  productId={product.id}
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
