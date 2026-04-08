"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Home, 
  Package, 
  FileText, 
  User, 
  Settings, 
  BarChart3,
  Plus,
  ArrowRight,
  Menu,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/", mobile: true },
  { label: "Products", icon: Package, href: "/products", mobile: false },
  { label: "Services", icon: LayoutGrid, href: "/services", mobile: false },
  { label: "About", icon: FileText, href: "/about", mobile: false },
  { label: "Dashboard", icon: BarChart3, href: "/dashboard", mobile: true },
  { label: "Profile", icon: User, href: "/login", mobile: true },
];

const springTransition = { type: "spring" as const, stiffness: 200, damping: 30 };

export default function UnifiedNav() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  
  const isExcluded = pathname === "/login" || pathname?.startsWith("/admin") || pathname?.startsWith("/projects") || pathname?.startsWith("/dashboard");
  
  // Transform scroll position to navbar states
  const navWidth = useTransform(scrollY, [0, 50], ["95%", "80%"]);
  const navTop = useTransform(scrollY, [0, 50], ["1.5rem", "1.25rem"]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (latest) => setScrolled(latest > 50));
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isExcluded) return null;

  return (
    <>
      {/* 📱 MOBILE NAVIGATION (< 768px) */}
      <AnimatePresence>
        {isMobile && (
          <>
            {/* Minimal Mobile Top Bar */}
            <motion.header 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex items-center justify-between pointer-events-none"
            >
              <Link href="/" className="pointer-events-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-primary/20">
                    M
                  </div>
                  <span className="font-outfit font-black text-white tracking-tight">MAPLE LEAF</span>
                </div>
              </Link>
              <Link href="/login" className="pointer-events-auto w-10 h-10 fluid-glass rounded-full border border-white/10 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </Link>
            </motion.header>

            {/* Floating Mobile Bottom Nav */}
            <motion.nav 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-50 fluid-glass rounded-[2rem] border border-white/10 px-4 py-3 flex items-center justify-between shadow-2xl"
            >
              {[
                { label: "Home", icon: Home, href: "/" },
                { label: "Products", icon: Package, href: "/products" },
                { label: "Brief", icon: Plus, href: "/#quote", highlight: true },
                { label: "Profile", icon: User, href: "/login" },
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.label} 
                    href={item.href}
                    className="relative flex flex-col items-center justify-center py-1"
                  >
                    <motion.div 
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-2xl transition-colors min-h-[44px]",
                        isActive ? "text-primary bg-primary/10" : "text-gray-500"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500")} />
                      {isActive && (
                        <motion.span 
                          layoutId="mobile-nav-label"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-[10px] font-black tracking-tight uppercase"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* 💻 DESKTOP FLOATING CAPSULE HEADER (> 768px) */}
      {!isMobile && (
        <motion.header
          style={{ 
            width: navWidth,
            top: navTop,
          }}
          initial={false}
          animate={{
            backgroundColor: scrolled ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
            backdropFilter: scrolled ? "blur(24px)" : "blur(0px)",
            borderRadius: scrolled ? "9999px" : "1.5rem",
            paddingLeft: scrolled ? "2.5rem" : "0rem",
            paddingRight: scrolled ? "1.25rem" : "0rem",
            border: scrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0)",
          }}
          transition={springTransition}
          className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between"
        >
          {/* Left: Logo */}
          <Link href="/">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-primary/20">
                 M
               </div>
               <div className="flex flex-col">
                 <span className="font-outfit font-black text-white leading-none tracking-tight">MAPLE LEAF</span>
                 <span className="text-[10px] font-bold text-primary italic tracking-tightest">TRADING LTD.</span>
               </div>
             </div>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.filter(item => !item.mobile || item.label === "Home").map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className={cn(
                    "relative px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all",
                    isActive ? "text-primary" : "text-gray-400 hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="desktop-active-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-lg shadow-primary/50"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA Button */}
          <Link 
            href="/#quote"
            className="bg-primary hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 group"
          >
             Get a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.header>
      )}
    </>
  );
}
