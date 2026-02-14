
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Store } from '../types';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Package, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../supabaseClient';

interface OrderPageProps {
  products: Product[];
}

const OrderPage: React.FC<OrderPageProps> = ({ products }) => {
  const { storeId, productId } = useParams();
  const navigate = useNavigate();
  
  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderState, setOrderState] = useState<'idle' | 'processing' | 'success'>('idle');
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch store settings for branding
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single();
          
        if (storeData) setStore(storeData);

        // Find product from global products
        const targetProduct = products.find(p => p.id === productId);
        if (targetProduct) setProduct(targetProduct);
        else throw new Error("Product not found");

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId, productId, products]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderState('processing');

    // Simulate order processing
    setTimeout(async () => {
      try {
        // Create a mock sale record
        if (store && product) {
          const { error } = await supabase.from('sales').insert([{
            productId: product.id,
            productName: product.name,
            sellerId: product.sellerId,
            resellerId: store.resellerId,
            resellerName: store.name,
            amount: product.price,
            commission: Math.round(product.price * 0.15),
            status: 'pending'
          }]);
          if (error) throw error;
        }
        setOrderState('success');
      } catch (err) {
        console.error(err);
        setOrderState('idle');
        alert("Failed to place order. Please try again.");
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
        <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Securing Checkout...</p>
      </div>
    );
  }

  if (!store || !product) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Item Unavailable</h1>
        <p className="text-neutral-500 mb-8">This product is no longer part of this store's curation.</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-neutral-900 border border-white/10 rounded-xl font-bold">Return to Store</button>
      </div>
    );
  }

  const accentColor = store.accentColor || '#10b981';
  const fonts = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };
  const fontClass = fonts[store.fontFamily || 'sans'];

  const getRadius = () => {
    switch(store.buttonRadius) {
      case 'none': return 'rounded-none';
      case 'md': return 'rounded-2xl';
      case 'full': return 'rounded-full';
      default: return 'rounded-2xl';
    }
  };

  if (orderState === 'success') {
    return (
      <div className={`min-h-screen bg-neutral-950 flex items-center justify-center p-4 ${fontClass}`}>
        <div className="max-w-md w-full bg-neutral-900 border border-white/5 p-10 rounded-[40px] text-center shadow-2xl animate-in zoom-in duration-500">
           <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl" style={{ backgroundColor: `${accentColor}20` }}>
              <CheckCircle2 size={40} style={{ color: accentColor }} />
           </div>
           <h2 className="text-3xl font-black mb-4">Order Confirmed!</h2>
           <p className="text-neutral-400 mb-8 font-medium">Thank you for shopping at <span className="text-white font-bold">{store.name}</span>. Your order #{Math.floor(1000 + Math.random() * 9000)} is being processed.</p>
           
           <div className="bg-neutral-950 rounded-3xl p-6 border border-white/5 mb-8 text-left space-y-4">
              <div className="flex justify-between items-center text-sm">
                 <span className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Product</span>
                 <span className="text-white font-bold">{product.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Total Paid</span>
                 <span className="text-white font-black" style={{ color: accentColor }}>${product.price}</span>
              </div>
           </div>

           <button 
             onClick={() => navigate(`/store/${storeId}`)}
             className={`w-full py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl hover:scale-[1.02] ${getRadius()}`}
             style={{ backgroundColor: accentColor }}
           >
              Continue Shopping
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-neutral-950 min-h-screen text-white pb-32 ${fontClass}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="p-3 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={20} />
           </button>
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Checkout</span>
              <span className="text-sm font-bold">{store.name}</span>
           </div>
           <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-6xl mt-8">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Product & Form Column */}
          <div className="lg:col-span-7 space-y-8">
             {/* Product Summary (Mobile Only) */}
             <div className="lg:hidden bg-neutral-900 rounded-[32px] p-4 border border-white/5 flex items-center space-x-4">
                <img src={product.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div>
                   <h3 className="font-bold">{product.name}</h3>
                   <p className="font-black text-emerald-500">${product.price}</p>
                </div>
             </div>

             <div className="bg-neutral-900/50 border border-white/5 rounded-[40px] p-8 md:p-10 space-y-10">
                <div className="space-y-2">
                   <h2 className="text-2xl font-black">Shipping Information</h2>
                   <p className="text-neutral-500 text-sm font-medium">Please enter your delivery details carefully.</p>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest ml-2">Full Name</label>
                         <input 
                           required
                           value={customerData.name}
                           onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                           placeholder="John Doe"
                           className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-white transition-all font-bold text-sm"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest ml-2">Email Address</label>
                         <input 
                           required
                           type="email"
                           value={customerData.email}
                           onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                           placeholder="john@example.com"
                           className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-white transition-all font-bold text-sm"
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest ml-2">Shipping Address</label>
                      <input 
                        required
                        value={customerData.address}
                        onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                        placeholder="Street, Building, Apartment"
                        className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-white transition-all font-bold text-sm"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest ml-2">City</label>
                         <input 
                           required
                           value={customerData.city}
                           onChange={(e) => setCustomerData({...customerData, city: e.target.value})}
                           placeholder="New York"
                           className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-white transition-all font-bold text-sm"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest ml-2">Phone Number</label>
                         <input 
                           required
                           value={customerData.phone}
                           onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                           placeholder="+1 234 567 890"
                           className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-white transition-all font-bold text-sm"
                         />
                      </div>
                   </div>

                   <div className="pt-8 border-t border-white/5">
                      <div className="flex items-center space-x-3 text-neutral-500 mb-6">
                         <ShieldCheck size={18} style={{ color: accentColor }} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Secured by Stripe & SSL Encryption</span>
                      </div>

                      <button 
                        type="submit"
                        disabled={orderState === 'processing'}
                        className={`w-full py-6 text-sm font-black uppercase tracking-[0.2em] text-white transition-all shadow-2xl hover:scale-[1.01] active:scale-100 flex items-center justify-center space-x-3 disabled:opacity-50 ${getRadius()}`}
                        style={{ backgroundColor: accentColor }}
                      >
                         {orderState === 'processing' ? (
                           <><Loader2 className="animate-spin" size={20} /><span>Processing...</span></>
                         ) : (
                           <>
                             <CreditCard size={20} />
                             <span>Place Order • ${product.price}</span>
                           </>
                         )}
                      </button>
                   </div>
                </form>
             </div>

             {/* Shipping Perks */}
             <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: 'Free Delivery' },
                  { icon: ShieldCheck, label: 'Buyer Protection' },
                  { icon: ShoppingBag, label: 'Official Sourcing' },
                ].map((perk, i) => (
                  <div key={i} className="bg-neutral-900 border border-white/5 p-4 rounded-3xl flex flex-col items-center text-center space-y-2">
                     <perk.icon size={20} className="text-neutral-500" />
                     <span className="text-[9px] font-black uppercase tracking-tighter">{perk.label}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Order Sidebar Column */}
          <div className="lg:col-span-5 hidden lg:block">
             <div className="sticky top-28 space-y-8">
                <div className="bg-neutral-900 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                   <div className="aspect-square">
                      <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                   </div>
                   <div className="p-8 space-y-6">
                      <div>
                         <h1 className="text-3xl font-black leading-tight mb-2">{product.name}</h1>
                         <p className="text-neutral-500 text-sm font-medium line-clamp-3">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                         <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Total Price</span>
                         <span className="text-3xl font-black" style={{ color: accentColor }}>${product.price}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center">
                        <Package size={20} className="text-neutral-600" />
                      </div>
                      <div>
                         <p className="text-xs font-black uppercase tracking-widest text-neutral-300">Return Policy</p>
                         <p className="text-[10px] text-neutral-500 font-medium">14-day hassle-free returns</p>
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-neutral-700 group-hover:text-white transition-colors" />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderPage;
