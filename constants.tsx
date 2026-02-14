
import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  LayoutDashboard, 
  Settings, 
  PlusCircle, 
  BarChart3, 
  Package, 
  Store as StoreIcon,
  Users,
  CheckCircle2,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export const COLORS = {
  primary: '#065f46', // emerald-900 (dark green)
  primaryHover: '#064e3b',
  bgDark: '#0a0a0a',
  cardBg: '#171717',
  accent: '#10b981' // emerald-500
};

export const NAVIGATION = {
  RESELLER: [
    { name: 'Dashboard', path: '/reseller', icon: LayoutDashboard },
    { name: 'Discover', path: '/discover', icon: ShoppingBag },
    { name: 'My Store', path: '/store-settings', icon: StoreIcon },
    { name: 'Profile', path: '/profile', icon: Settings },
  ],
  SELLER: [
    { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
    { name: 'Products', path: '/my-products', icon: Package },
    { name: 'Add New', path: '/add-product', icon: PlusCircle },
    { name: 'Sales', path: '/seller-sales', icon: BarChart3 },
  ],
  ADMIN: [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Moderation', path: '/admin/moderation', icon: CheckCircle2 },
  ]
};
