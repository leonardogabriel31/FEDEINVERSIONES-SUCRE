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
  Menu,
  X,
} from "lucide-react";

function useCountDown(from: number, to: number = 0, duration: number = 1800) {
  const [count, setCount] = useState(from);
  useEffect(() => {
    const steps = 50;
    const stepTime = duration / steps;
    const decrement = (from - to) / steps;
    let current = from;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current -= decrement;
      if (step >= steps) {
        setCount(to);
        clearInterval(timer);
      } else setCount(Math.round(current));
    }, stepTime);
    return () => clearInterval(timer);
  }, [from, to, duration]);
  return count;
}

const formatCurrency = (n: number) => `$${n.toLocaleString("es-VE")},00`;

function useWave(cycles = 3) {
  const [waving, setWaving] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setWaving(false), cycles * 600);
    return () => clearTimeout(timer);
  }, [cycles]);
  return waving;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const waving = useWave(4);

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

  const realSaldo1 = 0;
  const realSaldo2 = 0;
  const realSaldo3 = 0;

  const animSaldo1 = useCountDown(84750, realSaldo1, 1800);
  const animSaldo2 = useCountDown(63200, realSaldo2, 2000);
  const animSaldo3 = useCountDown(147950, realSaldo3, 2200);

  const cards = [
    {
      label: "Capital Disponible",
      value: formatCurrency(animSaldo1),
      sub: "Fondos listos para operar",
      icon: <Wallet size={22} />,
      gradient: "from-emerald-500 to-teal-500",
      glow: "rgba(16,185,129,0.2)",
      border: "rgba(16,185,129,0.2)",
    },
    {
      label: "Portafolio Activo",
      value: formatCurrency(animSaldo2),
      sub: "Recursos en proyectos vigentes",
      icon: <TrendingUp size={22} />,
      gradient: "from-blue-500 to-cyan-500",
      glow: "rgba(59,130,246,0.2)",
      border: "rgba(59,130,246,0.2)",
    },
    {
      label: "Patrimonio Total",
      value: formatCurrency(animSaldo3),
      sub: "Valor consolidado de tu cuenta",
      icon: <DollarSign size={22} />,
      gradient: "from-amber-500 to-orange-500",
      glow: "rgba(245,158,11,0.2)",
      border: "rgba(245,158,11,0.2)",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes wave {
          0%,100% { transform: rotate(0deg);   }
          20%      { transform: rotate(20deg);  }
          40%      { transform: rotate(-10deg); }
          60%      { transform: rotate(20deg);  }
          80%      { transform: rotate(-5deg);  }
        }
        .waving { animation: wave 0.6s ease-in-out 4; transform-origin: 70% 70%; display: inline-block; }
        .still  { display: inline-block; }
      `}</style>

      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col">
        <header className="border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <Landmark className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-white font-bold text-base sm:text-lg leading-none">
                FEDEINVERSIONES
              </h1>
              <p className="text-slate-500 text-xs hidden sm:block">
                Sistema Nacional Financiero
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => router.push("/validation")}
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

          <button
            className="sm:hidden text-slate-400 hover:text-white transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {menuOpen && (
          <div className="sm:hidden border-b border-white/10 px-4 py-3 flex flex-col gap-2 bg-slate-950/90 backdrop-blur">
            {isAdmin && (
              <button
                onClick={() => {
                  router.push("/validacion");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium w-full"
              >
                <ShieldCheck size={16} />
                Validar Usuarios
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium w-full"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        )}

        <div className="flex-1 px-4 sm:px-8 py-8 sm:py-10 max-w-6xl mx-auto w-full">
          <div className="mb-8 sm:mb-10">
            {!isAdmin ? (
              <p className="text-emerald-400 text-sm font-medium mb-1">
                Panel de Inversiones
              </p>
            ) : (
              <p className="text-emerald-400 text-sm font-medium mb-1">
                Panel de Administración
              </p>
            )}
            <h2 className="text-white text-2xl sm:text-3xl font-bold">
              {userName ? (
                <>
                  Bienvenido, {userName.split(" ")[0]}{" "}
                  <span className={waving ? "waving" : "still"}>👋</span>
                </>
              ) : (
                <>
                  Bienvenido{" "}
                  <span className={waving ? "waving" : "still"}>👋</span>
                </>
              )}
            </h2>
            {!isAdmin && (
              <p className="text-slate-500 text-sm mt-1">
                Aquí tienes un resumen de tu actividad financiera
              </p>
            )}
          </div>

          {!isAdmin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${card.border}`,
                    boxShadow: `0 8px 32px ${card.glow}`,
                  }}
                >
                  <div
                    className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
                    style={{ background: card.glow, filter: "blur(30px)" }}
                  />
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${card.gradient} shadow-lg relative z-10`}
                  >
                    {card.icon}
                  </div>
                  <div className="relative z-10">
                    <p className="text-slate-400 text-sm mb-1">{card.label}</p>
                    <p className="text-white text-2xl sm:text-3xl font-bold tracking-tight tabular-nums">
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

          {!isAdmin && (
            <div
              className="rounded-2xl border border-white/10 flex items-center justify-center py-16 sm:py-20 flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="text-emerald-400" size={22} />
              </div>
              <p className="text-slate-400 text-sm font-medium">
                Gráficos y estadísticas
              </p>
              <p className="text-slate-600 text-xs">
                Próximamente — contenido en construcción 🚧
              </p>
            </div>
          )}

          {isAdmin && (
            <div
              className="rounded-2xl border border-white/10 flex items-center justify-center py-16 sm:py-20 flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="text-emerald-400" size={22} />
              </div>
              <p className="text-slate-400 text-sm font-medium">
                Panel de administración
              </p>
              <p className="text-slate-600 text-xs">
                Próximamente — contenido en construcción 🚧
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
