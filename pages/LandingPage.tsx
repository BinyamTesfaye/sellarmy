
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Globe, TrendingUp } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-neutral-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Scale Your Fashion <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Empire Effortlessly
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
            Connect high-quality clothing brands with a dedicated army of resellers. 
            List products once, reach thousands of stores instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-emerald-900 text-white rounded-full font-semibold flex items-center justify-center group hover:bg-emerald-800 transition-all"
            >
              Start Selling Products
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              Become a Reseller
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-neutral-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
            ].map((img, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-colors shadow-2xl">
                <img src={img} alt="Featured Clothing" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-neutral-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-neutral-400">Three steps to your first sale.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "Sellers List Products", desc: "Upload your catalog with high-res photos and wholesale pricing." },
              { icon: Zap, title: "Resellers Customize", desc: "Browse the marketplace and add products to your branded digital store." },
              { icon: Globe, title: "Customers Buy Direct", desc: "Sell to your audience and we handle the fulfillment logistics." }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-900/40 transition-colors">
                  <step.icon className="text-emerald-500" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Trust */}
      <section className="py-16 border-y border-white/5 bg-neutral-900/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold tracking-widest text-neutral-500 uppercase mb-8">Trusted by 500+ emerging brands</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            <div className="text-2xl font-bold">VOGUE</div>
            <div className="text-2xl font-bold">HYPEBEAST</div>
            <div className="text-2xl font-bold">STREETWEAR</div>
            <div className="text-2xl font-bold">FASHIONARY</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
