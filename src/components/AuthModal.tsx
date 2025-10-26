import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SignIn, SignUp } from "@clerk/clerk-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to DigiStore</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
                card: "shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
                socialButtonsBlockButtonText: "text-gray-700",
                formFieldInput: "border-gray-200 focus:border-purple-500 focus:ring-purple-500",
                footerActionLink: "text-purple-600 hover:text-purple-700",
              }
            }}
            afterSignInUrl="/"
            afterSignUpUrl="/"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

