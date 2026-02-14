
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Camera, Plus, ArrowLeft, ArrowRight, CheckCircle2, Package, DollarSign, Upload, Loader2 } from 'lucide-react';
import { supabase, uploadImage } from '../supabaseClient';

interface AddProductPageProps {
  onAdd: () => void;
  user: User | null;
}

const AddProductPage: React.FC<AddProductPageProps> = ({ onAdd, user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Clothing' as 'Clothing' | 'Shoes'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFile) return;
    
    setLoading(true);
    try {
      // 1. Upload Image to Supabase Storage
      const uploadedUrl = await uploadImage('products', selectedFile);

      // 2. Insert Product Record with the new URL
      const { error } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category,
          image_url: uploadedUrl,
          seller_id: user.id
        }]);

      if (error) throw error;
      
      onAdd();
      setStep(4); // Success step
    } catch (err: any) {
      alert(err.message || 'Failed to upload product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-neutral-950 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => step === 1 ? navigate('/seller') : setStep(step - 1)}
          className="flex items-center text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          {step === 4 ? "Dashboard" : "Back"}
        </button>

        {step < 4 && (
          <div className="flex items-center justify-between mb-12 px-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s ? 'bg-emerald-900 text-white' : 'bg-neutral-900 text-neutral-600 border border-white/5'
                }`}>
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                {s < 3 && (
                  <div className={`h-1 flex-1 mx-4 rounded-full transition-all ${
                    step > s ? 'bg-emerald-900' : 'bg-neutral-900'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-emerald-900/20 text-emerald-500 rounded-lg"><Package size={20} /></div>
                <h2 className="text-xl font-bold">Product Details</h2>
              </div>
              <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name (e.g. Vintage Denim)" className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4 focus:border-emerald-500 transition-colors" />
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4">
                  <option value="Clothing">Clothing</option>
                  <option value="Shoes">Shoes</option>
                </select>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Description (material, fit, care instructions...)" className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4 focus:border-emerald-500 transition-colors resize-none" />
              </div>
              <button 
                onClick={() => setStep(2)} 
                disabled={!formData.name}
                className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-emerald-900/20 text-emerald-500 rounded-lg"><DollarSign size={20} /></div>
                <h2 className="text-xl font-bold">Pricing & Stock</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500 ml-1">Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500 ml-1">Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="1" className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4" />
                </div>
              </div>
              <button 
                onClick={() => setStep(3)} 
                disabled={!formData.price || !formData.stock}
                className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="flex items-center space-x-3 mb-2 text-left">
                <div className="p-2 bg-emerald-900/20 text-emerald-500 rounded-lg"><Camera size={20} /></div>
                <h2 className="text-xl font-bold">Product Media</h2>
              </div>
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
                ref={fileInputRef} 
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] bg-neutral-950 border-2 border-dashed border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center cursor-pointer group"
              >
                 {previewUrl ? (
                   <>
                    <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Upload size={32} className="text-white" />
                    </div>
                   </>
                 ) : (
                   <div className="text-center p-6">
                     <Camera size={48} className="mx-auto mb-4 text-emerald-500/50" />
                     <p className="text-white font-medium">Click to select product image</p>
                     <p className="text-xs text-neutral-500 mt-1">High quality 4:3 images recommended</p>
                   </div>
                 )}
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={loading || !selectedFile} 
                className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-emerald-950/20 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /><span>Uploading...</span></>
                ) : (
                  'Publish Product'
                )}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Product Live!</h2>
                <p className="text-neutral-500 mt-2">Your item is now visible to thousands of resellers.</p>
              </div>
              <button 
                onClick={() => navigate('/seller')} 
                className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
