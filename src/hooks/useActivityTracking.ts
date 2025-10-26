import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

// Generate a unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get device info
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const screen = window.screen;
  
  return {
    deviceType: /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 
               /Tablet|iPad/.test(userAgent) ? 'tablet' : 'desktop',
    browser: /Chrome/.test(userAgent) ? 'Chrome' :
             /Firefox/.test(userAgent) ? 'Firefox' :
             /Safari/.test(userAgent) ? 'Safari' :
             /Edge/.test(userAgent) ? 'Edge' : 'Other',
    os: /Windows/.test(userAgent) ? 'Windows' :
        /Mac/.test(userAgent) ? 'Mac' :
        /Linux/.test(userAgent) ? 'Linux' :
        /Android/.test(userAgent) ? 'Android' :
        /iOS/.test(userAgent) ? 'iOS' : 'Other',
    screenResolution: `${screen.width}x${screen.height}`,
    userAgent: userAgent
  };
};

// Get page info
const getPageInfo = () => {
  return {
    page: window.location.pathname,
    referrer: document.referrer,
    title: document.title,
    url: window.location.href
  };
};

export const useActivityTracking = () => {
  const { user, isAuthenticated } = useAuth();
  const sessionIdRef = useRef<string | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);

  // Initialize session
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
      
      // Track session start
      trackActivity('session_start', {
        ...getPageInfo(),
        ...getDeviceInfo()
      }, 'awareness');
    }
  }, []);

  // Track page views
  useEffect(() => {
    const trackPageView = () => {
      const timeSpent = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      
      trackActivity('page_view', {
        ...getPageInfo(),
        timeSpent,
        scrollDepth: scrollDepthRef.current,
        clicks: clickCountRef.current
      });
      
      // Reset for next page
      pageStartTimeRef.current = Date.now();
      scrollDepthRef.current = 0;
      clickCountRef.current = 0;
    };

    // Track page view on mount
    trackPageView();

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollPercent > scrollDepthRef.current) {
        scrollDepthRef.current = scrollPercent;
      }
    };

    // Track clicks
    const handleClick = () => {
      clickCountRef.current++;
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      
      // Track page exit
      trackPageView();
    };
  }, []);

  // Track activity function
  const trackActivity = useCallback(async (
    activityType: string,
    activityData: any = {},
    funnelStage?: string,
    conversionValue: number = 0,
    conversionType?: string
  ) => {
    if (!sessionIdRef.current) return;

    try {
      const payload = {
        userId: user?.id || null,
        sessionId: sessionIdRef.current,
        activityType,
        activityData: {
          ...activityData,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        },
        deviceInfo: getDeviceInfo(),
        conversionValue,
        conversionType,
        funnelStage
      };

      await apiService.trackActivity(payload);
    } catch (error) {
      console.error('Activity tracking error:', error);
    }
  }, [user]);

  // Specific tracking functions
  const trackProductView = useCallback((productId: string, productTitle: string, price: number) => {
    trackActivity('product_view', {
      productId,
      productTitle,
      price,
      ...getPageInfo()
    }, 'interest');
  }, [trackActivity]);

  const trackAddToCart = useCallback((productId: string, productTitle: string, price: number, quantity: number = 1) => {
    trackActivity('add_to_cart', {
      productId,
      productTitle,
      price,
      quantity,
      totalPrice: price * quantity,
      ...getPageInfo()
    }, 'consideration');
  }, [trackActivity]);

  const trackRemoveFromCart = useCallback((productId: string, productTitle: string, price: number) => {
    trackActivity('remove_from_cart', {
      productId,
      productTitle,
      price,
      ...getPageInfo()
    });
  }, [trackActivity]);

  const trackCartView = useCallback(() => {
    trackActivity('view_cart', {
      ...getPageInfo()
    }, 'consideration');
  }, [trackActivity]);

  const trackCheckoutStart = useCallback((cartItems: any[], totalAmount: number) => {
    trackActivity('checkout_start', {
      itemCount: cartItems.length,
      totalAmount,
      items: cartItems.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      ...getPageInfo()
    }, 'intent');
  }, [trackActivity]);

  const trackCheckoutStep = useCallback((step: string, stepData: any = {}) => {
    trackActivity('checkout_step', {
      step,
      ...stepData,
      ...getPageInfo()
    }, 'intent');
  }, [trackActivity]);

  const trackPaymentAttempt = useCallback((paymentMethod: string, amount: number) => {
    trackActivity('payment_attempt', {
      paymentMethod,
      amount,
      ...getPageInfo()
    }, 'intent');
  }, [trackActivity]);

  const trackPaymentSuccess = useCallback((orderId: string, amount: number, paymentMethod: string) => {
    trackActivity('payment_success', {
      orderId,
      amount,
      paymentMethod,
      ...getPageInfo()
    }, 'purchase', amount, 'purchase');
  }, [trackActivity]);

  const trackPaymentFailed = useCallback((error: string, amount: number, paymentMethod: string) => {
    trackActivity('payment_failed', {
      error,
      amount,
      paymentMethod,
      ...getPageInfo()
    });
  }, [trackActivity]);

  const trackSearch = useCallback((query: string, resultsCount: number = 0) => {
    trackActivity('search', {
      query,
      resultsCount,
      ...getPageInfo()
    }, 'interest');
  }, [trackActivity]);

  const trackDownload = useCallback((productId: string, productTitle: string, fileType: string) => {
    trackActivity('download', {
      productId,
      productTitle,
      fileType,
      ...getPageInfo()
    }, 'retention', 0, 'download');
  }, [trackActivity]);

  const trackLeadMagnetView = useCallback((magnetType: string, magnetTitle: string) => {
    trackActivity('lead_magnet_view', {
      magnetType,
      magnetTitle,
      ...getPageInfo()
    }, 'awareness');
  }, [trackActivity]);

  const trackLeadMagnetDownload = useCallback((magnetType: string, magnetTitle: string, email: string) => {
    trackActivity('lead_magnet_download', {
      magnetType,
      magnetTitle,
      email,
      ...getPageInfo()
    }, 'interest', 0, 'lead');
  }, [trackActivity]);

  const trackNewsletterSignup = useCallback((email: string, source: string) => {
    trackActivity('newsletter_signup', {
      email,
      source,
      ...getPageInfo()
    }, 'interest', 0, 'lead');
  }, [trackActivity]);

  const trackLogin = useCallback(() => {
    trackActivity('login', {
      ...getPageInfo()
    }, 'retention');
  }, [trackActivity]);

  const trackRegister = useCallback((email: string) => {
    trackActivity('register', {
      email,
      ...getPageInfo()
    }, 'interest', 0, 'signup');
  }, [trackActivity]);

  const trackLogout = useCallback(() => {
    trackActivity('logout', {
      ...getPageInfo()
    });
  }, [trackActivity]);

  const trackContactForm = useCallback((formType: string, subject?: string) => {
    trackActivity('contact_form', {
      formType,
      subject,
      ...getPageInfo()
    }, 'interest');
  }, [trackActivity]);

  const trackFAQView = useCallback((question: string) => {
    trackActivity('faq_view', {
      question,
      ...getPageInfo()
    });
  }, [trackActivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionIdRef.current) {
        trackActivity('session_end', {
          ...getPageInfo()
        });
      }
    };
  }, [trackActivity]);

  return {
    trackActivity,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackCartView,
    trackCheckoutStart,
    trackCheckoutStep,
    trackPaymentAttempt,
    trackPaymentSuccess,
    trackPaymentFailed,
    trackSearch,
    trackDownload,
    trackLeadMagnetView,
    trackLeadMagnetDownload,
    trackNewsletterSignup,
    trackLogin,
    trackRegister,
    trackLogout,
    trackContactForm,
    trackFAQView
  };
};
