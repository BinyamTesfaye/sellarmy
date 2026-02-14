
import React from 'react';
import { Product } from '../types';
import { TrendingUp, Users, ShoppingCart, Plus, DollarSign, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

interface SellerDashboardProps {
  products: Product[];
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ products }) => {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-neutral-950 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
          <p className="text-neutral-400">Welcome back, Jane Selection</p>
        </div>
        <Link 
          to="/add-product"
          className="hidden md:flex items-center space-x-2 px-6 py-3 bg-emerald-900 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-950/20"
        >
          <Plus size={18} />
          <span>New Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Active Resellers', value: '1,204', icon: Users, color: 'text-blue-500' },
          { label: 'Items Sold', value: '3,542', icon: ShoppingCart, color: 'text-amber-500' },
          { label: 'Inventory', value: products.reduce((acc, p) => acc + p.stock, 0).toString(), icon: Package, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-900 border border-white/5 p-4 md:p-6 rounded-3xl shadow-sm hover:border-emerald-500/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={stat.color} size={20} />
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-sm text-neutral-400 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Sales Performance</h3>
            <select className="bg-neutral-950 border border-white/10 rounded-lg text-xs p-2 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="sales" fill="#065f46" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Top Performing</h3>
            <Link to="/my-products" className="text-xs text-emerald-500 hover:underline flex items-center">
              View All <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-6 flex-grow">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5">
                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none mb-1 group-hover:text-emerald-400 transition-colors">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.stock} in stock</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">${product.price}</p>
                  <p className="text-[10px] text-neutral-500 uppercase">Retail</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
             <div className="p-4 bg-emerald-950/20 border border-emerald-900/20 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider mb-1">Weekly Growth</p>
                  <p className="text-lg font-bold">+24.5%</p>
                </div>
                <TrendingUp className="text-emerald-500" size={24} />
             </div>
          </div>
        </div>
      </div>

      {/* Floating Add Button Mobile */}
      <Link 
        to="/add-product"
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-emerald-900 text-white rounded-full shadow-2xl flex items-center justify-center z-50 animate-pulse"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default SellerDashboard;
