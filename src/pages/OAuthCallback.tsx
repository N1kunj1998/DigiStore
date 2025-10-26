import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Authentication failed. Please try again.');
      navigate('/');
      return;
    }

    if (token) {
      // Store the token and redirect to home
      localStorage.setItem('token', token);
      
      // Trigger auth context to reload user data
      window.location.reload();
      
      toast.success(`Successfully signed in with ${provider}!`);
      navigate('/');
    } else {
      toast.error('Authentication failed. Please try again.');
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
