"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Eye, EyeOff, ShieldCheck, TrendingUp, Building2, Landmark, Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo]             = useState("");
  const [clave, setClave]               = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [serverError, setServerError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!correo.trim() || !clave.trim()) {
      setServerError("Por favor completa todos los campos");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "https://fedeinversiones-mvp.onrender.com/api/auth/login/",
        { email: correo, password: clave },
        { timeout: 30000, headers: { "Content-Type": "application/json" } }
      );
      const { token, user } = response.data.data;
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === "ECONNABORTED") {
        setServerError("El servidor tardó en responder. Intenta de nuevo.");
        return;
      }
      if (error.response) {
        const data = error.response.data;
        setServerError(data?.detail || data?.message || data?.non_field_errors?.[0] || "Credenciales incorrectas");
      } else {
        setServerError("No se pudo conectar con el servidor. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-2">

      {/* PANEL IZQUIERDO — solo desktop */}
      <section className="hidden lg:flex relative overflow-hidden flex-col justify-between p-10 border-r border-white/10 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-600/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400/10 blur-3xl rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg">
              <Landmark className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FEDEINVERSIONES</h1>
              <p className="text-slate-400 text-sm">Sistema Nacional Financiero</p>
            </div>
          </div>
          <div className="max-w-xl mt-16">
            <p className="text-emerald-400 font-medium mb-3">Plataforma Estratégica</p>
            <h2 className="text-5xl font-bold text-white leading-tight">
              Impulsando el crecimiento empresarial de Venezuela
            </h2>
            <p className="text-slate-400 mt-6 text-lg leading-relaxed">
              Gestión moderna de fondos de inversión, seguimiento de proyectos,
              trazabilidad financiera y expansión productiva.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4 mt-10">
          {[
            { Icon: Building2,   value: "350+", label: "Empresas"  },
            { Icon: TrendingUp,  value: "120+", label: "Proyectos" },
            { Icon: ShieldCheck, value: "100%", label: "Seguridad" },
          ].map(({ Icon, value, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Icon className="text-emerald-400 mb-3" size={22} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-slate-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PANEL DERECHO — formulario */}
      <section className="flex items-center justify-center px-4 py-10 bg-slate-50 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">

          {/* Branding mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg mb-4">
              <Landmark className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">FEDEINVERSIONES</h1>
            <p className="text-slate-500 mt-1 text-sm">Sistema Nacional Financiero</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8">

            <div className="mb-6 sm:mb-8">
              <p className="text-slate-500 text-sm mb-1">Bienvenido nuevamente</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Iniciar Sesión</h2>
            </div>

            {serverError && (
              <div className="mb-5 bg-red-100 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-500 mb-2">Usuario / Correo</label>
                <input
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={correo}
                  onChange={(e) => { setCorreo(e.target.value); setServerError(""); }}
                  disabled={loading}
                  className="w-full bg-slate-100 border border-slate-300 text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition disabled:opacity-60 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-500 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={clave}
                    onChange={(e) => { setClave(e.target.value); setServerError(""); }}
                    disabled={loading}
                    className="w-full bg-slate-100 border border-slate-300 text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition pr-12 disabled:opacity-60 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-slate-500 hover:text-emerald-500 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                  <input type="checkbox" className="accent-emerald-500" />
                  Recordarme
                </label>
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium transition text-xs sm:text-sm">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 transition py-3 rounded-xl text-white font-semibold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading
                  ? <><Loader2 size={20} className="animate-spin" />Verificando...</>
                  : "Ingresar al Sistema"
                }
              </button>
            </form>

            <div className="mt-6 sm:mt-8 border-t border-slate-200 pt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Acceso cifrado y protegido
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}