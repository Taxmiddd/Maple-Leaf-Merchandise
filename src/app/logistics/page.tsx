"use client";

import { motion } from "framer-motion";
import { Truck, Globe, MapPin, Package, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LogisticsPage() {
  return (
    <main className="min-h-screen bg-[#0F1117] pt-40 pb-24 px-6 md:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Brand
          </Link>
          <div className="space-y-4">
             <h1 className="text-5xl md:text-7xl font-outfit font-black text-white leading-tight uppercase tracking-tight">Logistics <span className="text-primary italic">& Supply</span></h1>
             <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] ml-1">Nationwide B2B Delivery & Production Cycles</p>
          </div>
        </header>

        {/* Content Sections */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16">
           <div className="md:col-span-1 space-y-8 h-fit sticky top-40">
              <div className="p-8 fluid-glass rounded-3xl border border-white/5 space-y-4 shadow-xl">
                 <Truck className="w-10 h-10 text-primary" />
                 <h3 className="text-white font-bold text-sm uppercase tracking-widest leading-relaxed">Swift Deployment</h3>
                 <p className="text-gray-600 text-[10px] font-medium leading-relaxed">Integrated shipping solutions for high-volume corporate rollouts.</p>
              </div>
           </div>

           <div className="md:col-span-2 space-y-16 text-gray-400 text-lg leading-relaxed font-medium">
              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Canadian Delivery Coverage</h2>
                 <p>
                    We provide nationwide shipping from our primary facilities. Whether you are in Vancouver, Toronto, or a remote job site, our logistics network ensures your signage and apparel arrive on schedule and in pristine condition.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Fabrication Timelines</h2>
                 <p>
                    Standard production cycles for branded merchandise range from 7-14 business days. Large-scale signage installations are managed through project-specific milestones, visible in real-time via your Client Dashboard.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Quality Assurance (QA)</h2>
                 <p>
                    Every item is hand-inspected by our team before dispatch. We maintain a "Partnership First" policy, ensuring that the excellence of our Canadian manufacturing is reflected in every box that leaves our warehouse.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Tracking & Fulfillment</h2>
                 <p>
                    Once your order marked as "Shipped" in the portal, you will receive tracked fulfillment details. You can monitor the progress of your shipments directly from the individual project screens in your dashboard.
                 </p>
              </div>
           </div>
        </section>

        {/* Bottom Banner */}
        <footer className="pt-24 border-t border-white/5 text-center">
           <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Maple Leaf Trading Ltd. &bull; Moving Brands Across Canada.
           </p>
        </footer>
      </div>
    </main>
  );
}
