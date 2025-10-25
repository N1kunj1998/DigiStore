import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About DigiStore</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              DigiStore is your premier destination for high-quality digital learning products. We curate and deliver the best educational content to help you learn, grow, and succeed.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              Our mission is to make quality education accessible to everyone. We believe that learning should be convenient, affordable, and effective. That's why we offer a carefully curated selection of digital products including book summaries, video courses, and interactive workbooks.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">What We Offer</h2>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li><strong>Book Summaries:</strong> Get the key insights from bestselling books in minutes</li>
              <li><strong>Video Courses:</strong> Learn from expert instructors with engaging video content</li>
              <li><strong>Workbooks:</strong> Practice what you learn with interactive exercises</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground mb-6">
              We stand behind the quality of our products with instant delivery, secure payments, and exceptional customer support. Join thousands of learners who trust DigiStore for their educational needs.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
