"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Calendar,
  Wallet,
  Activity,
  ArrowRight,
  Sparkles,
  Search,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StatsSnapshot {
  revenue: number;
  transactions: number;
  net: number;
}

interface ChartItem {
  date: string;
  revenue: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<StatsSnapshot | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const fetchAnalytics = async (customStart?: string, customEnd?: string) => {
    setLoading(true);
    let start, end;

    if (customStart && customEnd) {
        start = new Date(customStart).toISOString();
        end = new Date(customEnd).toISOString();
    } else {
        const d = new Date();
        end = d.toISOString();
        d.setDate(d.getDate() - parseInt(range));
        start = d.toISOString();
    }

    try {
        const res = await fetch(`/api/admin/analytics?start=${start}&end=${end}`);
        const data = await res.json();
        if (data.overview) {
            setStats(data.overview);
            setChartData(data.chartData);
        }
    } catch (err) {
        console.error(err);
    }
    setLoading(false);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRange.start && customRange.end) {
        fetchAnalytics(customRange.start, customRange.end);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Aggregating Square Performance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Operational <span className="text-primary italic">Intelligence</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Real-time revenue & growth auditing via Square</p>
        </div>

        <div className="flex flex-wrap gap-3">
           {[
             { label: '7D', value: '7' },
             { label: '15D', value: '15' },
             { label: '30D', value: '30' },
             { label: '90D', value: '90' },
           ].map(r => (
             <button 
               key={r.value}
               onClick={() => setRange(r.value)}
               className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 range === r.value ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-gray-500 hover:bg-white/10'
               }`}
             >
               {r.label}
             </button>
           ))}
        </div>
      </header>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Volume', value: stats?.revenue || 0, icon: Wallet, suffix: ' CAD', color: 'text-primary' },
           { label: 'Net Transactions', value: stats?.transactions || 0, icon: Activity, suffix: ' Orders', color: 'text-blue-500' },
           { label: 'Net Revenue', value: stats?.net || 0, icon: Sparkles, suffix: ' CAD', color: 'text-green-500' },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-[#1A1A1A] p-8 border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <stat.icon className="w-16 h-16" />
              </div>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Metric Output</span>
                 <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-4xl font-black font-outfit text-white">
                {stat.label.includes('Volume') || stat.label.includes('Revenue') ? `$${stat.value.toLocaleString()}` : stat.value}
                <span className="text-xs font-bold text-gray-600 ml-2">{stat.suffix}</span>
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">{stat.label}</p>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Custom Range Picker */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1A1A1A] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
               <div className="flex items-center gap-3 mb-8">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest leading-none">Custom Filter</h3>
               </div>
               <form onSubmit={handleCustomSearch} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2">Begin Collection</label>
                     <input 
                       type="date"
                       className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs font-bold uppercase text-gray-300 outline-none focus:border-primary/50 transition-all"
                       value={customRange.start}
                       onChange={(e) => setCustomRange(prev => ({...prev, start: e.target.value}))}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2">Termination Point</label>
                     <input 
                       type="date"
                       className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs font-bold uppercase text-gray-300 outline-none focus:border-primary/50 transition-all"
                       value={customRange.end}
                       onChange={(e) => setCustomRange(prev => ({...prev, end: e.target.value}))}
                     />
                  </div>
                  <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest transition-all">
                     Audit Custom Range <ArrowRight className="w-3 h-3" />
                  </button>
               </form>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10">
               <TrendingUp className="w-5 h-5 text-primary mb-4" />
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-loose">
                  Real-time data synchronization with your Square POS terminal. This snapshot reflects verified B2B transactions.
               </p>
            </div>
         </div>

         {/* Revenue Trend Visualizer */}
         <div className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 p-8 rounded-[3.5rem] shadow-xl overflow-hidden relative min-h-[400px]">
             <div className="flex items-center justify-between mb-12">
               <div className="space-y-1">
                 <h3 className="text-white font-bold text-sm uppercase tracking-widest">Revenue Propagation</h3>
                 <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">{range === 'custom' ? 'Defined Range' : `Last ${range} Days`}</p>
               </div>
               <BarChart3 className="w-5 h-5 text-gray-700" />
             </div>

             <div className="flex items-end gap-2 h-48 px-4">
                {chartData.length > 0 ? chartData.map((day, i) => (
                  <motion.div
                    key={day.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(100, Math.max(10, (day.revenue / Math.max(...chartData.map(d => d.revenue))) * 100))}%` }}
                    className="flex-grow bg-primary/20 hover:bg-primary rounded-t-lg transition-all relative group"
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary">${day.revenue.toFixed(2)}</p>
                       <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{day.date}</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="flex-grow flex items-center justify-center text-gray-600 uppercase tracking-widest text-[10px] h-full">
                     Collecting transaction distribution...
                  </div>
                )}
             </div>
             
             <div className="h-px w-full bg-white/5 mt-4" />
             <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest mt-4">
                <span>Timeline Start</span>
                <span>Propagation End</span>
             </div>
         </div>
      </div>
    </div>
  );
}
