"use client";

import { 
  FileText, 
  Plus, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Wallet, 
  FileCheck,
  RefreshCw,
  Search,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/admin/invoice-pdf";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalReceivables: 0,
    pendingPayments: 0,
    paidThisMonth: 0
  });
  
  const supabase = createClient();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*, orders(*), profiles(*)")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setInvoices(data);
      
      const total = data.reduce((acc: number, inv: any) => acc + Number(inv.amount), 0);
      const pending = data
        .filter((inv: any) => inv.status === 'Unpaid')
        .reduce((acc: number, inv: any) => acc + Number(inv.amount), 0);
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const paidThisMonth = data
        .filter((inv: any) => inv.status === 'Paid' && inv.created_at >= firstDayOfMonth)
        .reduce((acc: number, inv: any) => acc + Number(inv.amount), 0);

      setStats({
        totalReceivables: total,
        pendingPayments: pending,
        paidThisMonth: paidThisMonth
      });
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ["Invoice ID", "Customer/Company", "Amount", "Status", "Date", "Payment Method"];
    const rows = filteredInvoices.map(inv => [
      inv.id,
      inv.profiles?.company_name || inv.orders?.guest_name || "N/A",
      inv.amount,
      inv.status,
      new Date(inv.created_at).toLocaleDateString(),
      inv.payment_method || "N/A"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInvoices = invoices.filter(inv => {
    const name = inv.profiles?.company_name || inv.orders?.guest_name || "";
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.id.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      order_id: formData.get("order_id"),
      amount: parseFloat(formData.get("amount") as string),
      status: formData.get("status"),
      payment_method: formData.get("payment_method")
    };

    const { error } = await supabase.from("invoices").insert(payload);
    if (!error) {
      setIsModalOpen(false);
      fetchInvoices();
    } else {
      alert("Error creating invoice: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest text-center italic">Auditing Financial Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">Operational <span className="text-primary italic">Invoicing</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Management of B2B payment request lifecycle</p>
        </div>
        <div className="flex flex-wrap gap-4">
           {['All', 'Paid', 'Unpaid'].map(s => (
             <button 
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 statusFilter === s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-gray-500 hover:bg-white/10'
               }`}
             >
               {s}
             </button>
           ))}
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-primary hover:bg-red-700 text-white px-8 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-primary/20 text-[10px] uppercase tracking-widest"
           >
             <Plus className="w-4 h-4" /> Create Invoice
           </button>
           <button 
             onClick={exportToCSV}
             className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-8 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all border border-white/10 text-[10px] uppercase tracking-widest shadow-xl"
           >
             <Download className="w-4 h-4" /> Export CSV
           </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Asset Flow", value: `$${stats.totalReceivables.toLocaleString()}`, icon: Wallet, color: "text-blue-500" },
          { label: "Pending Collection", value: `$${stats.pendingPayments.toLocaleString()}`, icon: Clock, color: "text-primary" },
          { label: "Realized (Monthly)", value: `$${stats.paidThisMonth.toLocaleString()}`, icon: CheckCircle2, color: "text-green-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1A1A1A] p-10 border border-white/5 rounded-[2.5rem] shadow-xl group hover:border-white/10 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black font-outfit tracking-tight text-white leading-none">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mt-2 italic">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-6 w-5 h-5 text-gray-700" />
        <input 
          type="text" 
          placeholder="Filter by invoice ID or B2B Partnership..."
          className="w-full bg-[#1A1A1A] border border-white/5 p-6 pl-16 rounded-3xl outline-none focus:border-primary/50 transition-all text-sm text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Invoice List */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/[0.02] uppercase tracking-[0.2em] text-[10px] font-black text-gray-600 border-b border-white/5">
                <th className="p-10">Identifier</th>
                <th className="p-10">Partnership Brief</th>
                <th className="p-10 text-center">Value</th>
                <th className="p-10 text-center">Logistics Date</th>
                <th className="p-10 text-center">Status</th>
                <th className="p-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                  <td className="p-10 font-mono text-gray-500 font-black text-xs">#{inv.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-10">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-white uppercase text-sm tracking-tight">{inv.profiles?.company_name || inv.orders?.guest_name || "B2B Client"}</span>
                      <span className="text-[10px] text-gray-700 uppercase tracking-widest font-black italic">{inv.profiles?.contact_name || "Guest Account"}</span>
                    </div>
                  </td>
                  <td className="p-10 text-center font-mono text-white font-black text-sm">${Number(inv.amount).toFixed(2)}</td>
                  <td className="p-10 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="p-10 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${
                      inv.status === "Paid" ? "bg-green-500/5 text-green-500 border-green-500/10" : "bg-primary/5 text-primary border-primary/10"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-10 text-right">
                    <div className="flex justify-end gap-6">
                      <PDFDownloadLink 
                        document={
                          <InvoicePDF data={{ 
                            ...inv, 
                            invoiceNumber: inv.id.slice(0, 8).toUpperCase(), 
                            isPaid: inv.status === "Paid",
                            clientName: inv.profiles?.contact_name || inv.orders?.guest_name || "Client",
                            companyName: inv.profiles?.company_name || "",
                            email: inv.profiles?.email || inv.orders?.guest_email || "",
                            date: new Date(inv.created_at).toLocaleDateString(),
                            total: Number(inv.amount),
                            paymentMethod: inv.payment_method,
                            items: [{ description: "Operational Fulfillment", quantity: 1, price: Number(inv.amount) }] // Default item if order_items not linked yet
                          }} />
                        } 
                        fileName={`INVOICE-${inv.id.slice(0, 8)}.pdf`}
                      >
                        {/* @ts-ignore */}
                        {({ loading }) => (
                          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-700 hover:text-white transition-all border border-white/5">
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                      </PDFDownloadLink>
                      <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-700 hover:text-white transition-all border border-white/5">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredInvoices.length === 0 && (
          <div className="p-32 text-center text-gray-700 uppercase tracking-widest text-[10px] font-black italic opacity-40">
            Zero verified financial records detected in current session.
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="w-full max-w-xl bg-[#0F1117] border border-white/10 p-12 rounded-[3.5rem] shadow-4xl relative"
             >
                <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-gray-700 hover:text-white transition-all p-2 rounded-full hover:bg-white/5">
                   <X className="w-6 h-6" />
                </button>

                <div className="space-y-1 mb-10">
                   <h2 className="text-3xl font-outfit font-black text-white uppercase tracking-tight">Generate <span className="text-primary italic">Invoice</span></h2>
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Initialize a financial procurement record</p>
                </div>

                <form onSubmit={handleCreateInvoice} className="space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Parent Order ID (UUID)</label>
                      <input 
                        name="order_id"
                        required
                        className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl focus:border-primary/50 outline-none text-gray-200 text-xs font-mono" 
                        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Total Value ($)</label>
                         <input 
                           name="amount"
                           required
                           type="number"
                           step="0.01"
                           className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl focus:border-primary/50 outline-none text-gray-200 text-sm font-black" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Payment status</label>
                         <select name="status" className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl focus:border-primary/50 outline-none text-gray-200 text-[10px] font-black uppercase tracking-widest cursor-pointer">
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-2 italic">Settlement Method</label>
                      <select name="payment_method" className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl focus:border-primary/50 outline-none text-gray-200 text-[10px] font-black uppercase tracking-widest cursor-pointer">
                         <option value="Square">Square Transfer</option>
                         <option value="Check">Corporate Check</option>
                         <option value="Cash">Cash Liquidity</option>
                      </select>
                   </div>

                   <button className="w-full bg-primary hover:bg-red-700 text-white font-black py-7 rounded-2xl transition-all shadow-2xl shadow-primary/30 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 group active:scale-[0.98]">
                      Confirm & Initialize Record
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
