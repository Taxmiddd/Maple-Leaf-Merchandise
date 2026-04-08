"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Package, 
  FileText, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Active Projects", value: "3", icon: Package, color: "text-primary", bg: "bg-primary/10" },
  { label: "Pending Invoices", value: "$4,250", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Production Days", value: "12", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
];

const RECENT_ACTIVITY = [
  { id: 1, title: "Order PRJ-1024", status: "In Production", date: "2 hours ago" },
  { id: 2, title: "Invoice INV-8822 Paid", status: "Completed", date: "昨天" },
  { id: 3, title: "Quote Proposal Sent", status: "Pending Approval", date: "3 days ago" },
];

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function ClientDashboard() {
  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-outfit font-black tracking-tight text-white uppercase">
            Partner <span className="text-primary italic">Overview</span>
          </h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] ml-1">
            Real-time operations for Maple Leaf Trading
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          <TrendingUp className="w-3 h-3" /> Growth: +14% this month
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: idx * 0.1 }}
            className="fluid-glass p-8 rounded-[2rem] border border-white/10 group hover:border-primary/30 transition-all"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-outfit font-black text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links / Navigation */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/projects" className="group">
              <div className="fluid-glass p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <Package className="w-5 h-5" />
                    </div>
                    <div>
                       <h4 className="font-bold text-white text-sm">Product Registry</h4>
                       <p className="text-[10px] text-gray-500 uppercase tracking-wider">Manage active projects</p>
                    </div>
                 </div>
                 <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-primary transition-colors" />
              </div>
            </Link>
            <Link href="/invoices" className="group">
              <div className="fluid-glass p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                       <FileText className="w-5 h-5" />
                    </div>
                    <div>
                       <h4 className="font-bold text-white text-sm">Billing Ledger</h4>
                       <p className="text-[10px] text-gray-500 uppercase tracking-wider">Download PDF Invoices</p>
                    </div>
                 </div>
                 <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </div>

          {/* Activity Feed */}
          <div className="fluid-glass rounded-[2.5rem] border border-white/5 p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-outfit font-bold text-white uppercase tracking-tight">Recent Activity</h3>
               <Link href="/projects" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View History</Link>
            </div>
            
            <div className="space-y-6">
               {RECENT_ACTIVITY.map((activity) => (
                 <div key={activity.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-primary/50" />
                       <div>
                          <p className="font-bold text-white text-sm">{activity.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{activity.status}</p>
                       </div>
                    </div>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{activity.date}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Notifications */}
        <div className="space-y-6">
           <div className="fluid-glass p-8 rounded-[2.5rem] border border-white/10 bg-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <AlertCircle className="w-5 h-5 text-primary opacity-20" />
              </div>
              <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">Attention Required</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                 You have 1 pending invoice that requires attention before production can begin for project PRJ-1025.
              </p>
              <button className="mt-6 w-full py-3 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-700">
                 Complete Payment
              </button>
           </div>

           <div className="fluid-glass p-8 rounded-[2.5rem] border border-white/5">
              <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-6">Partner Support</h4>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400">
                    <p className="font-bold text-white mb-1">Direct Line</p>
                    +1 (800) MAPLE-LEAF
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400">
                    <p className="font-bold text-white mb-1">Support Dispatch</p>
                    ops@mapleleaftrading.ca
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
