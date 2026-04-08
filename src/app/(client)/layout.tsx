"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  History,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CLIENT_NAV = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Projects", icon: Sparkles, href: "/projects" },
  { label: "Invoices", icon: FileText, href: "/invoices" },
  { label: "Support Tickets", icon: Ticket, href: "/dashboard/tickets" },
];

import { Ticket } from "lucide-react";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col relative overflow-hidden">
      {/* Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.main 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springTransition, delay: 0.15 }}
        className="flex-grow z-10 p-6 pt-12 md:p-12 pb-32 md:pb-12 overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h2 className="text-2xl md:text-4xl font-outfit font-black text-white">Client <span className="text-primary italic">Portal</span></h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Your Creative Workspace</p>
             </div>
             <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="hidden md:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-500 hover:text-primary transition-all text-sm font-bold group"
              >
                Sign Out
              </motion.button>
          </div>
          {children}
        </div>
      </motion.main>
    </div>
  );
}
