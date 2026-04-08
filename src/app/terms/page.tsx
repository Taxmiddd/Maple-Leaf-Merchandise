"use client";

import { motion } from "framer-motion";
import { FileText, ArrowLeft, RefreshCw, Scale, Briefcase } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0F1117] pt-40 pb-24 px-6 md:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-6 text-center md:text-left">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Brand
          </Link>
          <div className="space-y-4">
             <h1 className="text-5xl md:text-7xl font-outfit font-black text-white leading-tight uppercase tracking-tight">Terms of <span className="text-primary italic">Trade</span></h1>
             <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] ml-1">Official B2B Conduct & Commitment</p>
          </div>
        </header>

        {/* Content Sections */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16">
           <div className="md:col-span-1 space-y-8 h-fit sticky top-40">
              <div className="p-8 fluid-glass rounded-3xl border border-white/5 space-y-4 shadow-xl">
                 <Scale className="w-10 h-10 text-primary" />
                 <h3 className="text-white font-bold text-sm uppercase tracking-widest leading-relaxed">Commercial Integrity</h3>
                 <p className="text-gray-600 text-[10px] font-medium leading-relaxed">Every partnership is built on mutual respect and absolute transparency.</p>
              </div>
           </div>

           <div className="md:col-span-2 space-y-16 text-gray-400 text-lg leading-relaxed font-medium">
              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Project Engagement</h2>
                 <p>
                    All project engagements begin with a "Submit Brief". Quotations provided are valid for 30 calendar days from the date of issue. Production starts only after the design is finalized and the initial deposit (if applicable) is received.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Production Timelines</h2>
                 <p>
                    Estimated production times are based on the complexity of the brand merchandise or signage. We strive for excellence, and any logistical delays due to material availability will be communicated to the partner within 48 business hours.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Payment & Billing</h2>
                 <p>
                    Payments are handled through our Square integrated portal. Invoices are issued upon project confirmation and are categorized by "Paid", "Unpaid", and "In Production" status in your Client Dashboard.
                 </p>
              </div>

              <div className="space-y-6">
                 <h2 className="text-white text-2xl font-bold font-outfit uppercase">Liability & Warranty</h2>
                 <p>
                    Maple Leaf Trading Ltd. warrants that all products will meet the technical specifications defined in the brief. Any defects in Canadian craftsmanship will be addressed through our logistics and replacement program.
                 </p>
              </div>
           </div>
        </section>

        {/* Bottom Banner */}
        <footer className="pt-24 border-t border-white/5 text-center">
           <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Maple Leaf Trading Ltd. &bull; Partnership Powered by Local Quality.
           </p>
        </footer>
      </div>
    </main>
  );
}
