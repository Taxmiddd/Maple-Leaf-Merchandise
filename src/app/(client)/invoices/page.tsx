"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { useState } from "react";

const MOCK_CLIENT_INVOICES = [
  { id: "INV-1024", amount: 1250.00, date: "2026-04-01", status: "Paid", items: "Custom Embroidery - 500 units" },
  { id: "INV-1025", amount: 4500.00, date: "2026-04-05", status: "Unpaid", items: "Commercial Signage Installation" },
  { id: "INV-1020", amount: 500.00, date: "2026-03-30", status: "Overdue", items: "Brand Merchandise Kits" },
];

export default function ClientInvoicesPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePay = async (invoiceId: string) => {
    setLoading(invoiceId);
    try {
      const res = await fetch("/api/square/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const { url, error } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        alert(error || "Payment failed to initialize.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-outfit font-black tracking-tight uppercase">My Invoices</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Secure portal for B2B payments and trade documentation</p>
        </div>
      </header>

      {/* Invoice List */}
      <div className="grid grid-cols-1 gap-6">
        {MOCK_CLIENT_INVOICES.map((inv, idx) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-[#1A1A1A] border border-white/5 p-8 rounded-sm shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/5 rounded-sm flex items-center justify-center font-bold text-gray-500">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{inv.id}</span>
                <h3 className="text-xl font-outfit font-bold text-white mt-1">{inv.items}</h3>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Issued: {inv.date}</p>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2">
              <div className="text-2xl font-black font-outfit text-white">${inv.amount.toLocaleString()}</div>
              <div className={`px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                inv.status === "Paid" ? "bg-green-500/10 text-green-500" : (inv.status === "Unpaid" ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500")
              }`}>
                {inv.status === "Paid" && <CheckCircle2 className="w-3 h-3" />}
                {inv.status === "Unpaid" && <Clock className="w-3 h-3" />}
                {inv.status === "Overdue" && <AlertCircle className="w-3 h-3" />}
                {inv.status}
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {inv.status !== "Paid" && (
                <button 
                  onClick={() => handlePay(inv.id)}
                  disabled={loading === inv.id}
                  className="flex-grow md:flex-grow-0 bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-sm font-bold flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" /> 
                  {loading === inv.id ? "Processing..." : "Pay with Square"}
                </button>
              )}
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-sm text-gray-400 hover:text-white transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 border border-white/5 bg-[#121212] rounded-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-primary" />
          <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
            Payment issues? Contact our B2B logistics team at <span className="text-primary underline">billing@mapleleaf-trading.ca</span>
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="w-10 h-6 bg-white/5 rounded-sm flex items-center justify-center grayscale hover:grayscale-0 transition-opacity">VISA</div>
          <div className="w-10 h-6 bg-white/5 rounded-sm flex items-center justify-center grayscale hover:grayscale-0 transition-opacity">MC</div>
          <div className="w-10 h-6 bg-white/5 rounded-sm flex items-center justify-center grayscale hover:grayscale-0 transition-opacity">AMEX</div>
        </div>
      </div>
    </div>
  );
}
