"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Layers, 
  Shirt, 
  PenTool,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { id: "all", label: "All Items", icon: Sparkles },
  { id: "apparel", label: "Custom Apparel", icon: Shirt },
  { id: "signage", label: "Commercial Signage", icon: Layers },
  { id: "promo", label: "Brand Merchandise", icon: PenTool },
];

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from("inventory").select("*");
      
      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }
      
      const { data, error } = await query;
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [activeCategory, supabase]);

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 md:px-24 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
         <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
         <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="text-center mb-20"
        >
          <span className="text-primary font-bold tracking-widest text-xs mb-4 block uppercase px-4 py-1 bg-primary/10 w-fit mx-auto rounded-full">Explore our capabilities</span>
          <h1 className="text-4xl md:text-6xl font-outfit font-black mb-6 text-white">Full-Scale Merchandising.</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Discover our range of premium signage, custom apparel, and high-end promotional solutions crafted for modern brands.</p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all border ${
                activeCategory === cat.id 
                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105" 
                : "fluid-glass text-gray-400 border-white/10 hover:border-white/30"
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="h-[450px] fluid-glass animate-pulse rounded-[2.5rem] border border-white/5" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...springTransition, delay: idx * 0.05 }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="fluid-glass rounded-[2.5rem] overflow-hidden border border-white/10 group cursor-pointer"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image 
                        src={product.image_url || "/hero.png"} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent opacity-60" />
                      <div className="absolute top-6 right-6">
                         <div className="px-4 py-1.5 fluid-glass rounded-full text-xs font-bold text-white uppercase border border-white/20">
                            {product.category}
                         </div>
                      </div>
                    </div>
                    <div className="p-10 space-y-4">
                      <h3 className="text-2xl font-bold font-outfit text-white leading-tight">{product.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                      <div className="pt-4 flex items-center justify-between border-t border-white/5">
                         <span className="text-primary font-black tracking-tighter text-xl">
                            ${product.price} <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Base Rate</span>
                         </span>
                         <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                         </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 space-y-6"
          >
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Filter className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white">No items found in this section</h3>
            <p className="text-gray-500 max-w-sm mx-auto">We're constantly updating our inventory. Contact us for custom sourcing requests.</p>
            <button 
              onClick={() => setActiveCategory("all")}
              className="text-primary font-bold hover:underline"
            >
              Back to all items
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
