
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, Filter, Plus, Check, X, SlidersHorizontal } from 'lucide-react';

interface ProductDiscoveryProps {
  products: Product[];
}

const ProductDiscovery: React.FC<ProductDiscoveryProps> = ({ products }) => {
  const [added, setAdded] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleProduct = (id: string) => {
    if (added.includes(id)) {
      setAdded(added.filter(pid => pid !== id));
    } else {
      setAdded([...added, id]);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, priceRange]);

  const categories = ['Clothing', 'Shoes'];

  return (
    <div className="p-4 md:p-8 bg-neutral-950 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Discover Catalog</h1>
          <p className="text-neutral-400">Add high-quality products to your store with one click.</p>
        </div>

        {/* Search and Main Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder="Search shoes, hoodies, jackets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
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
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-xl flex items-center justify-center space-x-2 transition-all border ${
              showFilters 
                ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' 
                : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Drawer/Panel */}
        {showFilters && (
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Category Filter */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Categories</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      !selectedCategory ? 'bg-emerald-900 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat ? 'bg-emerald-900 text-white' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Price Range</p>
                  <p className="text-xs text-emerald-500 font-bold">${priceRange[0]} - ${priceRange[1]}</p>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-600 font-bold">
                  <span>$0</span>
                  <span>$1,000+</span>
                </div>
              </div>

              {/* Reset Controls */}
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange([0, 1000]);
                    setSearchTerm('');
                  }}
                  className="w-full py-3 border border-white/5 rounded-xl text-sm font-medium text-neutral-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all shadow-xl">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button 
                      onClick={() => toggleProduct(product.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                        added.includes(product.id) 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      {added.includes(product.id) ? <Check size={20} /> : <Plus size={20} />}
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-emerald-500 font-bold">${product.price}</p>
                  </div>
                  <p className="text-neutral-500 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center text-xs text-neutral-400">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      Ready for shipping
                    </span>
                    <span className="mx-2">•</span>
                    <span>Wholesale: ${Math.round(product.price * 0.7)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-white/5">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-neutral-600" size={24} />
            </div>
            <h3 className="text-xl font-bold">No products found</h3>
            <p className="text-neutral-500 mt-2 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
                setPriceRange([0, 1000]);
              }}
              className="mt-6 text-emerald-500 font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDiscovery;
