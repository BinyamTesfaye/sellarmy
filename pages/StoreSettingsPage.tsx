
import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  Camera, 
  LayoutGrid, 
  List as ListIcon, 
  Palette, 
  Save, 
  Globe, 
  Loader2, 
  Upload, 
  Type, 
  Smartphone,
  Instagram,
  Twitter,
  Music2,
  Image as ImageIcon
} from 'lucide-react';
import { uploadImage, supabase } from '../supabaseClient';
import { Store as StoreType } from '../types';

const StoreSettingsPage: React.FC = () => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'social'>('design');
  
  // Store State
  const [settings, setSettings] = useState<Partial<StoreType>>({
    name: 'Urban Elite Selection',
    bio: 'Curated streetwear for the modern nomad.',
    heroTitle: 'Step into the Future of Fashion',
    heroSubtitle: 'Limited drops and exclusive collaborations.',
    accentColor: '#10b981',
    fontFamily: 'sans',
    buttonRadius: 'md',
    layout: 'grid',
    logoUrl: '',
    bannerUrl: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      tiktok: ''
    }
  });

  const handleUpdate = (key: keyof StoreType | 'socialLinks', value: any) => {
    if (key === 'socialLinks') {
      setSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, ...value } }));
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleFileUpload = async (bucket: string, file: File, key: 'logoUrl' | 'bannerUrl') => {
    try {
      const url = await uploadImage(bucket, file);
      handleUpdate(key, url);
    } catch (err) {
      alert('Failed to upload image');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation of database update
    setTimeout(() => {
      setIsSaving(false);
      alert('Your branded store is now live!');
    }, 1200);
  };

  const fonts = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  return (
    <div className="p-4 md:p-8 bg-neutral-950 min-h-screen pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Store Designer</h1>
            <p className="text-neutral-400 font-medium">Customize your digital showroom to match your brand's DNA.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{isSaving ? 'Deploying...' : 'Deploy Storefront'}</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-white/5 mb-4 overflow-x-auto no-scrollbar">
              {[
                { id: 'design', label: 'Visual Style', icon: Palette },
                { id: 'content', label: 'Store Content', icon: Type },
                { id: 'social', label: 'Social Links', icon: Globe },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-neutral-800 text-emerald-400 shadow-lg' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-neutral-900/50 border border-white/5 rounded-[32px] p-6 md:p-8 space-y-8">
              {activeTab === 'design' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">Brand Accent</label>
                      <div className="flex items-center space-x-4">
                        <input 
                          type="color" 
                          value={settings.accentColor}
                          onChange={(e) => handleUpdate('accentColor', e.target.value)}
                          className="w-14 h-14 bg-transparent border-0 cursor-pointer p-0 overflow-hidden rounded-xl"
                        />
                        <span className="text-sm font-mono text-neutral-400 bg-neutral-950 px-3 py-2 rounded-lg border border-white/5">{settings.accentColor}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">Typography</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['sans', 'serif', 'mono'].map((f) => (
                          <button 
                            key={f}
                            onClick={() => handleUpdate('fontFamily', f)}
                            className={`py-3 rounded-xl border text-sm capitalize ${
                              settings.fontFamily === f ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 font-bold' : 'bg-neutral-950 border-white/5 text-neutral-400'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">Layout Mode</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'grid', icon: LayoutGrid, label: 'Standard' },
                        { id: 'list', icon: ListIcon, label: 'Detailed' },
                        { id: 'mosaic', icon: Smartphone, label: 'Mosaic' },
                      ].map((l) => (
                        <button 
                          key={l.id}
                          onClick={() => handleUpdate('layout', l.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                            settings.layout === l.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-neutral-950 border-white/5 text-neutral-600'
                          }`}
                        >
                          <l.icon size={20} className="mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-3">
                       <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">Logo</label>
                       <input type="file" ref={logoInputRef} className="hidden" onChange={(e) => e.target.files && handleFileUpload('assets', e.target.files[0], 'logoUrl')} />
                       <div 
                         onClick={() => logoInputRef.current?.click()}
                         className="aspect-square bg-neutral-950 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer group hover:border-emerald-500/50 transition-colors"
                       >
                         {settings.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-cover rounded-[22px]" /> : <Camera size={24} className="text-neutral-700" />}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">Store Banner</label>
                       <input type="file" ref={bannerInputRef} className="hidden" onChange={(e) => e.target.files && handleFileUpload('assets', e.target.files[0], 'bannerUrl')} />
                       <div 
                         onClick={() => bannerInputRef.current?.click()}
                         className="aspect-square bg-neutral-950 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer group hover:border-emerald-500/50 transition-colors"
                       >
                         {settings.bannerUrl ? <img src={settings.bannerUrl} className="w-full h-full object-cover rounded-[22px]" /> : <ImageIcon size={24} className="text-neutral-700" />}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">Store Name</label>
                      <input 
                        value={settings.name} 
                        onChange={(e) => handleUpdate('name', e.target.value)}
                        className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">Hero Title</label>
                      <input 
                        value={settings.heroTitle} 
                        onChange={(e) => handleUpdate('heroTitle', e.target.value)}
                        className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 focus:outline-none transition-colors font-bold text-lg"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">Hero Subtitle</label>
                      <textarea 
                        value={settings.heroSubtitle} 
                        onChange={(e) => handleUpdate('heroSubtitle', e.target.value)}
                        rows={3}
                        className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                      />
                   </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  {[
                    { key: 'instagram', icon: Instagram, label: 'Instagram Handle', placeholder: '@username' },
                    { key: 'twitter', icon: Twitter, label: 'Twitter/X Handle', placeholder: '@username' },
                    { key: 'tiktok', icon: Music2, label: 'TikTok Handle', placeholder: '@username' },
                  ].map((s) => (
                    <div key={s.key} className="space-y-2">
                       <label className="text-xs font-black uppercase text-neutral-500 tracking-widest">{s.label}</label>
                       <div className="relative">
                          <s.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                          <input 
                            value={(settings.socialLinks as any)?.[s.key] || ''}
                            placeholder={s.placeholder}
                            onChange={(e) => handleUpdate('socialLinks', { [s.key]: e.target.value })}
                            className="w-full bg-neutral-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 focus:outline-none"
                          />
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-5 sticky top-24 h-fit">
            <div className="flex items-center justify-between mb-4 px-2">
               <div className="flex items-center space-x-2">
                 <Smartphone className="text-neutral-500" size={16} />
                 <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Live Simulator</span>
               </div>
               <div className="flex items-center space-x-1">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div>
                 <span className="text-[10px] font-bold text-neutral-600 uppercase">Live Preview</span>
               </div>
            </div>

            {/* Mobile Simulator Frame */}
            <div className="relative mx-auto w-full max-w-[340px] aspect-[9/19] bg-neutral-900 rounded-[50px] border-[8px] border-neutral-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
               {/* Phone Top Notch */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-2xl z-50"></div>
               
               {/* Internal Screen Content */}
               <div className={`h-full bg-neutral-950 overflow-y-auto no-scrollbar ${fonts[settings.fontFamily || 'sans']}`}>
                  {/* Sim Banner */}
                  <div className="h-32 bg-neutral-900 relative">
                     {settings.bannerUrl ? (
                       <img src={settings.bannerUrl} className="w-full h-full object-cover opacity-60" />
                     ) : (
                       <div className="w-full h-full opacity-30" style={{ backgroundColor: settings.accentColor }}></div>
                     )}
                     <div className="absolute bottom-[-20px] left-4">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-950 border-4 border-neutral-950 flex items-center justify-center overflow-hidden">
                          {settings.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-cover" /> : <span className="text-xs font-bold" style={{ color: settings.accentColor }}>{settings.name?.substring(0, 2).toUpperCase()}</span>}
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 px-4">
                     <h3 className="text-xl font-black text-white leading-tight">{settings.heroTitle}</h3>
                     <p className="text-[10px] text-neutral-500 mt-2 line-clamp-2">{settings.heroSubtitle}</p>
                     
                     <div className="flex space-x-2 mt-4">
                        <button className="flex-1 py-2 text-[10px] font-bold text-white rounded-lg shadow-lg" style={{ backgroundColor: settings.accentColor }}>
                          Shop Now
                        </button>
                        <button className="px-4 py-2 border border-white/10 text-white rounded-lg">
                           <Instagram size={12} />
                        </button>
                     </div>

                     {/* Products Sim */}
                     <div className="mt-8 grid grid-cols-2 gap-3 pb-8">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-2">
                             <div className="aspect-square bg-neutral-950 rounded-xl mb-2"></div>
                             <div className="h-2 w-16 bg-neutral-800 rounded-full mb-1"></div>
                             <div className="h-2 w-8 bg-emerald-500/20 rounded-full"></div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsPage;
