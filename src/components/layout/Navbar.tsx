"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isAuthPage = pathname === "/login" || pathname.startsWith("/admin") || pathname.startsWith("/projects") || pathname.startsWith("/dashboard");

  if (isAuthPage) return null;

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ type: "spring", stiffness: 150, damping: 25 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 fluid-glass rounded-3xl py-4 px-8 flex items-center justify-between border border-white/10"
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-primary squircle flex items-center justify-center font-bold text-lg text-white group-hover:rotate-6 transition-transform">M</div>
          <span className="font-outfit text-xl font-bold tracking-tight">Maple Leaf <span className="text-primary/80 italic font-medium">Trading</span></span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-400">
        <Link href="/services" className={`hover:text-white transition-colors ${pathname === "/services" ? "text-white" : ""}`}>Services</Link>
        <Link href="/products" className={`hover:text-white transition-colors ${pathname === "/products" ? "text-white" : ""}`}>Products</Link>
        <Link href="/about" className={`hover:text-white transition-colors ${pathname === "/about" ? "text-white" : ""}`}>About</Link>
        <Link href="/login" className="hover:text-white transition-colors">Client portal</Link>
        <Link href="/#quote" className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
          Start a project
        </Link>
      </div>
    </motion.nav>
  );
}
