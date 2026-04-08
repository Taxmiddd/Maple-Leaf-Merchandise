"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers, PenTool, Shirt, Sparkles, Users, Heart, ShieldCheck, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { id: "apparel", title: "Custom apparel", icon: Shirt, description: "We help you craft premium apparel that your team and clients will love to wear, every day." },
  { id: "signage", title: "Commercial signage", icon: Layers, description: "Let's make your physical space as welcoming as your brand with elegant architectural solutions." },
  { id: "promo", title: "Brand merchandise", icon: PenTool, description: "Thoughtful, high-quality items designed to represent your excellence and build lasting connections." },
];

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function LandingPage() {
  const containerRef = useRef(null);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Config
      const { data: configData } = await supabase.from("site_config").select("key, value");
      const configMap = (configData || []).reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
      setConfig(configMap);

      // Fetch Services
      const { data: servicesData } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
      setServices(servicesData || []);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const ICON_MAP: Record<string, any> = { Shirt, Layers, PenTool, Sparkles };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col selection:bg-primary/30 relative min-h-screen">
      {/* Premium Atmospheric Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0C10]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1E2230_0%,transparent_70%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#1E2230_0%,transparent_70%)] opacity-30" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/5 blur-[150px]" 
        />
      </div>

      <main className="flex-grow z-10">
        {/* High-Impact Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-8 pt-32 pb-24 md:pt-48 md:pb-40 text-center lg:text-left lg:flex-row lg:px-24 gap-20 lg:gap-32 overflow-hidden">
          <div className="max-w-4xl lg:max-w-[55%] z-20 space-y-12">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={springTransition}
                className="flex items-center gap-4 text-primary font-black tracking-[0.3em] text-[10px] uppercase mb-4 px-6 py-2 bg-white/[0.03] border border-white/5 w-fit mx-auto lg:mx-0 rounded-full backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Engineering Human Connections
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.1 }}
                className="text-5xl md:text-8xl lg:text-[100px] font-outfit font-black leading-[0.9] tracking-tight text-white mb-8"
              >
                {config.hero_title?.split(',')[0] || "Bringing Your Brand"} <br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-red-800 drop-shadow-2xl">
                  {config.hero_title?.split(',')[1] || "To Life"}
                </span>
                <span className="text-white">.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.2 }}
                className="text-lg md:text-2xl text-gray-500 max-w-2xl leading-relaxed font-black uppercase tracking-widest italic"
              >
                {config.hero_subtitle}
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            >
              <Link href="#quote" className="w-full sm:w-auto bg-primary hover:bg-red-700 text-white px-12 py-7 rounded-[2rem] font-black transition-all flex items-center justify-center gap-4 group shadow-[0_20px_50px_rgba(239,68,68,0.2)] uppercase tracking-widest text-xs active:scale-95">
                Initialize Project <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/products" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-12 py-7 rounded-[2rem] font-black transition-all border border-white/5 uppercase tracking-widest text-xs backdrop-blur-xl flex items-center justify-center active:scale-95">
                Explore Catalog
              </Link>
            </motion.div>

            {/* Micro Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-12 flex flex-wrap justify-center lg:justify-start gap-12 border-t border-white/5"
            >
              {[
                { label: "Verified Partners", val: "500+" },
                { label: "Canadian Made", val: "100%" },
                { label: "Lead Time (Days)", val: "7-14" }
              ].map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-xl font-black text-white font-mono">{s.val}</div>
                  <div className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em]">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ ...springTransition, delay: 0.4 }}
            className="w-full max-w-2xl aspect-[3/4] lg:aspect-square relative flex items-center justify-center"
          >
            {/* Visual Framing */}
            <div className="absolute inset-[-10%] bg-primary/20 blur-[120px] rounded-full animate-pulse opacity-30" />
            <div className="relative z-10 w-full h-full p-4 rounded-[4rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-4xl group">
               <div className="relative w-full h-full rounded-[3rem] overflow-hidden">
                 <Image 
                   src={config.hero_image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"} 
                   alt="Canadian Craftsmanship" 
                   fill 
                   priority
                   className="object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out"
                   sizes="(max-width: 1024px) 100vw, 50vw"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent opacity-80" />
                 
                 {/* Premium Overlay Label */}
                 <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Quality Assured</div>
                    <div className="text-lg font-bold text-white font-outfit uppercase">Master Craftsmanship Archive</div>
                 </div>
               </div>
            </div>
            
            {/* Floating Decorative Elements */}
            <motion.div 
               animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
               transition={{ duration: 6, repeat: Infinity }}
               className="absolute top-10 right-10 w-24 h-24 bg-primary/10 backdrop-blur-2xl rounded-3xl border border-primary/20 z-20 hidden xl:flex items-center justify-center"
            >
               <Sparkles className="w-10 h-10 text-primary opacity-50" />
            </motion.div>
          </motion.div>
        </section>

        {/* Dynamic Categories */}
        <section className="py-24 px-6 md:px-24">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold mb-6">How we help.</h2>
            <p className="text-gray-400 text-lg">Every project is handled with personalized care, ensuring your DNA is woven into everything we create.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((cat, idx) => {
              const Icon = ICON_MAP[cat.icon_name] || Sparkles;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...springTransition, delay: idx * 0.1 }}
                  className="fluid-glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 group transition-all"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:rotate-6 transition-all duration-500">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-outfit mb-4 text-white">{cat.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-8 text-sm md:text-base">{cat.description}</p>
                  <Link href="/products" className="text-primary font-bold flex items-center gap-2 text-sm">
                    View catalog <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Lead Generation Brief */}
        <section id="quote" className="py-24 px-6 md:px-24 flex flex-col xl:flex-row gap-16 items-center">
           <div className="w-full xl:w-1/2 space-y-10 text-center xl:text-left">
              <h2 className="text-4xl md:text-7xl font-outfit font-bold mb-6 leading-[1.1]">Share your brief.</h2>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                 We're here to listen. Tell us about your project, and let's explore how we can bring your vision into reality together.
              </p>
              
              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto xl:mx-0">
                {[
                  { icon: Users, label: "Partner Led" },
                  { icon: Heart, label: "Human Centric" },
                  { icon: ShieldCheck, label: "Encrypted" },
                  { icon: FileText, label: "Integrated" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 fluid-glass rounded-2xl border border-white/5">
                     <item.icon className="w-5 h-5 text-primary" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{item.label}</span>
                  </div>
                ))}
              </div>
           </div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="w-full xl:w-1/2 p-8 md:p-12 fluid-glass rounded-[3rem] border border-white/10 shadow-2xl"
           >
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Name or Brand</label>
                    <input className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none transition-all placeholder:text-gray-700" placeholder="e.g. Maple Leaf Trading" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Your Email</label>
                    <input className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none transition-all placeholder:text-gray-700" placeholder="hello@yourbrand.ca" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Project Brief</label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none transition-all placeholder:text-gray-700 resize-none" placeholder="Describe your vision..." />
                 </div>
                 <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 min-h-[56px] text-lg uppercase tracking-widest">
                    Submit Brief
                 </button>
              </form>
           </motion.div>
        </section>
      </main>
    </div>
  );
}
