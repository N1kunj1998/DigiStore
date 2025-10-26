import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter,
  Package,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '../services/api';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: 'pdf' | 'video' | 'workbook';
  category: string;
  image: string;
  featured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  downloadCount: number;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // User management state
  const [users, setUsers] = useState<any[]>([]);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userTotalUsers, setUserTotalUsers] = useState(0);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState<string>('all');
  const [userFilterRole, setUserFilterRole] = useState<string>('all');
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('products');
  
  // Analytics state
  const [activityAnalytics, setActivityAnalytics] = useState<any>(null);
  const [conversionFunnel, setConversionFunnel] = useState<any>(null);
  const [realTimeActivity, setRealTimeActivity] = useState<any[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<any>(null);

  // Form state for adding/editing products
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    price: '',
    type: 'pdf' as 'pdf' | 'video' | 'workbook',
    category: '',
    image: '',
    fileUrl: '',
    featured: false,
    tags: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      return;
    }
    fetchProducts();
    fetchUsers();
    fetchUserAnalytics();
    fetchAnalyticsData();
  }, [isAdmin, showDeleted, currentPage]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, userCurrentPage, userFilterStatus, userFilterRole]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminProducts({
        includeDeleted: showDeleted,
        type: filterType !== 'all' ? filterType : undefined,
        page: currentPage,
        limit: 20 // Show 20 products per page
      });
      
      if (response.status === 'success') {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.pages);
        setTotalProducts(response.data.pagination.total);
      } else {
        toast.error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await apiService.createProduct(productData);
      
      if (response.status === 'success') {
        toast.success('Product created successfully');
        setIsAddDialogOpen(false);
        resetForm();
        fetchProducts();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await apiService.updateProduct(editingProduct._id, productData);
      
      if (response.status === 'success') {
        toast.success('Product updated successfully');
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await apiService.deleteProduct(productId);
      
      if (response.status === 'success') {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleRestoreProduct = async (productId: string) => {
    try {
      const response = await apiService.restoreProduct(productId);
      
      if (response.status === 'success') {
        toast.success('Product restored successfully');
        fetchProducts();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to restore product');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      price: '',
      type: 'pdf',
      category: '',
      image: '',
      fileUrl: '',
      featured: false,
      tags: ''
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      fullDescription: '',
      price: product.price.toString(),
      type: product.type,
      category: product.category,
      image: product.image,
      fileUrl: '',
      featured: product.featured,
      tags: ''
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers({
        page: userCurrentPage,
        limit: 20,
        status: userFilterStatus !== 'all' ? userFilterStatus : undefined,
        role: userFilterRole !== 'all' ? userFilterRole : undefined,
        search: userSearchTerm || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (response.status === 'success') {
        setUsers(response.data.users);
        setUserTotalPages(response.data.pagination.pages);
        setUserTotalUsers(response.data.pagination.total);
      } else {
        toast.error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      const response = await apiService.getUserAnalytics();
      if (response.status === 'success') {
        setUserAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      // Fetch activity analytics
      const activityResponse = await apiService.getActivityAnalytics({ days: 30 });
      if (activityResponse.status === 'success') {
        setActivityAnalytics(activityResponse.data.analytics);
      }

      // Fetch conversion funnel
      const funnelResponse = await apiService.getConversionFunnel(30);
      if (funnelResponse.status === 'success') {
        setConversionFunnel(funnelResponse.data.funnel);
      }

      // Fetch real-time activity
      const realTimeResponse = await apiService.getRealTimeActivity(20);
      if (realTimeResponse.status === 'success') {
        setRealTimeActivity(realTimeResponse.data.activities);
      }

      // Fetch engagement metrics
      const engagementResponse = await apiService.getEngagementMetrics(30);
      if (engagementResponse.status === 'success') {
        setEngagementMetrics(engagementResponse.data.metrics);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    try {
      const response = await apiService.updateUserStatus(userId, status as any);
      if (response.status === 'success') {
        toast.success('User status updated successfully');
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const response = await apiService.updateUserRole(userId, role as any);
      if (response.status === 'success') {
        toast.success('User role updated successfully');
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      try {
        const response = await apiService.deleteUser(userId);
        if (response.status === 'success') {
          toast.success('User banned successfully');
          fetchUsers();
        } else {
          toast.error(response.message || 'Failed to ban user');
        }
      } catch (error) {
        console.error('Error banning user:', error);
        toast.error('Failed to ban user');
      }
    }
  };

  const handleRestoreUser = async (userId: string) => {
    try {
      const response = await apiService.restoreUser(userId);
      if (response.status === 'success') {
        toast.success('User restored successfully');
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to restore user');
      }
    } catch (error) {
      console.error('Error restoring user:', error);
      toast.error('Failed to restore user');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = userSearchTerm === '' || 
                         user.firstName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userAnalytics?.overview?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {userAnalytics?.overview?.activeUsers || 0} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userAnalytics?.overview?.newUsersThisMonth || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">Placeholder</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            {/* Product Management */}
            <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your digital products</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <ProductForm 
                    formData={formData} 
                    setFormData={setFormData}
                    onSubmit={handleAddProduct}
                    submitText="Create Product"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="workbook">Workbook</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-deleted"
                  checked={showDeleted}
                  onCheckedChange={setShowDeleted}
                />
                <Label htmlFor="show-deleted">Show Deleted</Label>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Downloads</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className={`border-b ${product.isDeleted ? 'opacity-50 bg-gray-50' : ''}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-gray-500">{product.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{product.type}</Badge>
                        </td>
                        <td className="py-3 px-4">${product.price}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-1">
                            {product.featured && <Badge variant="secondary">Featured</Badge>}
                            {product.isDeleted ? (
                              <Badge variant="destructive">Deleted</Badge>
                            ) : (
                              <Badge variant="default">Active</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{product.downloadCount}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {product.isDeleted ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRestoreProduct(product._id)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalProducts)} of {totalProducts} products
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm 
              formData={formData} 
              setFormData={setFormData}
              onSubmit={handleEditProduct}
              submitText="Update Product"
            />
          </DialogContent>
        </Dialog>
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and track user activity</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* User Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={userFilterStatus} onValueChange={setUserFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={userFilterRole} onValueChange={setUserFilterRole}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">Users</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Last Login</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user._id} className={`border-b ${user.status === 'banned' ? 'opacity-50 bg-gray-50' : ''}`}>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                                  <div className="text-sm text-gray-500">
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={
                                user.status === 'active' ? 'default' : 
                                user.status === 'inactive' ? 'secondary' : 
                                user.status === 'suspended' ? 'destructive' : 'outline'
                              }>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Select onValueChange={(value) => handleUpdateUserStatus(user._id, value)}>
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspend</SelectItem>
                                    <SelectItem value="banned">Ban</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select onValueChange={(value) => handleUpdateUserRole(user._id, value)}>
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                                {user.status === 'banned' ? (
                                  <Button variant="outline" size="sm" onClick={() => handleRestoreUser(user._id)}>
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user._id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* User Pagination */}
                {userTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {((userCurrentPage - 1) * 20) + 1} to {Math.min(userCurrentPage * 20, userTotalUsers)} of {userTotalUsers} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={userCurrentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, userTotalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={userCurrentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setUserCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserCurrentPage(prev => Math.min(prev + 1, userTotalPages))}
                        disabled={userCurrentPage === userTotalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            {/* Activity Analytics */}
            <div className="space-y-6">
              {/* Analytics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activityAnalytics?.totalActivities || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {activityAnalytics?.uniqueUsers || 0} unique users
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {activityAnalytics?.conversionMetrics?.conversionRate?.toFixed(1) || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activityAnalytics?.conversionMetrics?.conversions || 0} conversions
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${activityAnalytics?.conversionMetrics?.totalValue?.toFixed(2) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From tracked activities
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {engagementMetrics?.avgEngagementScore?.toFixed(1) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Out of 100
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Activity Feed</CardTitle>
                  <CardDescription>Latest user activities across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {realTimeActivity.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No recent activity</p>
                    ) : (
                      realTimeActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {activity.userId?.firstName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {activity.userId?.firstName} {activity.userId?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.activityType.replace(/_/g, ' ')} - {activity.activityData?.page || 'Unknown page'}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>User journey through the sales funnel</CardDescription>
                </CardHeader>
                <CardContent>
                  {conversionFunnel && conversionFunnel.length > 0 ? (
                    <div className="space-y-4">
                      {conversionFunnel.map((stage, index) => (
                        <div key={stage.stage} className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium capitalize">{stage.stage}</span>
                              <span className="text-sm text-muted-foreground">
                                {stage.uniqueUsers} users
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (stage.uniqueUsers / conversionFunnel[0].uniqueUsers) * 100)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No funnel data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Viewed Products</CardTitle>
                  <CardDescription>Products with highest engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityAnalytics?.topProducts && Object.keys(activityAnalytics.topProducts).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(activityAnalytics.topProducts)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 5)
                        .map(([product, views]) => (
                          <div key={product} className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="font-medium">{product}</span>
                            <Badge variant="secondary">{views} views</Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No product data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  submitText 
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  submitText: string;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Product title"
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="workbook">Workbook</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Product category"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="fileUrl">File URL</Label>
        <Input
          id="fileUrl"
          value={formData.fileUrl}
          onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
          placeholder="https://example.com/file.pdf"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="productivity, business, guide"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setFormData({ ...formData, ...{} })}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {submitText}
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
