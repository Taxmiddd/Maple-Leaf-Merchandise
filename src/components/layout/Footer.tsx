"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, Truck, Globe, Coffee, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Footer() {
  const pathname = usePathname();
  const [config, setConfig] = useState<Record<string, string>>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("site_config").select("key, value");
      const configMap = (data || []).reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
      setConfig(configMap);
    };
    fetchConfig();
  }, []);

  const isAuthPage = pathname === "/login" || pathname.startsWith("/admin") || pathname.startsWith("/projects") || pathname.startsWith("/dashboard");

  if (isAuthPage) return null;

  return (
    <footer className="py-24 px-6 md:px-24 bg-[#0A0C11] border-t border-white/5 relative overflow-hidden">
      {/* Decorative Atmosphere */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
        {/* Column 1: Branding */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center font-bold text-primary italic">M</div>
            <span className="font-outfit text-xl font-bold text-white tracking-tight">{config.business_name || "Maple Leaf Trading"}</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            {config.footer_branding || "Dedicated to the art of B2B merchandising, driven by quality Canadian craftsmanship."}
          </p>
          <div className="flex gap-4">
             <Link href={`https://wa.me/${config.whatsapp_number}`} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:border-primary/50 transition-all cursor-pointer group">
                <Coffee className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
             </Link>
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 grayscale hover:grayscale-0 transition-all cursor-pointer">
                <Globe className="w-5 h-5 text-blue-400" />
             </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6">
          <h4 className="text-white font-bold text-sm uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li><Link href="/services" className="hover:text-primary transition-colors">B2B Services</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Product Catalog</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/login" className="hover:text-primary transition-colors">Client Portal</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="space-y-6">
          <h4 className="text-white font-bold text-sm uppercase tracking-widest">Connect</h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li className="flex flex-col gap-1">
              <span className="text-gray-600 text-xs uppercase font-bold">Office</span>
              <span>{config.office_address || "123 Business Way, Vancouver, BC"}</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-gray-600 text-xs uppercase font-bold">Inquiries</span>
              <span>{config.contact_phone || "+1 (604) 555-0123"}</span>
              <span>{config.contact_email || "hello@mapleleaf-trading.ca"}</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Trust Badges */}
        <div className="space-y-8">
           <div className="p-6 fluid-glass rounded-[2rem] border border-white/10 space-y-4 shadow-xl">
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Certified Quality</h5>
              <div className="flex flex-wrap gap-4 items-center opacity-60">
                 <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase">Canadian Made</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase font-black">Nationwide</span>
                 </div>
              </div>
           </div>
           <div className="opacity-40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" /> Square Checkout Integrated
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left opacity-30">
        <div className="text-[10px] font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} {config.business_name || "Maple Leaf Trading Ltd."}
        </div>
        <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Trade</Link>
          <Link href="/logistics" className="hover:text-white transition-colors">Logistics</Link>
        </div>
      </div>
    </footer>
  );
}
