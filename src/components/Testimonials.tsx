import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager",
    content: "The Atomic Habits summary saved me hours of reading while giving me all the key insights I needed to implement better habits.",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Entrepreneur",
    content: "The Deep Work course completely transformed how I approach my daily tasks. The productivity gains have been incredible.",
    rating: 5,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    content: "These workbooks are game-changers. The templates and exercises helped me organize my goals and actually achieve them.",
    rating: 5,
    avatar: "ER"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Software Engineer",
    content: "The communication masterclass improved my presentation skills dramatically. Highly recommend for anyone in tech.",
    rating: 5,
    avatar: "DT"
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Life Coach",
    content: "The quality of these digital products is outstanding. They're well-structured, actionable, and worth every penny.",
    rating: 5,
    avatar: "LP"
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Business Owner",
    content: "I've purchased multiple products and each one has delivered value. The instant access and lifetime updates are fantastic.",
    rating: 5,
    avatar: "JW"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their learning with our digital products
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
