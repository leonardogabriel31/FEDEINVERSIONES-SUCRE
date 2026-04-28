"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  LogOut,
  Landmark,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  X,
  CheckCircle2,
  Eye,
  Users,
  Mail,
  BadgeCheck,
  CalendarDays,
  UserCircle,
  Menu,
} from "lucide-react";

interface Usuario {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_validated: boolean;
  validated_email: boolean;
  created_at: string;
  updated_at: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

export default function ValidacionPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [validating, setValidating] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await axios.get(
          "https://fedeinversiones-mvp.onrender.com/api/auth/users/",
          { timeout: 30000, headers: { Authorization: `Bearer ${token}` } },
        );
        const data: Usuario[] = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? []);
        setUsuarios(data.filter((u) => !u.is_validated));
      } catch (err: any) {
        setError("No se pudo cargar la lista de usuarios. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleValidar = async () => {
    if (!selected) return;
    try {
      setValidating(true);
      const token = getToken();
      await axios.patch(
        "https://fedeinversiones-mvp.onrender.com/api/auth/users/validate",
        { id: String(selected.id), is_validated: true, validated_email: true },
        {
          timeout: 30000,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setConfirmed(true);
      setTimeout(() => {
        setUsuarios((prev) => prev.filter((u) => u.id !== selected.id));
        setSelected(null);
        setConfirmed(false);
      }, 1600);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Error al validar el usuario.",
      );
    } finally {
      setValidating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
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
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Volver al Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition text-sm font-medium"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>

        <button
          className="sm:hidden text-slate-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuOpen && (
        <div className="sm:hidden border-b border-white/10 px-4 py-3 flex flex-col gap-2 bg-slate-950/90">
          <button
            onClick={() => {
              router.push("/dashboard");
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-slate-400 text-sm w-full"
          >
            <ArrowLeft size={16} />
            Volver al Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-slate-400 text-sm w-full"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      )}

      <div className="flex-1 px-4 sm:px-8 py-8 sm:py-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="text-emerald-400" size={22} />
          </div>
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-bold">
              Validar Usuarios
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Gestiona y autoriza el acceso al sistema
            </p>
          </div>
          {!loading && usuarios.length > 0 && (
            <span className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium">
              <Users size={13} />
              {usuarios.length} pendiente{usuarios.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
            <Loader2 size={22} className="animate-spin text-emerald-400" />
            <span className="text-sm">Cargando usuarios...</span>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && usuarios.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Todo al día</p>
            <p className="text-slate-500 text-sm">
              No hay usuarios pendientes de validación
            </p>
          </div>
        )}

        {!loading && !error && usuarios.length > 0 && (
          <div
            className="overflow-x-auto rounded-2xl border border-white/10"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  {[
                    "Nombre completo",
                    "Correo",
                    "Rol",
                    "Registro",
                    "Acciones",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 text-xs font-bold">
                            {u.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium whitespace-nowrap">
                          {u.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-400 text-sm whitespace-nowrap">
                      {u.email}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 whitespace-nowrap">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => setSelected(u)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 transition text-xs sm:text-sm font-medium whitespace-nowrap"
                      >
                        <Eye size={13} />
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !validating) {
              setSelected(null);
              setConfirmed(false);
            }
          }}
        >
          <div
            className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ background: "#0f1f1a" }}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="text-emerald-400" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">
                    Detalle del Usuario
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Revisa los datos antes de validar
                  </p>
                </div>
              </div>
              {!validating && (
                <button
                  onClick={() => {
                    setSelected(null);
                    setConfirmed(false);
                  }}
                  className="text-slate-500 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 text-lg sm:text-xl font-bold">
                    {selected.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-bold text-base sm:text-lg leading-tight">
                    {selected.full_name}
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {selected.role}
                  </span>
                </div>
              </div>

              {[
                {
                  icon: <Mail size={15} />,
                  label: "Correo",
                  value: selected.email,
                },
                {
                  icon: <UserCircle size={15} />,
                  label: "ID",
                  value: String(selected.id),
                },
                {
                  icon: <BadgeCheck size={15} />,
                  label: "Email verificado",
                  value: selected.validated_email ? "Sí" : "No",
                },
                {
                  icon: <CalendarDays size={15} />,
                  label: "Fecha de registro",
                  value: formatDate(selected.created_at),
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{label}</p>
                    <p className="text-white text-sm font-medium break-all">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 sm:px-6 pb-6">
              {confirmed ? (
                <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 size={20} />
                  ¡Usuario validado correctamente!
                </div>
              ) : (
                <button
                  onClick={handleValidar}
                  disabled={validating}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold text-sm shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {validating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Validar Usuario
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
