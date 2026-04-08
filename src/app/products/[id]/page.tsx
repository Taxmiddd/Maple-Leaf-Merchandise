"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Shirt, 
  PenTool,
  Clock,
  CheckCircle2,
  Plus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1117]">
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-t-2 border-primary rounded-full" 
         />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1117] space-y-8">
         <h1 className="text-4xl font-outfit font-bold text-white">Item not found</h1>
         <Link href="/products" className="text-primary font-bold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to catalog
         </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 md:px-24 bg-[#0F1117] relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springTransition}
          className="relative"
        >
          <button 
            onClick={() => router.back()}
            className="absolute -top-12 left-0 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to explore
          </button>
          
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <Image 
              src={product.image_url || "/hero.png"} 
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-8">
             {[1,2,3,4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                   <Image src={product.image_url || "/hero.png"} alt="Alt view" fill className="object-cover" />
                </div>
             ))}
          </div>
        </motion.div>

        {/* Right: Product Details */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springTransition}
          className="space-y-10"
        >
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase px-4 py-1.5 bg-primary/10 w-fit rounded-full">
                <CheckCircle2 className="w-3 h-3" /> AVAILABLE FOR B2B
             </div>
             <h1 className="text-4xl md:text-6xl font-outfit font-black text-white leading-tight">{product.name}</h1>
             <p className="text-3xl font-black text-primary tracking-tighter">${product.price} <span className="text-xs text-gray-500 uppercase tracking-widest">Starting at</span></p>
          </div>

          <div className="space-y-6">
             <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
             <div className="flex flex-wrap gap-4">
                {product.tags?.map((tag: string) => (
                   <span key={tag} className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-gray-400 border border-white/5">{tag}</span>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 fluid-glass rounded-3xl border border-white/10 space-y-2">
                <Clock className="w-5 h-5 text-primary" />
                <h4 className="text-white font-bold text-sm">Lead Time</h4>
                <p className="text-gray-500 text-xs">7-10 Business Days</p>
             </div>
             <div className="p-6 fluid-glass rounded-3xl border border-white/10 space-y-2">
                <Truck className="w-5 h-5 text-primary" />
                <h4 className="text-white font-bold text-sm">Logistics</h4>
                <p className="text-gray-500 text-xs">Canada-wide Shipping</p>
             </div>
          </div>

          <div className="flex flex-col gap-4">
             <button 
               className="w-full bg-primary hover:bg-red-700 text-white font-bold py-6 rounded-3xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
               onClick={() => alert("Added to your B2B Project Brief!")}
             >
                <Plus className="w-5 h-5" /> Add to project brief
             </button>
             <button className="w-full fluid-glass hover:bg-white/5 text-white font-bold py-6 rounded-3xl transition-all border border-white/10 flex items-center justify-center gap-3">
                Request custom mockup
             </button>
          </div>

          <div className="space-y-4 pt-10 border-t border-white/5">
             <div className="flex items-center gap-4 text-gray-300">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Secure B2B Data Encryption</span>
             </div>
             <div className="flex items-center gap-4 text-gray-300">
                <Shirt className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Premium 100% Quality Guarantee</span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
