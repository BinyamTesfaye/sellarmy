
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Store } from '../types';
import { 
  ShoppingCart, 
  Instagram, 
  Twitter, 
  Grid, 
  List as ListIcon, 
  LayoutGrid,
  Search,
  Music2,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../supabaseClient';

interface StorefrontProps {
  products: Product[];
}

const Storefront: React.FC<StorefrontProps> = ({ products: globalProducts }) => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list' | 'mosaic'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single();

        if (error || !data) throw new Error("Store not found");
        
        setStore(data);
        setLayout(data.layout || 'grid');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  const fonts = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const displayProducts = globalProducts.filter(p => {
    const isCurated = store?.productIds?.includes(p.id);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return isCurated && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
        <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Opening Boutique...</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
        <p className="text-neutral-500 mb-8">The link you followed may be broken or the store has been deactivated.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-neutral-900 border border-white/10 rounded-xl font-bold">Back to SellArmy</button>
      </div>
    );
  }

  const accentColor = store.accentColor || '#10b981';

  const handleProductClick = (productId: string) => {
    navigate(`/store/${storeId}/product/${productId}`);
  };

  return (
    <div className={`bg-neutral-950 min-h-screen text-white selection:bg-emerald-500/30 ${fonts[store.fontFamily || 'sans']}`}>
      {/* Dynamic Hero Section */}
      <div className="relative h-[45vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        {store.bannerUrl ? (
          <img src={store.bannerUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
        ) : (
          <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(45deg, ${accentColor}, #000)` }}></div>
        )}
        
        <div className="container mx-auto px-4 relative z-20 text-center space-y-4">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-700">
            {store.heroTitle || store.name}
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-medium opacity-80 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {store.heroSubtitle || store.bio}
          </p>
          
          <div className="pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000">
             <button className="px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-2xl" style={{ backgroundColor: accentColor }}>
                Start Shopping
             </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-30 pb-32">
        {/* Brand Bar */}
        <div className="bg-neutral-900/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-4 md:p-6 mb-12 shadow-2xl flex flex-col md:flex-row items-center gap-6">
           <div className="flex items-center space-x-6 shrink-0 md:border-r border-white/10 md:pr-8">
              <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-center font-black text-xl overflow-hidden" style={{ color: accentColor }}>
                 {store.logoUrl ? <img src={store.logoUrl} className="w-full h-full object-cover" /> : store.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                 <h2 className="font-black text-xl leading-none">{store.name}</h2>
                 <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Official Selection</p>
              </div>
           </div>

           <div className="relative flex-grow w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <input 
                placeholder={`Search ${store.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-full py-5 pl-16 pr-6 focus:outline-none focus:border-emerald-500 transition-all font-bold text-sm"
              />
           </div>

           <div className="flex bg-neutral-950 p-1.5 rounded-full border border-white/5 shrink-0">
              {[
                { id: 'grid', icon: Grid },
                { id: 'mosaic', icon: LayoutGrid },
                { id: 'list', icon: ListIcon },
              ].map((btn) => (
                <button 
                  key={btn.id}
                  onClick={() => setLayout(btn.id as any)}
                  className={`p-4 rounded-full transition-all ${layout === btn.id ? 'bg-white text-black' : 'text-neutral-600 hover:text-white'}`}
                >
                  <btn.icon size={18} />
                </button>
              ))}
           </div>
        </div>

        {/* Product Listing */}
        {displayProducts.length > 0 ? (
          <div className={`
            grid gap-6 md:gap-8
            ${layout === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : ''}
            ${layout === 'mosaic' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
            ${layout === 'list' ? 'grid-cols-1' : ''}
          `}>
            {displayProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => handleProductClick(product.id)}
                className={`
                  group bg-neutral-900 border border-white/5 hover:border-white/20 transition-all duration-500 relative cursor-pointer
                  ${layout === 'grid' ? 'rounded-[40px] overflow-hidden' : ''}
                  ${layout === 'mosaic' ? 'rounded-[32px] overflow-hidden h-[500px]' : ''}
                  ${layout === 'list' ? 'rounded-[24px] flex flex-row items-center p-4' : ''}
                `}
              >
                <div className={`
                  relative overflow-hidden
                  ${layout === 'grid' ? 'aspect-[4/5]' : ''}
                  ${layout === 'mosaic' ? 'h-full w-full' : ''}
                  ${layout === 'list' ? 'w-48 h-48 rounded-2xl flex-shrink-0' : ''}
                `}>
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                  
                  {layout === 'mosaic' && <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>}

                  <div className={`absolute bottom-6 right-6 ${layout === 'mosaic' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                     <button className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <ShoppingCart size={20} />
                     </button>
                  </div>
                </div>

                <div className={`
                  ${layout === 'grid' ? 'p-8 pt-6' : ''}
                  ${layout === 'mosaic' ? 'absolute bottom-8 left-8 right-16 pointer-events-none' : ''}
                  ${layout === 'list' ? 'px-8 flex-grow' : ''}
                `}>
                  <h3 className={`font-black text-white ${layout === 'mosaic' ? 'text-3xl' : 'text-lg'}`}>{product.name}</h3>
                  <p className="text-xl font-black mt-1" style={{ color: accentColor }}>${product.price}</p>
                  {layout === 'list' && (
                    <button className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
                      View Item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-neutral-900/20 rounded-[40px] border border-dashed border-white/5">
             <h3 className="text-2xl font-bold mb-2">No Items in Shop</h3>
             <p className="text-neutral-500">Check back later for new curated drops.</p>
          </div>
        )}

        {/* Store Footer */}
        <footer className="mt-32 pt-20 border-t border-white/5 text-center">
           <div className="flex justify-center space-x-12 mb-12">
              {store.socialLinks?.instagram && <Instagram className="text-neutral-500 hover:text-white cursor-pointer" />}
              {store.socialLinks?.twitter && <Twitter className="text-neutral-500 hover:text-white cursor-pointer" />}
              {store.socialLinks?.tiktok && <Music2 className="text-neutral-500 hover:text-white cursor-pointer" />}
           </div>
           <p className="text-neutral-600 text-[10px] font-black uppercase tracking-widest">
              Secured & Managed by <span className="text-white">SellArmy</span>
           </p>
        </footer>
      </div>
    </div>
  );
};

export default Storefront;
