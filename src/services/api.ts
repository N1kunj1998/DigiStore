// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any[];
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Always get the latest token from localStorage
    const currentToken = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Product methods
  async getProducts(params?: {
    type?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/products?${queryParams.toString()}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async searchProducts(query: string, filters?: any) {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request(`/products/search?${params.toString()}`);
  }

  async getSearchSuggestions(query: string) {
    const params = new URLSearchParams({ q: query });
    return this.request(`/products/suggestions?${params.toString()}`);
  }

  // Cart methods
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // Order methods
  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    billingAddress: {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      city: string;
      zipCode: string;
    };
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params?: { page?: number; limit?: number; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/orders?${queryParams.toString()}`);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async processPayment(paymentData: {
    orderId: string;
    paymentMethodId: string;
  }) {
    return this.request('/orders/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Lead methods
  async createLead(leadData: {
    email: string;
    firstName: string;
    lastName: string;
    source: string;
    interests?: string[];
    productId?: string;
    productTitle?: string;
    company?: string;
    phone?: string;
  }) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async getLeads(params?: {
    status?: string;
    source?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/leads?${queryParams.toString()}`);
  }

  async getLeadStats() {
    return this.request('/leads/stats');
  }

  // Analytics methods
  async getAnalyticsOverview(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });
    }

    return this.request(`/analytics/overview?${queryParams.toString()}`);
  }

  // Admin methods
  async getAdminProducts(params?: {
    type?: string;
    category?: string;
    includeDeleted?: boolean;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/products/admin/all?${queryParams.toString()}`);
  }

  async createProduct(productData: {
    title: string;
    description: string;
    fullDescription?: string;
    price: number;
    type: 'pdf' | 'video' | 'workbook';
    category: string;
    image: string;
    fileUrl?: string;
    featured?: boolean;
    tags?: string[];
  }) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: {
    title?: string;
    description?: string;
    fullDescription?: string;
    price?: number;
    type?: 'pdf' | 'video' | 'workbook';
    category?: string;
    image?: string;
    fileUrl?: string;
    featured?: boolean;
    tags?: string[];
  }) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async restoreProduct(id: string) {
    return this.request(`/products/${id}/restore`, {
      method: 'PATCH',
    });
  }

  // User management methods
  async getUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    role?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/users?${queryParams.toString()}`);
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended' | 'banned') {
    return this.request(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateUserRole(id: string, role: 'user' | 'admin') {
    return this.request(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async getUserAnalytics() {
    return this.request('/users/analytics');
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async restoreUser(id: string) {
    return this.request(`/users/${id}/restore`, {
      method: 'PATCH',
    });
  }

  // Activity tracking methods
  async trackActivity(activityData: {
    userId?: string | null;
    sessionId: string;
    activityType: string;
    activityData?: any;
    deviceInfo?: any;
    location?: any;
    conversionValue?: number;
    conversionType?: string;
    funnelStage?: string;
  }) {
    return this.request('/activities/track', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async getActivityAnalytics(params?: {
    userId?: string;
    days?: number;
    activityType?: string;
    funnelStage?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/activities/analytics?${queryParams.toString()}`);
  }

  async getConversionFunnel(days?: number) {
    const queryParams = new URLSearchParams();
    if (days) {
      queryParams.append('days', days.toString());
    }
    return this.request(`/activities/funnel?${queryParams.toString()}`);
  }

  async getUserJourney(params?: {
    userId?: string;
    sessionId?: string;
    days?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/activities/journey?${queryParams.toString()}`);
  }

  async getRealTimeActivity(limit?: number) {
    const queryParams = new URLSearchParams();
    if (limit) {
      queryParams.append('limit', limit.toString());
    }
    return this.request(`/activities/realtime?${queryParams.toString()}`);
  }

  async getEngagementMetrics(days?: number) {
    const queryParams = new URLSearchParams();
    if (days) {
      queryParams.append('days', days.toString());
    }
    return this.request(`/activities/engagement?${queryParams.toString()}`);
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create and export API service instance
export const apiService = new ApiService(API_BASE_URL);

// Export types
export type { ApiResponse };

