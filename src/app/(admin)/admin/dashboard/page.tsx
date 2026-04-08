"use client";

import { 
  Package, 
  FileText, 
  Users, 
  BarChart3, 
  Plus,
  RefreshCw,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeOrders: 0,
    openInvoices: 0,
    newLeads: 0,
    inventoryCount: 0
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [
      { count: orderCount },
      { data: invoicesData },
      { count: leadCount },
      { count: productCount }
    ] = await Promise.all([
      supabase.from("orders").select("*", { count: 'exact', head: true }).not("status", "in", '("Delivered","Cancelled")'),
      supabase.from("invoices").select("*, orders(*), profiles(*)").order("created_at", { ascending: false }).limit(5),
      supabase.from("leads").select("*", { count: 'exact', head: true }).eq("status", "New"),
      supabase.from("products").select("*", { count: 'exact', head: true }).eq("is_active", true)
    ]);

    // Calculate unpaid invoice total
    const { data: unpaidInvoices } = await supabase.from("invoices").select("amount").eq("status", "Unpaid");
    const pendingAmount = unpaidInvoices?.reduce((acc, inv) => acc + Number(inv.amount), 0) || 0;

    setStats({
      activeOrders: orderCount || 0,
      openInvoices: pendingAmount,
      newLeads: leadCount || 0,
      inventoryCount: productCount || 0
    });

    setRecentInvoices(invoicesData || []);
    
    const { data: leadsData } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5);
    setRecentLeads(leadsData || []);
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest text-center italic">Aggregating Global Operations...</p>
      </div>
    );
  }

  return (
    <>
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-outfit font-black tracking-tight uppercase">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Maple Leaf Trading Ltd. Active Operations</p>
        </div>
        <Link 
          href="/admin/orders"
          className="bg-primary hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all text-[10px] uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" /> New Order
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Active Orders", value: stats.activeOrders.toString(), icon: Package, color: "text-primary" },
          { label: "Pending $", value: `$${stats.openInvoices.toLocaleString()}`, icon: FileText, color: "text-blue-500" },
          { label: "New Leads", value: stats.newLeads.toString(), icon: Users, color: "text-green-500" },
          { label: "Live Catalog", value: stats.inventoryCount.toString(), icon: BarChart3, color: "text-purple-500" },
        ].map((stat) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={stat.label} 
            className="bg-[#1A1A1A] p-8 border border-white/5 rounded-[2rem] shadow-3xl group hover:border-primary/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-700">Real-time sync</span>
            </div>
            <p className="text-3xl font-black font-outfit text-white tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-outfit font-black uppercase tracking-widest text-xs">Recent Invoices</h3>
            <Link href="/admin/invoices" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-2">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4">
            {recentInvoices.length > 0 ? (
              <div className="space-y-3">
                {recentInvoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-wider">{inv.profiles?.company_name || inv.orders?.guest_name || 'B2B Client'}</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{new Date(inv.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-black text-white">${Number(inv.amount).toFixed(2)}</p>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'text-green-500' : 'text-primary'}`}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-700 uppercase tracking-widest text-[9px] font-black italic opacity-40">
                Secondary Operational Log Empty.
              </div>
            )}
          </div>
        </div>

        {/* Lead Capture Summary */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-outfit font-black uppercase tracking-widest text-xs">Active leads</h3>
            <Link href="/admin/leads" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-2">
              Manage Leads <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4">
            {recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#121212] border border-white/10 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-gray-700 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">{lead.name}</p>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{lead.company || 'Private Entity'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{new Date(lead.created_at).toLocaleDateString()}</p>
                      <span className="text-[8px] text-green-500/50 font-black uppercase tracking-widest">{lead.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-700 uppercase tracking-widest text-[9px] font-black italic opacity-40">
                Zero Incoming Acquisition Data detected.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
