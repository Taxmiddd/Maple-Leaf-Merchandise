"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  Filter, 
  Edit, 
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Truck,
  Clock,
  MoreVertical,
  ChevronRight,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  client_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  status: string;
  total_amount: number;
  created_at: string;
  profiles?: {
    company_name: string;
    contact_name: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, profiles(company_name, contact_name)")
      .order("created_at", { ascending: false });
    
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      setMessage({ type: "error", text: "Failed to update status." });
    } else {
      setMessage({ type: "success", text: `Order #${orderId.slice(0, 8)} mark as ${newStatus}.` });
      fetchOrders();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer/Company", "Email", "Status", "Total Amount", "Date"];
    const rows = filteredOrders.map(o => [
      o.id,
      o.profiles?.company_name || o.guest_name || "N/A",
      o.guest_email || "N/A",
      o.status,
      o.total_amount,
      new Date(o.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.guest_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      (o.profiles?.company_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      o.id.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'In Production': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Shipped': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Cancelled': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Auditing Commitments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Order <span className="text-primary italic">Management</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Partnership fulfillment and logistics oversight</p>
        </div>
        <div className="flex gap-4">
           {['All', 'Pending', 'In Production', 'Shipped', 'Delivered'].map(s => (
             <button 
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 statusFilter === s ? 'bg-primary text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'
               }`}
             >
               {s}
             </button>
           ))}
           <button 
             onClick={exportToCSV}
             className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
           >
             <Download className="w-3 h-3" /> Export CSV
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

      <div className="relative">
        <Search className="absolute left-6 top-6 w-5 h-5 text-gray-700" />
        <input 
          type="text" 
          placeholder="Search by ID, Company, or Customer Name..."
          className="w-full bg-[#1A1A1A] border border-white/5 p-6 pl-16 rounded-3xl outline-none focus:border-primary/50 transition-all text-sm text-gray-300 shadow-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] border border-white/5 p-8 rounded-[2.5rem] group hover:border-primary/20 transition-all shadow-xl"
          >
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#121212] flex items-center justify-center rounded-[1.5rem] border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                     <Package className="w-8 h-8 text-gray-800" />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Order #{order.id.slice(0, 8)}</h3>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                           {order.status}
                        </span>
                     </div>
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        {order.client_id ? (
                           <span className="text-primary">{order.profiles?.company_name || "B2B Partner"}</span>
                        ) : (
                           <span>Guest Checkout: {order.guest_name}</span>
                        )}
                        <span className="mx-2 opacity-30">&bull;</span>
                        {new Date(order.created_at).toLocaleDateString()}
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-16 items-center">
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest block">Volume Total</span>
                     <span className="text-xl font-mono font-black text-white">${Number(order.total_amount).toFixed(2)}</span>
                  </div>

                  <div className="space-y-2">
                     <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest block">Logistics Status</span>
                     <div className="flex gap-2">
                        <button 
                           onClick={() => updateStatus(order.id, 'In Production')}
                           className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors"
                        >
                           <Clock className="w-4 h-4" />
                        </button>
                        <button 
                           onClick={() => updateStatus(order.id, 'Shipped')}
                           className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 hover:text-purple-500 transition-colors"
                        >
                           <Truck className="w-4 h-4" />
                        </button>
                        <button 
                           onClick={() => updateStatus(order.id, 'Delivered')}
                           className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 hover:text-green-500 transition-colors"
                        >
                           <CheckCircle2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 xl:justify-end col-span-2 lg:col-span-1">
                     <Link 
                       href={`/admin/invoices?order=${order.id}`}
                       className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                     >
                        View Invoice <ExternalLink className="w-3 h-3" />
                     </Link>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="p-32 text-center text-gray-600 uppercase tracking-widest text-[10px] font-bold">
             No matching operational commitments found.
          </div>
        )}
      </div>
    </div>
  );
}
