"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  LogOut, Landmark, ShieldCheck, ArrowLeft, Loader2,
  X, CheckCircle2, Eye, Users, Mail, BadgeCheck,
  CalendarDays, Menu, Building2, MapPin, Phone,
  Briefcase, DollarSign, TrendingUp, FileText, Hash,
} from "lucide-react";

// ── Tipo completo del usuario ────────────────────────────────
interface Usuario {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_validated: boolean;
  validated_email: boolean;
  created_at: string;
  updated_at: string;
  // Datos extendidos
  rif?: string;
  n_accionistas?: number;
  address?: string;
  municipality?: string;
  home_number?: string;
  phone_number?: string;
  social_object?: string;
  products?: string;
  start_date?: string;
  experience?: string;
  comercial_name?: string;
  workers?: number;
  workers_to_date?: string;
  facturation_last_year?: number;
  mercantil?: string;
  capital_suscribed?: string;
  capital_paid?: string;
  dni?: string;
  company_position?: string;
  n_actions?: string;
  actions_type?: string;
  amount?: number;
}

const formatDate = (iso: string) => {
  if (!iso) return "—";
  try {
    const date = new Date(iso.replace(/(\.\d+)?([+-]\d{2}:\d{2})$/, "Z"));
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
};

const formatCurrency = (n?: number) =>
  n != null ? `$${n.toLocaleString("es-VE")}` : "—";

const val = (v?: string | number | null) =>
  v != null && v !== "" ? String(v) : "—";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

export default function ValidacionPage() {
  const router = useRouter();
  const [usuarios, setUsuarios]     = useState<Usuario[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [selected, setSelected]     = useState<Usuario | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [validating, setValidating] = useState(false);
  const [confirmed, setConfirmed]   = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);

  // ── Cargar lista ───────────────────────────────────────────
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await axios.get(
          "https://fedeinversiones-mvp.onrender.com/api/auth/users/",
          { timeout: 30000, headers: { Authorization: `Bearer ${token}` } }
        );
        // console.log("DETALLE COMPLETO:", res.data);
        const data: Usuario[] = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setUsuarios(data.filter((u) => !u.is_validated));
      } catch {
        setError("No se pudo cargar la lista de usuarios. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // ── Abrir detalle completo ─────────────────────────────────
  const handleOpenDetail = async (u: Usuario) => {
    try {
      setLoadingDetail(true);
      const token = getToken();
      const res = await axios.get(
        `https://fedeinversiones-mvp.onrender.com/api/auth/users/${u.id}/`,
        { timeout: 30000, headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("DETALLE COMPLETO:", res.data);
      setSelected(res.data);
    } catch {
      alert("No se pudo cargar el detalle del usuario. Intenta de nuevo.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // ── Validar usuario ────────────────────────────────────────
  const handleValidar = async () => {
    if (!selected) return;
    try {
      setValidating(true);
      const token = getToken();
      await axios.patch(
        "https://fedeinversiones-mvp.onrender.com/api/auth/users/validate",
        { id: String(selected.id), is_validated: true, validated_email: true },
        { timeout: 30000, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setConfirmed(true);
      setTimeout(() => {
        setUsuarios((prev) => prev.filter((u) => u.id !== selected.id));
        setSelected(null);
        setConfirmed(false);
      }, 1600);
    } catch (err: any) {
      alert(err.response?.data?.message || err.response?.data?.detail || "Error al validar usuario");
    } finally {
      setValidating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ── Secciones del modal ────────────────────────────────────
  const secciones = selected ? [
    {
      titulo: "Identificación",
      campos: [
        { icon: <Mail size={14} />,        label: "Correo",          value: val(selected.email) },
        { icon: <Hash size={14} />,         label: "RIF",             value: val(selected.rif) },
        { icon: <Users size={14} />,        label: "N° Accionistas",  value: val(selected.n_accionistas) },
        { icon: <BadgeCheck size={14} />,   label: "Email verificado",value: selected.validated_email ? "Sí" : "No" },
        // { icon: <CalendarDays size={14} />, label: "Registro",        value: formatDate(selected.created_at) },
      ],
    },
    {
      titulo: "Ubicación y Contacto",
      campos: [
        { icon: <MapPin size={14} />,   label: "Dirección",  value: val(selected.address) },
        { icon: <MapPin size={14} />,   label: "Municipio",  value: val(selected.municipality) },
        { icon: <Hash size={14} />,     label: "N° Casa",    value: val(selected.home_number) },
        { icon: <Phone size={14} />,    label: "Teléfono",   value: val(selected.phone_number) },
      ],
    },
    {
      titulo: "Información Comercial",
      campos: [
        { icon: <Building2 size={14} />,   label: "Nombre Comercial",  value: val(selected.comercial_name) },
        { icon: <FileText size={14} />,    label: "Objeto Social",     value: val(selected.social_object) },
        { icon: <Briefcase size={14} />,   label: "Productos",         value: val(selected.products) },
        { icon: <CalendarDays size={14} />,label: "Constitución",      value: val(selected.start_date) },
        { icon: <TrendingUp size={14} />,  label: "Experiencia",       value: val(selected.experience) },
        { icon: <Users size={14} />,       label: "Trabajadores",      value: val(selected.workers) },
        { icon: <CalendarDays size={14} />,label: "Hasta la fecha",   value: val(selected.workers_to_date) },
        { icon: <DollarSign size={14} />,  label: "Facturación último año", value: formatCurrency(selected.facturation_last_year) },
      ],
    },
    {
      titulo: "Capital y Representante",
      campos: [
        { icon: <FileText size={14} />,    label: "Registro Mercantil",   value: val(selected.mercantil) },
        { icon: <DollarSign size={14} />,  label: "Capital Suscrito",     value: val(selected.capital_suscribed) },
        { icon: <DollarSign size={14} />,  label: "Capital Pagado",       value: val(selected.capital_paid) },
        { icon: <Hash size={14} />,        label: "Cédula Rep. Legal",    value: val(selected.dni) },
        { icon: <Briefcase size={14} />,   label: "Cargo",                value: val(selected.company_position) },
      ],
    },
    {
      titulo: "Acciones e Inversión",
      campos: [
        { icon: <Hash size={14} />,        label: "N° Acciones",   value: val(selected.n_actions) },
        { icon: <FileText size={14} />,    label: "Tipo Acciones", value: val(selected.actions_type) },
        { icon: <DollarSign size={14} />,  label: "Monto",         value: formatCurrency(selected.amount) },
      ],
    },
  ] : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col">

      {/* ── Navbar ── */}
      <header className="border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <Landmark className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-white font-bold text-base sm:text-lg leading-none">FEDEINVERSIONES</h1>
            <p className="text-slate-500 text-xs hidden sm:block">Sistema Nacional Financiero</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition text-sm font-medium">
            <ArrowLeft size={16} />Volver al Dashboard
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition text-sm font-medium">
            <LogOut size={16} />Cerrar Sesión
          </button>
        </div>
        <button className="sm:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuOpen && (
        <div className="sm:hidden border-b border-white/10 px-4 py-3 flex flex-col gap-2 bg-slate-950/90">
          <button onClick={() => { router.push("/dashboard"); setMenuOpen(false); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-slate-400 text-sm w-full">
            <ArrowLeft size={16} />Volver al Dashboard
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-slate-400 text-sm w-full">
            <LogOut size={16} />Cerrar Sesión
          </button>
        </div>
      )}

      {/* ── Contenido ── */}
      <div className="flex-1 px-4 sm:px-8 py-8 sm:py-10 max-w-6xl mx-auto w-full">

        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="text-emerald-400" size={22} />
          </div>
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-bold">Validar Usuarios</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Gestiona y autoriza el acceso al sistema</p>
          </div>
          {!loading && usuarios.length > 0 && (
            <span className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium">
              <Users size={13} />{usuarios.length} pendiente{usuarios.length !== 1 ? "s" : ""}
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
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl text-sm">{error}</div>
        )}
        {!loading && !error && usuarios.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Todo al día</p>
            <p className="text-slate-500 text-sm">No hay usuarios pendientes de validación</p>
          </div>
        )}

        {!loading && !error && usuarios.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  {["Nombre completo", "Correo", "Rol", "Registro", "Acciones"].map((h) => (
                    <th key={h} className="px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 text-xs font-bold">{u.full_name?.charAt(0)?.toUpperCase() ?? "?"}</span>
                        </div>
                        <span className="text-white text-sm font-medium whitespace-nowrap">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-400 text-sm whitespace-nowrap">{u.email}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 whitespace-nowrap">{u.role}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-500 text-sm whitespace-nowrap">{formatDate(u.created_at)}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => handleOpenDetail(u)}
                        disabled={loadingDetail}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 transition text-xs sm:text-sm font-medium whitespace-nowrap disabled:opacity-50"
                      >
                        {loadingDetail ? <Loader2 size={13} className="animate-spin" /> : <Eye size={13} />}
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
          MODAL — Datos completos + Validar
      ══════════════════════════════════════ */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget && !validating) { setSelected(null); setConfirmed(false); } }}
        >
          <div
            className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl flex flex-col"
            style={{ background: "#0f1f1a", maxHeight: "90vh" }}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 text-lg font-bold">{selected.full_name?.charAt(0)?.toUpperCase() ?? "?"}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-tight">{selected.full_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{selected.role}</span>
                    <span className="text-slate-500 text-xs">ID #{selected.id}</span>
                  </div>
                </div>
              </div>
              {!validating && (
                <button onClick={() => { setSelected(null); setConfirmed(false); }} className="text-slate-500 hover:text-white transition flex-shrink-0">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Cuerpo scrollable */}
            <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-5 space-y-6">
              {secciones.map((seccion) => (
                <div key={seccion.titulo}>
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    {seccion.titulo}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {seccion.campos.map(({ icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3 bg-white/5 rounded-xl px-4 py-3">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                          {icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-500 text-xs">{label}</p>
                          <p className="text-white text-sm font-medium break-words">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer — botón validar */}
            <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-white/10 flex-shrink-0">
              {confirmed ? (
                <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 size={20} />¡Usuario validado correctamente!
                </div>
              ) : (
                <button
                  onClick={handleValidar}
                  disabled={validating}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold text-sm shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {validating
                    ? <><Loader2 size={18} className="animate-spin" />Validando...</>
                    : <><ShieldCheck size={18} />Validar Usuario</>
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}