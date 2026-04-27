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
} from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────────
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

  const [usuarios, setUsuarios]       = useState<Usuario[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  // Modal
  const [selected, setSelected]       = useState<Usuario | null>(null);
  const [validating, setValidating]   = useState(false);
  const [confirmed, setConfirmed]     = useState(false); // animación de éxito

  // ── Cargar usuarios ────────────────────────────────────────
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await axios.get(
          "https://fedeinversiones-mvp.onrender.com/api/auth/users/",
          {
            timeout: 30000,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filtrar solo los NO validados (los que están pendientes)
        const data: Usuario[] = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? [];

        setUsuarios(data.filter((u) => !u.is_validated));
      } catch (err: any) {
        setError("No se pudo cargar la lista de usuarios. Intenta de nuevo.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // ── Validar usuario ────────────────────────────────────────
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
        }
      );

      // Mostrar animación de éxito
      setConfirmed(true);

      // Esperar un momento, luego cerrar modal y quitar de la tabla
      setTimeout(() => {
        setUsuarios((prev) => prev.filter((u) => u.id !== selected.id));
        setSelected(null);
        setConfirmed(false);
      }, 1600);

    } catch (err: any) {
      console.error("Error al validar:", err);
      alert(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Error al validar el usuario. Intenta de nuevo."
      );
    } finally {
      setValidating(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ── Render ─────────────────────────────────────────────────
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
      </header>

      {/* ── Contenido ── */}
      <div className="flex-1 px-8 py-10 max-w-6xl mx-auto w-full">

        {/* Header sección */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">Validar Usuarios</h2>
            <p className="text-slate-500 text-sm">
              Gestiona y autoriza el acceso de los usuarios al sistema
            </p>
          </div>

          {/* Badge contador */}
          {!loading && usuarios.length > 0 && (
            <span className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Users size={14} />
              {usuarios.length} pendiente{usuarios.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── Estado: cargando ── */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
            <Loader2 size={22} className="animate-spin text-emerald-400" />
            <span className="text-sm">Cargando usuarios...</span>
          </div>
        )}

        {/* ── Estado: error ── */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* ── Estado: sin pendientes ── */}
        {!loading && !error && usuarios.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Todo al día</p>
            <p className="text-slate-500 text-sm">No hay usuarios pendientes de validación</p>
          </div>
        )}

        {/* ── Tabla ── */}
        {!loading && !error && usuarios.length > 0 && (
          <div
            className="overflow-hidden rounded-2xl border border-white/10"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Nombre completo", "Correo", "Rol", "Registro", "Acciones"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 text-xs font-bold">
                            {u.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium">{u.full_name}</span>
                      </div>
                    </td>

                    {/* Correo */}
                    <td className="px-6 py-4 text-slate-400 text-sm">{u.email}</td>

                    {/* Rol */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        {u.role}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {formatDate(u.created_at)}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelected(u)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-300 transition text-sm font-medium"
                      >
                        <Eye size={14} />
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

      {/* ══════════════════════════════════════
          MODAL — Detalles + Validar
      ══════════════════════════════════════ */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            // Cerrar al clickear el fondo (solo si no está validando)
            if (e.target === e.currentTarget && !validating) {
              setSelected(null);
              setConfirmed(false);
            }
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ background: "#0f1f1a" }}
          >
            {/* ── Header del modal ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="text-emerald-400" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Detalle del Usuario</h3>
                  <p className="text-slate-500 text-xs">Revisa los datos antes de validar</p>
                </div>
              </div>
              {!validating && (
                <button
                  onClick={() => { setSelected(null); setConfirmed(false); }}
                  className="text-slate-500 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* ── Cuerpo del modal ── */}
            <div className="px-6 py-6 space-y-4">

              {/* Avatar + nombre */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 text-xl font-bold">
                    {selected.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{selected.full_name}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {selected.role}
                  </span>
                </div>
              </div>

              {/* Campos de detalle */}
              {[
                { icon: <Mail size={15} />,        label: "Correo",           value: selected.email },
                { icon: <UserCircle size={15} />,  label: "ID",               value: String(selected.id) },
                { icon: <BadgeCheck size={15} />,  label: "Email verificado", value: selected.validated_email ? "Sí" : "No" },
                { icon: <CalendarDays size={15} />, label: "Fecha de registro", value: formatDate(selected.created_at) },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer del modal — Botón validar ── */}
            <div className="px-6 pb-6">
              {confirmed ? (
                /* Animación de éxito */
                <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 size={20} />
                  ¡Usuario validado correctamente!
                </div>
              ) : (
                <button
                  onClick={handleValidar}
                  disabled={validating}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {validating ? (
                    <><Loader2 size={18} className="animate-spin" />Validando...</>
                  ) : (
                    <><ShieldCheck size={18} />Validar Usuario</>
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