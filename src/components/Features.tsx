import { Download, Clock, Shield, Smartphone, Star, Users } from "lucide-react";

const features = [
  {
    icon: Download,
    title: "Instant Access",
    description: "Immediate access to premium digital resources upon purchase. Streamlined delivery for maximum efficiency."
  },
  {
    icon: Clock,
    title: "Continuous Updates",
    description: "Regular content updates and enhancements ensure your resources remain current and valuable."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security protocols protect your data and transactions with industry-leading encryption."
  },
  {
    icon: Smartphone,
    title: "Multi-Platform Access",
    description: "Seamless access across all devices with responsive design optimized for professional workflows."
  },
  {
    icon: Star,
    title: "Expert-Curated Content",
    description: "Professionally curated resources from industry leaders and subject matter experts."
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Connect with like-minded professionals and access exclusive networking opportunities."
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We deliver enterprise-grade digital learning solutions with features designed for professional success and continuous growth.
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
