"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0F1117] pt-40 pb-24 px-6 md:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Brand
          </Link>
          <div className="space-y-4">
             <h1 className="text-5xl md:text-7xl font-outfit font-black text-white leading-tight uppercase">Privacy <span className="text-primary italic">Policy</span></h1>
             <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] ml-1">Last Updated: April 2026</p>
          </div>
        </header>

        {/* Content Sections */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
           <div className="md:col-span-1 space-y-8 sticky top-40 h-fit">
              <div className="p-8 fluid-glass rounded-3xl border border-white/5 space-y-4">
                 <ShieldCheck className="w-10 h-10 text-primary" />
                 <h3 className="text-white font-bold text-sm uppercase tracking-widest leading-relaxed">Data Sovereignty</h3>
                 <p className="text-gray-600 text-xs leading-relaxed">We protect your B2B intellectual property as if it were our own.</p>
              </div>
           </div>

           <div className="md:col-span-2 space-y-12 text-gray-400 text-lg leading-relaxed font-medium">
              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Information We Collect</h2>
                 <p>
                    For our B2B partners, we collect identification details necessary for trade, including company name, tax registration details, 3D design files for production, and preferred shipping logistics. We do not sell or trade your data with third-party advertising networks.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Design Intellectual Property</h2>
                 <p>
                    All files uploaded to our "Submit Brief" portal are handled through encrypted channels. Exclusive licensing or ownership of designs is governed by individual project contracts, but we maintain absolute technical confidentiality during the production phase.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Cookies & Analytics</h2>
                 <p>
                    Our platform uses first-party cookies to manage your dynamic dashboard session and role-based access. We use minimal, privacy-first analytics to ensure our portal performance meets your operational needs.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Square Payment Security</h2>
                 <p>
                    Financial transactions are processed securely through Square. Maple Leaf Trading Ltd. does not store your full credit card details on our local servers.
                 </p>
              </div>
           </div>
        </section>

        {/* Bottom Banner */}
        <footer className="pt-24 border-t border-white/5 text-center">
           <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Maple Leaf Trading Ltd. &bull; Protection of Partner Data is Priority Zero.
           </p>
        </footer>
      </div>
    </main>
  );
}
