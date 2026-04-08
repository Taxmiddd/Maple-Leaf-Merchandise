"use client";

import { motion } from "framer-motion";
import { 
  Shirt, 
  Layers, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  PenTool, 
  Award,
  LucideIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SERVICES = [
  { 
    id: "embroidery", 
    title: "Premium embroidery", 
    icon: Shirt, 
    description: "Our high-density embroidery services bring a level of sophistication and durability to your corporate apparel that is unmatched in the industry.",
    details: ["Industrial Tajima Machinery", "High-Thread-Count Finish", "Custom Pantone Matching", "Small and Large Batch Runs"],
    image: "/hero.png"
  },
  { 
    id: "printing", 
    title: "Eco-conscious screen printing", 
    icon: PenTool, 
    description: "We use sustainable, water-based inks to create soft-hand, vibrant prints that are safe for the environment and for your team.",
    details: ["Water-based Inks", "Simulated Process Printing", "Tag Printing Specialist", "Oversized Print Capabilities"],
    image: "/hero.png"
  },
  { 
    id: "signage", 
    title: "Large-format & signage", 
    icon: Layers, 
    description: "From architectural signage to vehicle wraps, we help you transform your physical space into an immersive brand experience.",
    details: ["UV-Resistant Materials", "Professional Installation", "Lamination for Durability", "Full Vehicle Wrapping"],
    image: "/hero.png"
  },
];

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

function ServiceSection({ service, index }: { service: any; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...springTransition, delay: 0.1 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-24 ${!isEven && "lg:flex-row-reverse"}`}
    >
      <div className={`space-y-10 ${!isEven && "lg:order-2"}`}>
        <div className="flex items-center gap-3 text-primary font-bold tracking-widest text-xs uppercase px-4 py-1.5 bg-primary/10 w-fit rounded-full">
           <service.icon className="w-3 h-3" /> {service.title}
        </div>
        <h2 className="text-4xl md:text-5xl font-outfit font-black text-white leading-tight">{service.title}</h2>
        <p className="text-xl text-gray-400 font-medium leading-relaxed">{service.description}</p>
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           {service.details.map((detail: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 font-semibold text-sm">
                 <CheckCircle2 className="w-5 h-5 text-primary" />
                 {detail}
              </li>
           ))}
        </ul>

        <Link href="/#quote" className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-5 rounded-[2rem] border border-white/10 transition-all group active:scale-95">
           Partner on a project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className={`relative aspect-square rounded-[3.5rem] overflow-hidden border border-white/15 shadow-2xl group ${!isEven && "lg:order-1"}`}>
         <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent opacity-40" />
      </div>
    </motion.section>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-40 pb-24 px-6 md:px-24 bg-[#0F1117] relative">
      <div className="max-w-7xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="text-center space-y-8 mb-32"
        >
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase px-4 py-1.5 bg-primary/10 w-fit mx-auto rounded-full">
            <Award className="w-3 h-3" /> CRAFTSMANSHIP MATTERS
          </div>
          <h1 className="text-4xl md:text-7xl font-outfit font-black text-white leading-tight">Expert B2B Solutions.</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">From initial design brief to final delivery, we refine every detail to represent your brand with absolute precision.</p>
        </motion.header>

        <div className="space-y-40 divide-y divide-white/5">
          {SERVICES.map((service, i) => (
            <ServiceSection key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Global Process CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-40 p-20 fluid-glass rounded-[4rem] border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full" />
          
          <h2 className="text-4xl font-outfit font-bold text-white mb-8">Ready to bring your <br /> brand to life?</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12">Whether it's 50 embroidered jackets or 5,000 custom-printed pens, we're ready to partner with you.</p>
          <Link href="/products" className="bg-primary hover:bg-red-700 text-white px-12 py-5 rounded-[2rem] font-bold transition-all inline-flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-110 active:scale-95">
             Explore our catalog <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
