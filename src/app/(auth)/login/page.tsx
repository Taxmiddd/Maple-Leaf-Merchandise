"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const supabase = createClient();

    if (isLogin) {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      // Register
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            role: 'CLIENT'
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
      } else {
        // Create Profile record specifically if needed by triggers, but let's be explicit
        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              company_name: companyName,
              role: 'CLIENT',
              contact_name: email.split('@')[0]
            });
          
          if (profileError) {
              console.error(profileError);
          }
        }
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />

      <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 transition-all uppercase tracking-widest text-[10px] font-black z-20">
        <ArrowLeft className="w-4 h-4" /> Back to Brand
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#1A1A1A] p-10 md:p-16 border border-white/5 rounded-[3rem] shadow-3xl relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <Lock className="w-32 h-32" />
        </div>

        <div className="text-center mb-12 relative">
          <div className="w-16 h-16 bg-primary mx-auto mb-8 flex items-center justify-center font-black text-3xl text-white rounded-3xl shadow-xl shadow-primary/20 italic">M</div>
          <h1 className="text-3xl font-outfit font-black tracking-tight uppercase text-white">
            Partnership <span className="text-primary italic">{isLogin ? "Portal" : "Registration"}</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Establishing Secure B2B Connection</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-5 mb-8 text-[10px] font-bold uppercase tracking-widest leading-relaxed rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-2"
             >
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Company Entity</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 p-5 focus:border-primary outline-none transition-all rounded-2xl text-gray-300"
                    placeholder="e.g. Maple Leaf Trading Ltd."
                    required={!isLogin}
                  />
                </div>
             </motion.div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-5 w-5 h-5 text-gray-700" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/5 p-5 pl-14 focus:border-primary outline-none transition-all rounded-2xl text-gray-300"
                placeholder="logistics@company.ca"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Access Token</label>
            <div className="relative">
              <Lock className="absolute left-5 top-5 w-5 h-5 text-gray-700" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 p-5 pl-14 focus:border-primary outline-none transition-all rounded-2xl text-gray-300 placeholder:text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-red-700 text-white font-black py-6 uppercase tracking-[0.3em] text-xs transition-all disabled:opacity-50 rounded-2xl shadow-xl shadow-primary/20 active:scale-95"
          >
            {loading ? "Establishing..." : isLogin ? "Establish Secure Session" : "Request Portal Initiation"}
          </button>
        </form>

        <div className="mt-12 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-loose">
          {isLogin ? "No active commitment?" : "Already possess access?"} <br />
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-white hover:text-primary transition-colors underline decoration-primary/30"
          >
            {isLogin ? "Initialize Partnership Account" : "Access Partnership Portal"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
