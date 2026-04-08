"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Power,
  RefreshCw,
  X,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  is_active: boolean;
  image_url?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("product_categories").select("*").order("name", { ascending: true })
    ]);
    
    if (!prodRes.error) setProducts(prodRes.data || []);
    if (!catRes.error) setCategories(catRes.data || []);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title) return;

    const payload = {
      title: editingProduct.title,
      description: editingProduct.description || "",
      category: editingProduct.category || (categories[0]?.name || ""),
      price: editingProduct.price || 0,
      stock: editingProduct.stock || 0,
      is_active: editingProduct.is_active ?? true,
      image_url: editingProduct.image_url || ""
    };

    let error;
    if (editingProduct.id) {
      const { error: err } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      error = err;
    } else {
      const { error: err } = await supabase.from("products").insert(payload);
      error = err;
    }

    if (error) {
      setMessage({ type: "error", text: "Operation failed." });
    } else {
      setMessage({ type: "success", text: "Product catalog updated." });
      fetchData();
      setIsModalOpen(false);
      setEditingProduct(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;

    const { error } = await supabase.from("product_categories").insert({ name: newCategoryName });
    if (error) {
      setMessage({ type: "error", text: "Failed to add category." });
    } else {
      setMessage({ type: "success", text: "Category added." });
      setNewCategoryName("");
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const inUse = products.some(p => p.category === name);
    if (inUse) {
      alert("Cannot delete category currently assigned to products.");
      return;
    }

    if (!confirm(`Remove category "${name}"?`)) return;
    
    const { error } = await supabase.from("product_categories").delete().eq("id", id);
    if (!error) {
      setMessage({ type: "success", text: "Category removed." });
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setMessage({ type: "success", text: "Product removed." });
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);
    if (!error) fetchData();
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest text-center italic">Synchronizing Operational Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Inventory <span className="text-primary italic">CMS</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Operational oversight of your B2B product catalog</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-8 py-4 rounded-2xl font-bold bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
          >
            Manage Categories
          </button>
          <button 
            onClick={() => { setEditingProduct({ category: categories[0]?.name || "", price: 0, stock: 0, is_active: true }); setIsModalOpen(true); }}
            className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px]"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest ${
              message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-primary/10 text-primary border border-primary/20'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <Search className="absolute left-6 top-6 w-5 h-5 text-gray-700" />
        <input 
          type="text" 
          placeholder="Filter catalog by title or dynamic category..."
          className="w-full bg-[#1A1A1A] border border-white/5 p-6 pl-16 rounded-3xl outline-none focus:border-primary/50 transition-all text-sm text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/[0.02] uppercase tracking-[0.2em] text-[10px] font-black text-gray-600 border-b border-white/5">
                <th className="p-10">Product Brief</th>
                <th className="p-10 text-center">Category</th>
                <th className="p-10 text-center">Stock Level</th>
                <th className="p-10 text-center">Unit Price</th>
                <th className="p-10 text-center">Operational Status</th>
                <th className="p-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <motion.tr 
                  key={product.id}
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group"
                >
                  <td className="p-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#121212] flex items-center justify-center rounded-[1.5rem] border border-white/5 group-hover:border-primary/20 transition-all overflow-hidden shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-800" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="font-outfit font-black text-lg text-white uppercase tracking-tight block leading-none">{product.title}</span>
                        <span className="text-[10px] text-gray-700 uppercase tracking-widest font-black">ID: {product.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-10 text-center">
                    <span className="bg-white/5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 border border-white/5 whitespace-nowrap">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-10 text-center">
                    <span className={`text-xs font-mono font-black ${product.stock < 10 ? "text-primary shadow-[0_0_15px_rgba(234,0,44,0.2)]" : "text-gray-500"}`}>
                      {product.stock.toLocaleString()} UNITS
                    </span>
                  </td>
                  <td className="p-10 text-center font-mono font-black text-white text-sm">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="p-10">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => toggleActive(product)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${product.is_active ? "text-green-500 bg-green-500/5 border border-green-500/10" : "text-gray-600 bg-white/5 border border-white/10 hover:text-white"}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${product.is_active ? "bg-green-500 animate-pulse" : "bg-gray-700"}`} />
                        {product.is_active ? "Live" : "Inactive"}
                      </button>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="flex items-center justify-end gap-6 text-gray-700">
                      <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="hover:text-white transition-colors p-2 bg-white/5 rounded-xl border border-white/5"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className="hover:text-primary transition-colors p-2 bg-white/5 rounded-xl border border-white/5"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="p-32 text-center text-gray-600 uppercase tracking-widest text-[10px] font-black italic opacity-40">
            No operational line items detected.
          </div>
        )}
      </div>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#0F1117] border border-white/10 p-12 rounded-[3.5rem] shadow-3xl overflow-hidden relative"
            >
               <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-gray-700 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all">
                 <X className="w-6 h-6" />
               </button>

               <div className="space-y-1 mb-10">
                 <h2 className="text-3xl font-outfit font-black text-white uppercase tracking-tight leading-none">Catalog <span className="text-primary italic">Specifications</span></h2>
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Update technical parameters for B2B procurement</p>
               </div>

               <form onSubmit={handleSave} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Product Designation</label>
                    <input 
                      required
                      value={editingProduct?.title || ""}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl focus:border-primary/50 outline-none transition-all text-gray-200" 
                      placeholder="e.g. Industrial Embroidered Headware"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Production Brief</label>
                    <textarea 
                      value={editingProduct?.description || ""}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl focus:border-primary/50 outline-none transition-all text-gray-200 resize-none px-6" 
                      placeholder="Detailed manufacturing specifications..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Dynamic Category</label>
                      <select 
                        value={editingProduct?.category || (categories[0]?.name || "")}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl focus:border-primary/50 outline-none text-gray-200 uppercase text-[10px] font-black tracking-widest cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name} className="bg-[#0F1117] text-white py-4 font-bold">{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Visibility Lock</label>
                      <select 
                        value={editingProduct?.is_active ? "true" : "false"}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, is_active: e.target.value === "true" }))}
                        className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl focus:border-primary/50 outline-none text-gray-200 uppercase text-[10px] font-black tracking-widest cursor-pointer"
                      >
                        <option value="true" className="bg-[#0F1117]">Session Active</option>
                        <option value="false" className="bg-[#0F1117]">Draft Archive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2">Proprietary Value ($)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={editingProduct?.price || 0}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        className="w-full bg-transparent border-b border-primary/20 p-2 text-center text-xl font-mono font-black text-white outline-none"
                      />
                    </div>
                    <div className="space-y-4 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2">Volume Availability</label>
                      <input 
                        type="number"
                        value={editingProduct?.stock || 0}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                        className="w-full bg-transparent border-b border-blue-500/20 p-2 text-center text-xl font-mono font-black text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Visual Resource Link</label>
                    <input 
                      value={editingProduct?.image_url || ""}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl focus:border-primary/50 outline-none transition-all text-gray-400 text-xs font-mono" 
                      placeholder="e.g. https://storage.resource.ca/thumbnail.webp"
                    />
                  </div>

                  <button className="w-full bg-primary hover:bg-red-700 text-white font-black py-7 rounded-2xl transition-all shadow-2xl shadow-primary/30 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 group active:scale-[0.98]">
                    <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Commit to Production Hub
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CATEGORY MANAGEMENT MODAL */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-xl bg-[#0F1117] border border-white/10 p-12 rounded-[3.5rem] shadow-4xl relative overflow-hidden"
            >
               <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-10 right-10 text-gray-700 hover:text-white p-2 rounded-full transition-all">
                 <X className="w-6 h-6" />
               </button>

               <div className="space-y-1 mb-12">
                 <h2 className="text-3xl font-outfit font-black text-white uppercase tracking-tight">Category <span className="text-primary italic">Architecture</span></h2>
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Manage the organizational structure of your catalog</p>
               </div>

               <form onSubmit={handleAddCategory} className="flex gap-4 mb-12">
                  <input 
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-grow bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary/50 outline-none text-gray-200 text-xs font-bold uppercase tracking-widest"
                    placeholder="NEW CATEGORY NAME..."
                  />
                  <button className="bg-primary hover:bg-red-700 text-white px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add
                  </button>
               </form>

               <div className="space-y-3 max-h-[350px] overflow-y-auto px-2 custom-scrollbar">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                       <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{cat.name}</span>
                       <button 
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="text-gray-700 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-center text-gray-700 uppercase tracking-widest text-[8px] font-black py-10 opacity-40 italic">Structural baseline unknown.</p>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
