"use client";

import { useState, useEffect } from "react";
import { 
  Ticket, 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function ClientTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const supabase = createClient();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });
    
    if (!error) setTickets(data || []);
    setLoading(false);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("tickets")
      .insert({
        client_id: user.id,
        subject,
        description,
        priority,
        status: 'Open'
      })
      .select();

    if (!error && data) {
      // Trigger Notification
      await fetch("/api/tickets/notify", {
        method: "POST",
        body: JSON.stringify({ ticketId: data[0].id, type: 'NEW_TICKET' })
      });
      
      setShowNewModal(false);
      setSubject("");
      setDescription("");
      fetchTickets();
    }
    setIsSubmitting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'In Progress': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Accessing Support Archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Support <span className="text-primary italic">Desk</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Direct communication with production & logistics</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="bg-primary hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
        >
           Raise New Ticket <Plus className="w-4 h-4" />
        </button>
      </header>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-6">
        {tickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1A1A1A] border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-primary/20 transition-all shadow-xl"
          >
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Ticket className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-3">
                     <h3 className="text-lg font-bold text-white uppercase tracking-tight">{ticket.subject}</h3>
                     <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-gray-500`}>
                        {ticket.priority}
                     </span>
                  </div>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                     Opened {new Date(ticket.created_at).toLocaleDateString()} &bull; ID: {ticket.id.slice(0, 8)}
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                  {getStatusIcon(ticket.status)}
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{ticket.status}</span>
               </div>
               <button className="text-gray-700 hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        ))}

        {tickets.length === 0 && (
          <div className="p-32 text-center text-gray-600 uppercase tracking-widest text-[10px] font-bold bg-[#1A1A1A] border border-white/5 border-dashed rounded-[3rem]">
             No active inquiries detected. Your operational status is clear.
          </div>
        )}
      </div>

      {/* NEW TICKET MODAL */}
      <AnimatePresence>
        {showNewModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0F1117] border border-white/10 rounded-[3rem] p-12 z-[101] shadow-3xl overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <ShieldCheck className="w-32 h-32" />
               </div>

               <div className="space-y-8 relative">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-outfit font-black text-white uppercase">Open a <span className="text-primary italic">Request</span></h2>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Connect with our specialized production team</p>
                  </div>

                  <form onSubmit={handleCreateTicket} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Subject</label>
                        <input 
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none transition-all text-gray-200" 
                          placeholder="e.g. Signage Installation Update"
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Urgency Level</label>
                           <select 
                             value={priority}
                             onChange={(e) => setPriority(e.target.value)}
                             className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl outline-none text-gray-400 font-bold uppercase text-[10px] tracking-widest cursor-pointer"
                           >
                              <option>Low</option>
                              <option>Medium</option>
                              <option>High</option>
                              <option>Critical</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Detailed Brief</label>
                        <textarea 
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl focus:border-primary/50 outline-none transition-all text-gray-200 resize-none" 
                          placeholder="Please describe the issue or change request..."
                        />
                     </div>

                     <div className="flex gap-4 pt-6">
                        <button 
                          type="button"
                          onClick={() => setShowNewModal(false)}
                          className="flex-grow bg-white/5 hover:bg-white/10 text-gray-500 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all"
                        >
                           Cancel
                        </button>
                        <button 
                          disabled={isSubmitting}
                          className="flex-[2] bg-primary hover:bg-red-700 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                           {isSubmitting ? "Transmitting..." : "Initialize Ticket"} <ArrowRight className="w-4 h-4" />
                        </button>
                     </div>
                  </form>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
