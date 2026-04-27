"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Landmark,
  ShieldCheck,
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

// ── Hook de animación countdown ───────────────────────────────
// Arranca desde `from` y baja hasta `to` en `duration` ms
function useCountDown(from: number, to: number = 0, duration: number = 1800) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const steps     = 50;
    const stepTime  = duration / steps;
    const decrement = (from - to) / steps;
    let current = from;
    let step    = 0;

    const timer = setInterval(() => {
      step++;
      current -= decrement;

      if (step >= steps) {
        setCount(to); // termina EXACTO en el valor real
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [from, to, duration]);

  return count;
}

// ── Formateador ───────────────────────────────────────────────
const formatCurrency = (n: number) =>
  `$${n.toLocaleString("es-VE")},00`;

export default function DashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin]   = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      setIsAdmin(user?.role === "admin");
      setUserName(user?.full_name ?? user?.email ?? "");
    } catch {
      console.error("Error parseando user del localStorage");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ── Valores reales (reemplazar con API cuando esté lista) ──
  const realSaldo1 = 0;
  const realSaldo2 = 0;
  const realSaldo3 = 0;

  // ── Animaciones: arrancan alto, terminan en el valor real ──
  const animSaldo1 = useCountDown(84750,  realSaldo1, 1800);
  const animSaldo2 = useCountDown(63200,  realSaldo2, 2000);
  const animSaldo3 = useCountDown(147950, realSaldo3, 2200);

  const cards = [
    {
      label:    "Capital Disponible",
      value:    formatCurrency(animSaldo1),
      sub:      "Fondos listos para operar",
      icon:     <Wallet size={22} />,
      gradient: "from-emerald-500 to-teal-500",
      glow:     "rgba(16,185,129,0.2)",
      border:   "rgba(16,185,129,0.2)",
    },
    {
      label:    "Portafolio Activo",
      value:    formatCurrency(animSaldo2),
      sub:      "Recursos en proyectos vigentes",
      icon:     <TrendingUp size={22} />,
      gradient: "from-blue-500 to-cyan-500",
      glow:     "rgba(59,130,246,0.2)",
      border:   "rgba(59,130,246,0.2)",
    },
    {
      label:    "Patrimonio Total",
      value:    formatCurrency(animSaldo3),
      sub:      "Valor consolidado de tu cuenta",
      icon:     <DollarSign size={22} />,
      gradient: "from-amber-500 to-orange-500",
      glow:     "rgba(245,158,11,0.2)",
      border:   "rgba(245,158,11,0.2)",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col">

      {/* ── Navbar ── */}
      <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Landmark className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">FEDEINVERSIONES</h1>
            <p className="text-slate-500 text-xs">Sistema Nacional Financiero</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => router.push("/validacion")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-300 transition text-sm font-medium"
            >
              <ShieldCheck size={16} />
              Validar Usuarios
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition text-sm font-medium"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* ── Contenido ── */}
      <div className="flex-1 px-8 py-10 max-w-6xl mx-auto w-full">

        {/* Saludo */}
        <div className="mb-10">
          <p className="text-emerald-400 text-sm font-medium mb-1">Panel de Inversiones</p>
          <h2 className="text-white text-3xl font-bold">
            {userName ? `Bienvenido, ${userName.split(" ")[0]} 👋` : "Bienvenido 👋"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Aquí tienes un resumen de tu actividad financiera
          </p>
        </div>

        {/* ── 3 Cards — solo usuarios normales ── */}
        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {cards.map((card) => (
              <div
                key={card.label}
                className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${card.border}`,
                  boxShadow: `0 8px 32px ${card.glow}`,
                }}
              >
                {/* Glow fondo */}
                <div
                  className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
                  style={{ background: card.glow, filter: "blur(30px)" }}
                />

                {/* Icono */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${card.gradient} shadow-lg relative z-10`}>
                  {card.icon}
                </div>

                {/* Valor animado */}
                <div className="relative z-10">
                  <p className="text-slate-400 text-sm mb-1">{card.label}</p>
                  <p className="text-white text-3xl font-bold tracking-tight tabular-nums">
                    {card.value}
                  </p>
                  <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                    <ArrowUpRight size={12} className="text-emerald-400" />
                    {card.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Placeholder gráficos — solo usuarios normales ── */}
        {!isAdmin && (
          <div
            className="rounded-2xl border border-white/10 flex items-center justify-center py-20 flex-col gap-3"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="text-emerald-400" size={22} />
            </div>
            <p className="text-slate-400 text-sm font-medium">Gráficos y estadísticas</p>
            <p className="text-slate-600 text-xs">Próximamente — contenido en construcción 🚧</p>
          </div>
        )}

      </div>
    </main>
  );
}