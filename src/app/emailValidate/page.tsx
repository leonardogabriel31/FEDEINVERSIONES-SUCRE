"use client";

import { Loader2, Landmark } from "lucide-react";

export default function EmailValidatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10 shadow-2xl text-center">
        
        {/* Logo */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg mb-6">
          <Landmark className="text-white" size={28} />
        </div>

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        </div>

        {/* Texto */}
        <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wide">
          VALIDANDO CORREO
        </h1>

        <p className="text-slate-400 text-sm mt-3">
          Estamos verificando tu información, por favor espera...
        </p>
      </div>
    </main>
  );
}