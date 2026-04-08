"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit, 
  Layers, 
  Shirt, 
  PenTool, 
  RefreshCw,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string;
  sort_order: number;
}

const ICON_MAP: Record<string, any> = {
  Sparkles,
  Layers,
  Shirt,
  PenTool
};

export default function ServicesCMSPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    
    if (!error) setServices(data || []);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title || !editingService?.description) return;

    const payload = {
      title: editingService.title,
      description: editingService.description,
      icon_name: editingService.icon_name || "Sparkles",
      image_url: editingService.image_url || "",
      sort_order: editingService.sort_order || 0
    };

    if (editingService.id) {
      const { error } = await supabase.from("services").update(payload).eq("id", editingService.id);
      if (!error) fetchServices();
    } else {
      const { error } = await supabase.from("services").insert(payload);
      if (!error) fetchServices();
    }
    
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) fetchServices();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center">Loading Operations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-center bg-[#1A1A1A] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <Sparkles className="w-24 h-24 text-primary/5 -rotate-12" />
        </div>
        <div>
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Services <span className="text-primary italic">CMS</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Manage the core B2B solution cards</p>
        </div>
        <button 
          onClick={() => { setEditingService({ icon_name: "Sparkles", sort_order: 0 }); setIsModalOpen(true); }}
          className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.map((service) => {
          const Icon = ICON_MAP[service.icon_name] || Sparkles;
          return (
            <motion.div
              key={service.id}
              layout
              className="fluid-glass p-8 rounded-[2.5rem] border border-white/10 group relative overflow-hidden"
            >
              {service.image_url && (
                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img src={service.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                  onClick={() => { setEditingService(service); setIsModalOpen(true); }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all text-gray-500 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500 transition-all text-gray-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-outfit mb-4 text-white uppercase">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm h-12 line-clamp-2 italic">{service.description}</p>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic">Priority index: {service.sort_order}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0F1117] border border-white/10 p-10 rounded-[3rem] shadow-3xl overflow-hidden relative"
            >
               <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white">
                 <X className="w-6 h-6" />
               </button>

               <div className="space-y-1 mb-10">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">Configure <span className="text-primary italic">Service Card</span></h2>
                 <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Define the primary solution offered</p>
               </div>

               <form onSubmit={handleSave} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Service Title</label>
                    <input 
                      required
                      value={editingService?.title || ""}
                      onChange={(e) => setEditingService(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none transition-all text-gray-200" 
                      placeholder="e.g. Custom Apparel Solutions"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Display Description</label>
                    <textarea 
                      required
                      value={editingService?.description || ""}
                      onChange={(e) => setEditingService(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none transition-all text-gray-200 resize-none" 
                      placeholder="High-level value proposition..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Visual Resource URL</label>
                    <input 
                      value={editingService?.image_url || ""}
                      onChange={(e) => setEditingService(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none transition-all text-gray-400 font-mono text-xs" 
                      placeholder="e.g. https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Icon Selection</label>
                      <select 
                        value={editingService?.icon_name || "Sparkles"}
                        onChange={(e) => setEditingService(prev => ({ ...prev, icon_name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none text-gray-200 cursor-pointer uppercase text-[10px] font-black tracking-widest"
                      >
                        <option value="Sparkles" className="bg-[#0F1117]">Sparkles (Quality)</option>
                        <option value="Shirt" className="bg-[#0F1117]">Shirt (Apparel)</option>
                        <option value="Layers" className="bg-[#0F1117]">Layers (Signage)</option>
                        <option value="PenTool" className="bg-[#0F1117]">PenTool (Promotional)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Sort Priority</label>
                      <input 
                        type="number"
                        value={editingService?.sort_order || 0}
                        onChange={(e) => setEditingService(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none text-gray-200"
                      />
                    </div>
                  </div>

                  <button className="w-full bg-primary hover:bg-red-700 text-white font-black py-7 rounded-2xl transition-all shadow-2xl shadow-primary/30 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4">
                    <Save className="w-5 h-5" /> Deploy Service Parameters
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
