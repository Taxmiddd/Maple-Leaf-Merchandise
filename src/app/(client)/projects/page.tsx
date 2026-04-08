"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle 
} from "lucide-react";

const MOCK_PROJECTS = [
  { 
    id: "PRJ-1024", 
    title: "Corporate Apparel Rollout", 
    status: "In Production", 
    progress: 65, 
    items: "500 High-Cotton T-Shirts",
    dueDate: "2026-04-20"
  },
  { 
    id: "PRJ-1025", 
    title: "Flagship Signage Installation", 
    status: "Pending Approval", 
    progress: 15, 
    items: "3 Commercial Building Signs",
    dueDate: "2026-05-15"
  },
  { 
    id: "PRJ-1020", 
    title: "Brand Merchandise Kits", 
    status: "Shipped", 
    progress: 100, 
    items: "250 Custom Promo Kits",
    dueDate: "2026-03-30",
    tracking: "CA-123456789"
  },
];

export default function MyProjectsPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-outfit font-black tracking-tight uppercase">My Projects</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Real-time status tracking for your B2B orders</p>
        </div>
        <button className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-sm font-bold flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Start New Project
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_PROJECTS.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#1A1A1A] border border-white/5 p-8 rounded-sm shadow-xl relative overflow-hidden"
          >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{project.id}</span>
                <h3 className="text-2xl font-outfit font-bold mt-1 text-white">{project.title}</h3>
              </div>
              <div className={`px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                project.status === "In Production" ? "bg-blue-500/10 text-blue-500" : (project.status === "Shipped" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary")
              }`}>
                {project.status === "In Production" && <Clock className="w-3 h-3 animate-spin" />}
                {project.status === "Shipped" && <Truck className="w-3 h-3" />}
                {project.status === "Pending Approval" && <AlertCircle className="w-3 h-3" />}
                {project.status === "Delivered" && <CheckCircle2 className="w-3 h-3" />}
                {project.status}
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6">{project.items}</p>

            {/* Progress Bar */}
            <div className="space-y-2 mb-8">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Production Pipeline</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${project.status === "Shipped" ? "bg-green-500" : "bg-primary"}`}
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Estimated Delivery: <span className="text-gray-300 ml-2">{project.dueDate}</span>
              </div>
              {project.tracking && (
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Tracking: <span className="underline ml-2">{project.tracking}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
