"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Download, 
  RefreshCw, 
  Briefcase, 
  Mail, 
  Calendar,
  ExternalLink,
  ChevronRight,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface CustomerProfile {
  id: string;
  company_name: string | null;
  contact_name: string | null;
  email?: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    // Fetch profiles with role 'CLIENT'
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "CLIENT")
      .order("created_at", { ascending: false });

    if (profileError) {
      console.error(profileError);
      setLoading(false);
      return;
    }

    // Fetch order stats for these customers
    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .select("client_id, total_amount");

    if (orderError) {
      console.error(orderError);
    }

    const customerStats = (profiles || []).map(p => {
      const customerOrders = (orders || []).filter(o => o.client_id === p.id);
      return {
        ...p,
        order_count: customerOrders.length,
        total_spent: customerOrders.reduce((acc, curr) => acc + Number(curr.total_amount), 0)
      };
    });

    setCustomers(customerStats);
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ["Customer ID", "Contact Name", "Company", "Orders", "Total Spent", "JOINED"];
    const rows = filteredCustomers.map(c => [
      c.id,
      c.contact_name || "N/A",
      c.company_name || "N/A",
      c.order_count,
      c.total_spent,
      new Date(c.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(c => 
    (c.contact_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (c.company_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest text-center italic">Auditing Partner Network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Partner <span className="text-primary italic">Intelligence</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Management and acquisition analysis of B2B accounts</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl"
        >
          <Download className="w-4 h-4" /> Export Customer Data
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-6 top-6 w-5 h-5 text-gray-700" />
        <input 
          type="text" 
          placeholder="Filter by contact name or corporate entity..."
          className="w-full bg-[#1A1A1A] border border-white/5 p-6 pl-16 rounded-3xl outline-none focus:border-primary/50 transition-all text-sm text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredCustomers.map((customer) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] border border-white/5 p-10 rounded-[3rem] group hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden"
          >
             <div className="flex flex-col lg:flex-row gap-12 justify-between items-center">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-[#121212] flex items-center justify-center rounded-[2rem] border border-white/10 group-hover:border-primary/20 transition-all shrink-0">
                      <Briefcase className="w-10 h-10 text-gray-800 group-hover:text-primary transition-colors" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{customer.company_name || "Independent Partner"}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                         <span className="text-gray-400 italic">Primary Contact:</span> {customer.contact_name || "N/A"}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 text-center lg:text-left">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest block">Operational Load</span>
                      <span className="text-xl font-mono font-black text-white flex items-center justify-center lg:justify-start gap-2">
                         <Package className="w-4 h-4 text-primary" /> {customer.order_count} ORDERS
                      </span>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest block">Lifetime Value</span>
                      <span className="text-xl font-mono font-black text-green-500">${customer.total_spent?.toLocaleString()}</span>
                   </div>
                   <div className="space-y-1 col-span-2 lg:col-span-1">
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest block">Acquisition Date</span>
                      <span className="text-sm font-black text-gray-300 uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2">
                         <Calendar className="w-4 h-4 text-gray-600" /> {new Date(customer.created_at).toLocaleDateString()}
                      </span>
                   </div>
                </div>

                <div className="shrink-0">
                   <Link 
                     href={`/admin/orders?client=${customer.id}`}
                     className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 group"
                   >
                     Inspect History <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </div>
          </motion.div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="p-32 text-center text-gray-700 uppercase tracking-widest text-[10px] font-black italic opacity-40">
             Zero verified partner accounts detected in current sector.
          </div>
        )}
      </div>
    </div>
  );
}
