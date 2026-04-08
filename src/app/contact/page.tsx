"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Coffee as WhatsApp,
  MessageSquare,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("site_config").select("key, value");
      const configMap = (data || []).reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
      setConfig(configMap);
      setLoading(false);
    };
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1117] pt-40 pb-24 px-6 md:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Left Column: Vision & Identity */}
        <div className="space-y-12">
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-primary font-black uppercase tracking-[0.3em] text-[10px]"
            >
               Connect with Partnership
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-5xl md:text-7xl font-outfit font-black text-white leading-tight uppercase"
            >
               Let's build <br />
               <span className="text-primary italic">something real.</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-lg"
            >
               Whether you're starting a new brand rollout or need architectural signage, our team is ready to listen to your brief.
            </motion.p>
          </div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
             <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Office HQ</span>
                <p className="text-gray-300 font-bold">{config.office_address}</p>
             </div>
             <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Response Time</span>
                <p className="text-gray-300 font-bold">Within 24 Business Hours</p>
             </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="pt-12 border-t border-white/5 space-y-6"
          >
             <h3 className="text-white font-bold uppercase tracking-widest text-xs">Direct Channels</h3>
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-gray-400 group">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
                      <Phone className="w-4 h-4" />
                   </div>
                   <span className="font-bold">{config.contact_phone}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400 group">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
                      <Mail className="w-4 h-4" />
                   </div>
                   <span className="font-bold">{config.contact_email}</span>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
           <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="fluid-glass p-10 md:p-16 rounded-[3.5rem] border border-white/10 shadow-3xl text-center flex flex-col items-center gap-8"
           >
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                 <WhatsApp className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">Direct WhatsApp</h2>
                 <p className="text-gray-500 text-sm max-w-xs mx-auto">The fastest way to reach our logistics and production team.</p>
              </div>
              <Link 
                href={`https://wa.me/${config.whatsapp_number}`} 
                target="_blank"
                className="w-full bg-primary hover:bg-red-700 text-white font-bold py-6 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                 Open Messenger <ArrowRight className="w-4 h-4" />
              </Link>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="fluid-glass p-10 rounded-[2.5rem] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all"
           >
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">Share a Brief</h4>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Submit 3D models and project docs</p>
                 </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-primary transition-all" />
           </motion.div>
        </div>
      </div>
    </main>
  );
}
