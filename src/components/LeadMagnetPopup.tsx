import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeadCapture } from "./LeadCapture";
import { X, Gift, Clock, Users } from "lucide-react";

export const LeadMagnetPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeen = localStorage.getItem('leadMagnetPopupSeen');
    if (hasSeen) {
      setHasSeenPopup(true);
      return;
    }

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('leadMagnetPopupSeen', 'true');
  };

  if (hasSeenPopup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Special Offer!
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Get Our Free Productivity Bundle
            </h3>
            <p className="text-sm text-muted-foreground">
              Join 50,000+ professionals who have downloaded our free resources
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>3 Free PDFs worth $47</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Join our exclusive community</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Gift className="h-4 w-4 text-primary" />
              <span>Special discounts on premium products</span>
            </div>
          </div>

          <LeadCapture
            productId="popup-bundle"
            productTitle="Free Productivity Bundle"
            productDescription="Get instant access to our most popular free resources"
            isModal={false}
          />

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-xs text-muted-foreground"
            >
              No thanks, I'll browse the site
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
