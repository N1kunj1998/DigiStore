import { Download, Clock, Shield, Smartphone, Star, Users } from "lucide-react";

const features = [
  {
    icon: Download,
    title: "Instant Access",
    description: "Get immediate access to all your digital products after purchase. No waiting, no delays."
  },
  {
    icon: Clock,
    title: "Lifetime Updates",
    description: "Receive free updates and improvements to your products for life. Your investment grows with you."
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Your payment information is protected with bank-level security. Shop with confidence."
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access your content anywhere, anytime. All products are optimized for mobile devices."
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Carefully curated content from industry experts. Quality you can trust and rely on."
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join our community of learners and get support from fellow students and instructors."
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose DigiStore?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best digital learning experience with features that matter to you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
