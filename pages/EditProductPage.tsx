
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../types';
import { Camera, ArrowLeft, CheckCircle2, Package, DollarSign, Upload, Loader2, Save } from 'lucide-react';
import { supabase, uploadImage } from '../supabaseClient';

interface EditProductPageProps {
  onUpdate: () => void;
  user: User | null;
}

const EditProductPage: React.FC<EditProductPageProps> = ({ onUpdate, user }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Clothing' as 'Clothing' | 'Shoes',
    image_url: ''
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name,
          description: data.description || '',
          price: data.price.toString(),
          stock: data.stock.toString(),
          category: data.category as 'Clothing' | 'Shoes',
          image_url: data.image_url || ''
        });
        setPreviewUrl(data.image_url || '');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to fetch product');
      navigate('/my-products');
    } finally {
      setLoading(false);
    }
  };

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
    if (!user) return;
    
    setSaving(true);
    try {
      let finalImageUrl = formData.image_url;

      // 1. Upload new image if selected
      if (selectedFile) {
        finalImageUrl = await uploadImage('products', selectedFile);
      }

      // 2. Update Product Record
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category,
          image_url: finalImageUrl,
        })
        .eq('id', productId);

      if (error) throw error;
      
      onUpdate();
      alert('Product updated successfully!');
      navigate('/my-products');
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-neutral-950 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/my-products')}
          className="flex items-center text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Inventory
        </button>

        <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-900/20 text-emerald-500 rounded-lg"><Package size={20} /></div>
                <h2 className="text-xl font-bold">Edit Product</h2>
              </div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest bg-neutral-950 px-3 py-1 rounded-full border border-white/5">
                ID: {productId?.substring(0, 8)}...
              </span>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-neutral-500 ml-1">Product Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Product Name" 
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4 focus:border-emerald-500 transition-colors" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-neutral-500 ml-1">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4 focus:border-emerald-500 transition-colors"
                >
                  <option value="Clothing">Clothing</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-500 ml-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows={4} 
                  placeholder="Product description..." 
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4 focus:border-emerald-500 transition-colors resize-none" 
                />
              </div>
            </div>

            {/* Pricing & Stock Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-neutral-500 ml-1">Retail Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    placeholder="0.00" 
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-emerald-500 transition-colors" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-neutral-500 ml-1">Available Quantity</label>
                <input 
                  type="number" 
                  name="stock" 
                  value={formData.stock} 
                  onChange={handleInputChange} 
                  placeholder="0" 
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 px-4 focus:border-emerald-500 transition-colors" 
                  required
                />
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4">
              <label className="text-xs text-neutral-500 ml-1">Product Media</label>
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
                    <p className="text-white font-medium">Click to change image</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-emerald-950/20 disabled:opacity-50 flex items-center justify-center space-x-2 hover:bg-emerald-800 transition-all"
            >
              {saving ? (
                <><Loader2 className="animate-spin" size={20} /><span>Saving Changes...</span></>
              ) : (
                <><Save size={20} /><span>Update Product</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
