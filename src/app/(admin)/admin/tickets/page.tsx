"use client";

import { useState, useEffect } from "react";
import { 
  Ticket, 
  Search, 
  Filter, 
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  User,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface SupportTicket {
  id: string;
  client_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  profiles: {
    company_name: string;
    contact_name: string;
  };
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const supabase = createClient();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tickets")
      .select("*, profiles(company_name, contact_name)")
      .order("created_at", { ascending: false });
    
    if (!error) setTickets(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) fetchTickets();
  };

  const updatePriority = async (id: string, newPriority: string) => {
    const { error } = await supabase
      .from("tickets")
      .update({ priority: newPriority })
      .eq("id", id);
    if (!error) fetchTickets();
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.profiles?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest text-center italic">Triaging Partner Requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Partner <span className="text-primary italic">Support</span> Desk</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Resolution of incoming B2B technical inquiries</p>
        </div>
        <div className="flex gap-4">
           {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
             <button 
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 statusFilter === s ? 'bg-primary text-white pointer-events-none' : 'bg-white/5 text-gray-500 hover:bg-white/10'
               }`}
             >
               {s}
             </button>
           ))}
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-6 top-6 w-5 h-5 text-gray-700" />
        <input 
          type="text" 
          placeholder="Filter by Subject or Partnership..."
          className="w-full bg-[#1A1A1A] border border-white/5 p-6 pl-16 rounded-3xl outline-none focus:border-primary/50 transition-all text-sm text-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredTickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] border border-white/5 p-10 rounded-[3rem] group hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden"
          >
             {/* Priority Indicator Line */}
             <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                ticket.priority === 'Critical' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
                ticket.priority === 'High' ? 'bg-orange-500' :
                ticket.priority === 'Medium' ? 'bg-blue-500' : 'bg-gray-700'
             }`} />

             <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-grow space-y-6">
                   <div className="flex flex-wrap items-center gap-4">
                      <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${getPriorityColor(ticket.priority)}`}>
                         {ticket.priority} PRIORITY
                      </span>
                      <span className="text-gray-700 text-[10px] font-black uppercase tracking-widest">ID: {ticket.id.slice(0, 8)}</span>
                      <div className="flex items-center gap-2 text-green-500/60 text-[10px] uppercase font-black tracking-widest">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                         {ticket.status}
                      </div>
                   </div>

                   <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">{ticket.subject}</h3>
                   <p className="text-gray-500 text-sm leading-relaxed max-w-3xl line-clamp-2 italic">{ticket.description}</p>
                   
                   <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{ticket.profiles?.company_name || 'Partner Account'}</p>
                            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{ticket.profiles?.contact_name}</p>
                         </div>
                      </div>
                      <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                         <Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                   </div>
                </div>

                <div className="shrink-0 space-y-4 w-full lg:w-fit">
                   <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                      <h4 className="text-xs font-black text-gray-600 uppercase tracking-widest text-center">Operational Controls</h4>
                      <div className="flex flex-wrap lg:flex-col gap-3">
                         <button 
                           onClick={() => updateStatus(ticket.id, 'In Progress')}
                           className="flex-grow lg:w-[180px] bg-white/5 hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 border border-white/10 hover:border-blue-500/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                         >
                            Engage Issue
                         </button>
                         <button 
                           onClick={() => updateStatus(ticket.id, 'Resolved')}
                           className="flex-grow lg:w-[180px] bg-white/5 hover:bg-green-500/10 text-gray-500 hover:text-green-500 border border-white/10 hover:border-green-500/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                         >
                            Signal Resolve
                         </button>
                         <button 
                           onClick={() => updatePriority(ticket.id, 'Critical')}
                           className="flex-grow lg:w-[180px] bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 border border-white/10 hover:border-red-500/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                         >
                            Escalate Priority
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="p-32 text-center text-gray-600 uppercase tracking-widest text-[10px] font-bold italic opacity-40">
             Zero pending operational inquiries detected.
          </div>
        )}
      </div>
    </div>
  );
}
