
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Role, Product } from './types';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SellerDashboard from './pages/SellerDashboard';
import ResellerDashboard from './pages/ResellerDashboard';
import ProductDiscovery from './pages/ProductDiscovery';
import Storefront from './pages/Storefront';
import OrderPage from './pages/OrderPage';
import AdminDashboard from './pages/AdminDashboard';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ProfilePage from './pages/ProfilePage';
import StoreSettingsPage from './pages/StoreSettingsPage';
import MyProductsPage from './pages/MyProductsPage';
import SellerSalesPage from './pages/SellerSalesPage';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { supabase, isSupabaseConfigured } from './supabaseClient';

interface ProtectedRouteProps {
  user: User | null;
  allowedRoles: Role[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    const target = user.role === 'SELLER' ? '/seller' : '/reseller';
    return <Navigate to={target} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (id: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        const profileUser: User = {
          id: data.id,
          name: data.name || email.split('@')[0],
          email: data.email || email,
          role: (data.role as Role) || 'RESELLER',
          avatarUrl: data.avatar_url
        };
        setUser(profileUser);
        return profileUser;
      } else {
        const newUser: User = { id, email, name: email.split('@')[0], role: 'RESELLER' };
        setUser(newUser);
        return newUser;
      }
    } catch (e) {
      console.warn("Using skeleton profile");
      const skeleton: User = { id, email, name: email.split('@')[0], role: 'RESELLER' };
      setUser(skeleton);
      return skeleton;
    }
  };

  const handleLoginSuccess = async () => {
    setLoading(true);
    const { data: { session } } = await (supabase.auth as any).getSession();
    if (session?.user) {
      await fetchProfile(session.user.id, session.user.email!);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await (supabase.auth as any).getSession();
        if (session?.user) await fetchProfile(session.user.id, session.user.email!);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();

    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(async (event: string, session: any) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          image: p.image_url,
          sellerId: p.seller_id,
          category: p.category,
          status: p.status
        }));
        setProducts(mapped);
      }
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  const logout = async () => {
    setUser(null);
    await (supabase.auth as any).signOut();
    window.location.href = '#/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-emerald-900 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-600 text-[10px] uppercase tracking-widest font-bold">Syncing Session...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen pb-16 md:pb-0">
        {!isSupabaseConfigured && (
          <div className="bg-emerald-500 text-neutral-950 py-1 px-4 flex items-center justify-center space-x-2 text-[9px] font-black uppercase tracking-tighter z-[60]">
            <span>DEMO MODE ACTIVE</span>
          </div>
        )}
        
        <Header user={user} logout={logout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            
            <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
            
            <Route path="/seller" element={
              <ProtectedRoute user={user} allowedRoles={['SELLER']}>
                <SellerDashboard products={products.filter(p => p.sellerId === user?.id)} />
              </ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute user={user} allowedRoles={['SELLER']}>
                <AddProductPage onAdd={fetchProducts} user={user} />
              </ProtectedRoute>
            } />
            <Route path="/edit-product/:productId" element={
              <ProtectedRoute user={user} allowedRoles={['SELLER']}>
                <EditProductPage onUpdate={fetchProducts} user={user} />
              </ProtectedRoute>
            } />
            <Route path="/my-products" element={
              <ProtectedRoute user={user} allowedRoles={['SELLER']}>
                <MyProductsPage products={products.filter(p => p.sellerId === user?.id)} onRefresh={fetchProducts} />
              </ProtectedRoute>
            } />
            <Route path="/seller-sales" element={
              <ProtectedRoute user={user} allowedRoles={['SELLER']}>
                <SellerSalesPage user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/reseller" element={
              <ProtectedRoute user={user} allowedRoles={['RESELLER']}>
                <ResellerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/discover" element={
              <ProtectedRoute user={user} allowedRoles={['RESELLER']}>
                <ProductDiscovery products={products} />
              </ProtectedRoute>
            } />
            <Route path="/store-settings" element={
              <ProtectedRoute user={user} allowedRoles={['RESELLER']}>
                <StoreSettingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/store/:storeId" element={<Storefront products={products} />} />
            <Route path="/store/:storeId/product/:productId" element={<OrderPage products={products} />} />

            <Route path="/admin" element={
              <ProtectedRoute user={user} allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <BottomNav user={user} />
      </div>
    </Router>
  );
};

export default App;
