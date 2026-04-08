"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut,
  Sparkles,
  Ticket,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_NAV = [
  { label: "Overview", icon: BarChart3, href: "/admin/dashboard" },
  { label: "Analytics", icon: Sparkles, href: "/admin/analytics" },
  { label: "Orders", icon: FileText, href: "/admin/orders" },
  { label: "Inventory", icon: Package, href: "/admin/inventory" },
  { label: "Services", icon: LayoutGrid, href: "/admin/services" },
  { label: "B2B Leads", icon: Users, href: "/admin/leads" },
  { label: "Tickets", icon: Ticket, href: "/admin/tickets" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

// Helper to handle Lucide Icon dynamic import issues if needed, using LayoutGrid for Services mapping
import { LayoutGrid } from "lucide-react";

const springTransition = { type: "spring" as const, stiffness: 200, damping: 30 };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white flex relative overflow-hidden">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* 🚀 FIXED LEFT SIDEBAR */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : { width: 80 }}
            animate={isMobile ? { x: 0 } : { width: isSidebarOpen ? 280 : 80 }}
            exit={isMobile ? { x: -300 } : { width: 80 }}
            transition={springTransition}
            className={`fixed inset-y-0 left-0 z-50 bg-[#0A0C11]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col pt-8 pb-12 transition-all ${isMobile ? "w-[280px]" : ""}`}
          >
            {/* Branding */}
            <div className="px-6 mb-12 flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-black text-white shrink-0">M</div>
                <motion.div 
                  animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="font-outfit font-black tracking-tight text-white leading-none">COMMAND</span>
                  <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Admin Operations</span>
                </motion.div>
              </Link>
              {isMobile && (
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-3 space-y-1">
              {ADMIN_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.label} 
                    href={item.href}
                    className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group overflow-hidden ${
                      isActive ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                    <motion.span 
                      animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                      className="text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-[0_0_20px_rgba(234,0,44,0.5)]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer / Sign Out */}
            <div className="px-3 mt-auto">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all group"
              >
                <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <motion.span 
                  animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                  className="text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                >
                  Exit Session
                </motion.span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 📱 MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* 🏛️ MAIN CONTENT AREA */}
      <main className={`flex-grow transition-all flex flex-col min-h-screen ${!isMobile && isSidebarOpen ? "pl-[280px]" : !isMobile ? "pl-20" : ""}`}>
        {/* Top Floating Control Bar */}
        <header className="sticky top-0 z-30 px-6 md:px-12 py-6 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
             {isMobile && (
               <button onClick={() => setIsSidebarOpen(true)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400">
                 <Menu className="w-5 h-5" />
               </button>
             )}
             {!isMobile && (
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all group">
                 <Menu className={`w-5 h-5 transition-transform ${isSidebarOpen ? "rotate-90" : ""}`} />
               </button>
             )}
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 leading-none">Security Status</span>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest group flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   Authoritative
                </span>
             </div>
          </div>
        </header>

        <section className="flex-grow px-6 md:px-12 py-12 z-20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
