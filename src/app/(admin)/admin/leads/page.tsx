"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  RefreshCw,
  ExternalLink,
  Briefcase,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  project_details: string;
  status: string;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error) setLeads(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      setMessage({ type: "error", text: "Failed to update lead status." });
    } else {
      setMessage({ type: "success", text: `Lead status updated to ${newStatus}.` });
      fetchLeads();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (l.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'text-primary bg-primary/10 border-primary/20';
      case 'Contacted': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Quoted': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Converted': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Spam': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest text-center italic">Harvesting Potential Partnerships...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Corporate <span className="text-primary italic">Leads</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Acquisition and management of B2B quote requests</p>
        </div>
        <div className="flex flex-wrap gap-3">
           {['All', 'New', 'Contacted', 'Quoted', 'Converted'].map(s => (
             <button 
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 statusFilter === s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-gray-500 hover:bg-white/10'
               }`}
             >
               {s}
             </button>
           ))}
        </div>
      </header>

      <AnimatePresence>
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
          placeholder="Filter by lead name, corporate entity, or electronic address..."
          className="w-full bg-[#1A1A1A] border border-white/5 p-6 pl-16 rounded-3xl outline-none focus:border-primary/50 transition-all text-sm text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredLeads.map((lead) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] border border-white/5 p-10 rounded-[3rem] group hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden"
          >
             <div className="flex flex-col lg:flex-row gap-12 justify-between items-start">
                <div className="flex-grow space-y-6">
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-[#121212] flex items-center justify-center rounded-[1.5rem] border border-white/5 group-hover:border-primary/20 transition-all shrink-0">
                         <Briefcase className="w-8 h-8 text-gray-800 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                         <div className="flex items-center gap-4 mb-1">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{lead.name}</h3>
                            <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
                               {lead.status} Status
                            </span>
                         </div>
                         <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{lead.company || "Independent Entity"}</p>
                      </div>
                   </div>

                   <p className="text-gray-400 text-sm leading-relaxed max-w-3xl font-medium tracking-tight italic bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                      "${lead.project_details}"
                   </p>

                   <div className="flex flex-wrap items-center gap-8 pt-4">
                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                         <Mail className="w-4 h-4" /> {lead.email}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                         <Clock className="w-4 h-4" /> {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                   </div>
                </div>

                <div className="shrink-0 w-full lg:w-fit space-y-4">
                   <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 min-w-[240px]">
                      <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Acquisition Logic</h4>
                      <div className="flex flex-col gap-3">
                         <a 
                           href={`mailto:${lead.email}?subject=Maple Leaf Trading - Project Inquiry`}
                           className="w-full bg-primary hover:bg-red-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                         >
                            Engage via Mail <ExternalLink className="w-3 h-3" />
                         </a>
                         <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => updateStatus(lead.id, 'Contacted')}
                              className="bg-white/5 hover:bg-blue-500/10 text-gray-600 hover:text-blue-500 border border-white/10 p-4 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                            >
                               Contacted
                            </button>
                            <button 
                              onClick={() => updateStatus(lead.id, 'Quoted')}
                              className="bg-white/5 hover:bg-purple-500/10 text-gray-600 hover:text-purple-500 border border-white/10 p-4 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                            >
                               Quoted
                            </button>
                            <button 
                              onClick={() => updateStatus(lead.id, 'Converted')}
                              className="bg-white/5 hover:bg-green-500/10 text-gray-600 hover:text-green-500 border border-white/10 p-4 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                            >
                               Converted
                            </button>
                            <button 
                              onClick={() => updateStatus(lead.id, 'Spam')}
                              className="bg-white/5 hover:bg-red-500/5 text-gray-700 border border-white/10 p-4 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                            >
                               Archive
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="p-32 text-center text-gray-600 uppercase tracking-widest text-[10px] font-black italic opacity-40">
             Zero incoming acquisition data detected.
          </div>
        )}
      </div>
    </div>
  );
}
