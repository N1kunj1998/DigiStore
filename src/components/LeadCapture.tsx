import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Mail, User, Phone, Building } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "./Analytics";

interface LeadCaptureProps {
  productId: string;
  productTitle: string;
  productDescription: string;
  trigger?: React.ReactNode;
  isModal?: boolean;
}

export const LeadCapture = ({ 
  productId, 
  productTitle, 
  productDescription, 
  trigger,
  isModal = false 
}: LeadCaptureProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    interests: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const interestOptions = [
    "Productivity",
    "Leadership",
    "Personal Development",
    "Business Strategy",
    "Communication",
    "Goal Setting"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDownloaded(true);
      
      // Track lead capture event
      trackEvent('lead_captured', {
        product_id: productId,
        product_title: productTitle,
        lead_email: formData.email,
        lead_interests: formData.interests,
        lead_source: 'free_download'
      });

      toast.success("Download started! Check your email for the download link.");
    }, 2000);
  };

  const LeadForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="john@example.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <Label htmlFor="company">Company/Organization</Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="Your Company"
        />
      </div>

      <div>
        <Label>What are you most interested in? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {interestOptions.map((interest) => (
            <label key={interest} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
                className="rounded"
              />
              <span className="text-sm">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Download className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download Free PDF
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By downloading, you agree to receive our newsletter and promotional emails. 
        You can unsubscribe at any time.
      </p>
    </form>
  );

  if (isDownloaded) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Download Started!</h3>
          <p className="text-muted-foreground mb-4">
            Your free PDF is being prepared. Check your email for the download link.
          </p>
          <p className="text-sm text-muted-foreground">
            We've also sent you some exclusive content and special offers!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isModal) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Get Free PDF
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Get Your Free PDF
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold">{productTitle}</h3>
              <p className="text-sm text-muted-foreground">{productDescription}</p>
            </div>
            <LeadForm />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Get Your Free PDF
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold">{productTitle}</h3>
            <p className="text-sm text-muted-foreground">{productDescription}</p>
          </div>
          <LeadForm />
        </div>
      </CardContent>
    </Card>
  );
};
