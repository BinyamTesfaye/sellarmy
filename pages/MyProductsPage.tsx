
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { MoreVertical, Search, Plus, ExternalLink, Edit2, Trash2, Filter, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface MyProductsPageProps {
  products: Product[];
  onRefresh?: () => void;
}

const MyProductsPage: React.FC<MyProductsPageProps> = ({ products, onRefresh }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const categories = ['Clothing', 'Shoes'];
  const statuses = ['active', 'pending', 'draft'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'draft': return 'bg-neutral-500/10 text-neutral-400 border-white/10';
      default: return 'bg-neutral-500/10 text-neutral-400 border-white/10';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (onRefresh) onRefresh();
      else window.location.reload(); 
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="p-4 md:p-8 bg-neutral-950 min-h-screen pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Product Inventory</h1>
            <p className="text-neutral-400">Manage your items across the SellArmy network.</p>
          </div>
          <Link 
            to="/add-product"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-900 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-950/20"
          >
            <Plus size={18} />
            <span>Add New Item</span>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 bg-neutral-900 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setStatusFilter(null)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!statusFilter ? 'bg-emerald-900 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                All Status
              </button>
              {statuses.map(status => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${statusFilter === status ? 'bg-emerald-900 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 bg-neutral-900 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setCategoryFilter(null)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!categoryFilter ? 'bg-emerald-900 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${categoryFilter === cat ? 'bg-emerald-900 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {(searchTerm || statusFilter || categoryFilter) && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter(null);
                  setCategoryFilter(null);
                }}
                className="text-xs font-bold text-neutral-500 hover:text-white ml-2 flex items-center"
              >
                <X size={14} className="mr-1" /> Clear All
              </button>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Retail</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <img src={product.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt={product.name} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
                            <ExternalLink size={12} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-sm group-hover:text-emerald-400 transition-colors">{product.name}</p>
                          <p className="text-xs text-neutral-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-400' : 'text-neutral-300'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-emerald-500">${product.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate(`/edit-product/${product.id}`)}
                          className="p-2 text-neutral-500 hover:text-white bg-white/0 hover:bg-white/5 rounded-lg transition-all" 
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-neutral-500 hover:text-red-400 bg-white/0 hover:bg-red-500/5 rounded-lg transition-all" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-neutral-500 hover:text-emerald-400 bg-white/0 hover:bg-emerald-500/5 rounded-lg transition-all" title="View Store">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-neutral-950 rounded-full flex items-center justify-center mb-4 border border-white/5">
                          <Filter className="text-neutral-700" size={24} />
                        </div>
                        <p className="text-neutral-500 font-medium">No matches found in your inventory.</p>
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter(null);
                            setCategoryFilter(null);
                          }}
                          className="mt-4 text-emerald-500 text-sm font-bold hover:underline"
                        >
                          Reset filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProductsPage;
