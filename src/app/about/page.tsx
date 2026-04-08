"use client";

import { motion } from "framer-motion";
import { 
  History, 
  MapPin, 
  Users, 
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-40 pb-24 px-6 md:px-24 bg-[#0F1117] relative">
      <div className="max-w-4xl mx-auto space-y-32">
        {/* Hero Narrative */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="text-center space-y-12"
        >
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase px-4 py-1.5 bg-primary/10 w-fit mx-auto rounded-full">
            <History className="w-3 h-3" /> OUR STORY & COMMITMENT
          </div>
          <h1 className="text-4xl md:text-7xl font-outfit font-black text-white leading-tight">
            Crafting the future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-primary/80 italic">Canadian B2B.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-medium max-w-3xl mx-auto">
            Maple Leaf Trading Ltd. was born out of a desire to bring human partnership and high-end craftsmanship back to the merchandising industry.
          </p>
        </motion.section>

        {/* Vision Stats */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {[
            { label: "Founded In", value: "2010", icon: Sparkles },
            { label: "B2B Partners", value: "2,500+", icon: Users },
            { label: "Offices In", value: "Vancouver", icon: MapPin },
          ].map((stat, i) => (
            <div key={i} className="p-10 fluid-glass rounded-[2.5rem] border border-white/10 text-center space-y-4 shadow-xl">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
               <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.section>

        {/* Detailed Narrative */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="space-y-8"
          >
            <h2 className="text-4xl font-outfit font-bold text-white">More than just a transaction.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              At Maple Leaf Trading, we believe every piece of apparel, every sign, and every promotional item is a physical manifestation of your brand's DNA. That's why we don't just "fulfill orders"—we partner with you to dream, design, and deliver.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Based in beautiful Vancouver, BC, we've spent over a decade refining our techniques in screen printing, embroidery, and wide-format production. Our mission is to provide Canadian businesses with the sophisticated tools they need to stand out in a global market.
            </p>
            <div className="flex items-center gap-6 pt-4">
               <div className="text-center">
                  <Heart className="w-10 h-10 text-primary mx-auto mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Handcrafted</span>
               </div>
               <div className="text-center">
                  <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quality Guaranteed</span>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl"
          >
             <Image src="/hero.png" alt="Our Workshop" fill className="object-cover transition-transform duration-1000" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent opacity-40" />
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="fluid-glass p-20 rounded-[3rem] border border-white/10 text-center space-y-10"
        >
          <h2 className="text-3xl md:text-5xl font-outfit font-bold text-white">Let's create something <br /> memorable together.</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Whether you're a startup or an established enterprise, our team is ready to listen to your story.</p>
          <Link href="/#quote" className="bg-primary hover:bg-red-700 text-white px-12 py-5 rounded-3xl font-bold transition-all inline-flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-110 active:scale-95">
             Contact our leads team <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
