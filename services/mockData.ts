import { Product, Store } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Stealth Bomber Jacket',
    description: 'Ultra-lightweight windproof bomber jacket with matte finish.',
    price: 129,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    sellerId: 's1',
    category: 'Clothing',
    status: 'active'
  },
  {
    id: 'p2',
    name: 'Vortex Mesh Sneakers',
    description: 'High-performance running shoes with adaptive mesh technology.',
    price: 159,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    sellerId: 's1',
    category: 'Shoes',
    status: 'active'
  },
  {
    id: 'p3',
    name: 'Premium Cotton Oversized Tee',
    description: 'Heavyweight organic cotton t-shirt with a relaxed silhouette.',
    price: 45,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    sellerId: 's2',
    category: 'Clothing',
    status: 'active'
  },
  {
    id: 'p4',
    name: 'Urban Cargo Pants',
    description: 'Multiple pocket utility pants with water-repellent coating.',
    price: 89,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
    sellerId: 's2',
    category: 'Clothing',
    status: 'active'
  }
];

export const mockStores: Store[] = [
  {
    id: 'store1',
    resellerId: 'r1',
    name: "Urban Elite Selection",
    bio: "Curated streetwear for the modern nomad.",
    accentColor: '#065f46',
    // Fix: Adding missing properties fontFamily and buttonRadius
    fontFamily: 'sans',
    buttonRadius: 'md',
    layout: 'grid',
    productIds: ['p1', 'p2', 'p4']
  }
];