
export type Role = 'SELLER' | 'RESELLER' | 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  sellerId: string;
  category: 'Clothing' | 'Shoes';
  status: 'active' | 'pending' | 'draft';
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  sellerId: string;
  resellerId: string;
  resellerName: string;
  amount: number;
  commission: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Store {
  id: string;
  resellerId: string;
  name: string;
  bio: string;
  logoUrl?: string;
  bannerUrl?: string;
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  buttonRadius: 'none' | 'md' | 'full';
  heroTitle?: string;
  heroSubtitle?: string;
  layout: 'grid' | 'list' | 'mosaic';
  productIds: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  revenue: number;
  growth: number;
}
