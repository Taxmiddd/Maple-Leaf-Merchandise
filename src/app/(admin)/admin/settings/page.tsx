"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface ConfigItem {
  key: string;
  value: string;
  category: string;
  description: string;
}

export default function AdminSettingsPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .order("category", { ascending: true });
    
    if (error) {
      setMessage({ type: "error", text: "Failed to load settings." });
    } else {
      setConfigs(data || []);
    }
    setLoading(false);
  };

  const handleUpdateValue = (key: string, newValue: string) => {
    setConfigs(prev => prev.map(item => item.key === key ? { ...item, value: newValue } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const updates = configs.map(item => ({
      key: item.key,
      value: item.value,
      category: item.category,
      description: item.description
    }));

    const { error } = await supabase
      .from("site_config")
      .upsert(updates);

    if (error) {
      setMessage({ type: "error", text: "Error saving changes. Check permissions." });
    } else {
      setMessage({ type: "success", text: "Global settings updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    }
    setSaving(false);
  };

  const seedMissingKeys = async () => {
    setSaving(true);
    const defaultKeys = [
      { key: 'business_name', value: 'Maple Leaf Trading Ltd.', category: 'Company', description: 'The official brand name.' },
      { key: 'contact_email', value: 'hello@mapleleaf-trading.ca', category: 'Contact', description: 'Primary business email.' },
      { key: 'contact_phone', value: '+1 (604) 555-0123', category: 'Contact', description: 'Main office phone number.' },
      { key: 'hero_title', value: 'Bringing your brand, to life, together.', category: 'Hero', description: 'The primary H1 on the landing page.' },
      { key: 'hero_subtitle', value: 'We partner with you to craft premium merchandise and signage that tells your unique story with high-end Canadian quality.', category: 'Hero', description: 'The secondary text under the Hero title.' },
      { key: 'hero_image_url', value: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200', category: 'Hero', description: 'The primary branding image URL for the landing page.' }
    ];

    const { error } = await supabase.from("site_config").upsert(defaultKeys, { onConflict: 'key' });
    
    if (error) {
      setMessage({ type: "error", text: "Failed to seed keys: " + error.message });
    } else {
      setMessage({ type: "success", text: "Default configuration keys initialized!" });
      fetchConfigs();
    }
    setSaving(false);
  };

  const categories = Array.from(new Set(configs.map(c => c.category)));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hydrating Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">
            Global <span className="text-primary italic">Controls</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
            Dynamic site configuration & brand metadata
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={seedMissingKeys}
            disabled={saving}
            className="px-8 py-4 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Seed Default Config
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-red-700 disabled:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 min-w-[200px]"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving Changes..." : "Deploy Updates"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
              message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-primary/10 text-primary border border-primary/20'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation / Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           {categories.map(cat => (
             <div key={cat} className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-gray-500 hover:text-white transition-all cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>
             </div>
           ))}
           <div className="p-6 rounded-[2.5rem] bg-primary/5 border border-primary/10 mt-8">
              <Sparkles className="w-5 h-5 text-primary mb-4" />
              <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-wider">
                Changes made here reflect globally across the public portal and mobile app instantly.
              </p>
           </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3 space-y-12">
          {categories.map((cat) => (
            <section key={cat} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-outfit font-bold text-white uppercase tracking-tight">{cat} Settings</h3>
                <div className="h-[1px] flex-grow bg-white/5" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                 {configs.filter(c => c.category === cat).map((config) => (
                   <div key={config.key} className="space-y-2 group">
                      <div className="flex justify-between items-end px-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-focus-within:text-primary transition-colors">
                            {config.key.replace(/_/g, ' ')}
                         </label>
                         <span className="text-[10px] text-gray-700 italic">{config.description}</span>
                      </div>
                      {config.value.length > 60 ? (
                        <textarea 
                          rows={3}
                          value={config.value}
                          onChange={(e) => handleUpdateValue(config.key, e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-white/5 p-5 rounded-2xl outline-none focus:border-primary/50 transition-all text-sm text-gray-200 resize-none font-medium leading-relaxed"
                        />
                      ) : (
                        <input 
                          type="text"
                          value={config.value}
                          onChange={(e) => handleUpdateValue(config.key, e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-white/5 p-5 rounded-2xl outline-none focus:border-primary/50 transition-all text-sm text-gray-200 font-medium"
                        />
                      )}
                   </div>
                 ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
