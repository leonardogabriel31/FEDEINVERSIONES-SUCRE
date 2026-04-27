'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginUser, saveSession, ApiError } from '@/lib/auth'

/* ─── SVG decorativo — líneas geométricas financieras ─────────────── */
function GeoLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
      viewBox="0 0 700 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="0" y1="200" x2="700" y2="600" stroke="#C9962A" strokeWidth="0.8" />
      <line x1="0" y1="500" x2="700" y2="100" stroke="#C9962A" strokeWidth="0.5" />
      <line x1="350" y1="0" x2="350" y2="900" stroke="#C9962A" strokeWidth="0.4" />
      <circle cx="350" cy="450" r="220" stroke="#C9962A" strokeWidth="0.5" />
      <circle cx="350" cy="450" r="300" stroke="#C9962A" strokeWidth="0.3" />
      <rect x="120" y="180" width="460" height="540" rx="2" stroke="#C9962A" strokeWidth="0.4" />
    </svg>
  )
}

/* ─── Ícono ojo (mostrar/ocultar password) ────────────────────────── */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
           -1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7
           a9.956 9.956 0 012.293-3.95M6.938 6.938A9.956 9.956 0 0112 5
           c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.48 2.605
           M6.938 6.938L3 3m3.938 3.938l10.124 10.124M17 17l-3.938-3.938" />
    </svg>
  )
}

/* ─── Componente principal ─────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      /* ── Cuando el endpoint esté listo, esto simplemente funciona ── */
      const response = await loginUser({ email, password })
      saveSession(response)
      router.push('/dashboard')
    } catch (err: unknown) {
      // Manejo de errores Axios
      const axiosErr = err as { response?: { data?: { detail?: string }; status?: number } }
      if (axiosErr?.response) {
        const status = axiosErr.response.status
        if (status === 401) {
          setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
        } else if (status === 400) {
          setError('Datos inválidos. Por favor revisa los campos.')
        } else {
          setError('Error del servidor. Intenta de nuevo en un momento.')
        }
      } else {
        // Sin conexión al backend aún — útil para demostración
        setError('No se pudo conectar con el servidor. (Backend en desarrollo)')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-hero flex items-center justify-center p-4">

      {/* ── Contenedor split ──────────────────────────────────────── */}
      <div className="w-full max-w-5xl min-h-[600px] flex rounded-2xl overflow-hidden
                      shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

        {/* ── Panel izquierdo — branding ────────────────────────── */}
        <aside className="hidden md:flex flex-col justify-between relative
                          w-[45%] bg-slate p-12 overflow-hidden">
          <GeoLines />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded bg-brand-gold flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display font-semibold text-white tracking-wide text-sm uppercase">
                FEDEINDUSTRIAS
              </span>
            </div>
            <p className="text-brand-muted text-xs tracking-widest uppercase">
              Estado Sucre · Venezuela
            </p>
          </div>

          {/* Tagline central */}
          <div className="relative z-10">
            <h1 className="font-display text-4xl font-semibold text-white leading-tight mb-4">
              Gestión de<br />
              <span className="text-gold">Fondos de</span><br />
              Inversión
            </h1>
            <p className="text-brand-muted text-sm leading-relaxed font-light max-w-xs">
              Plataforma centralizada para el seguimiento, análisis y administración
              de portafolios de inversión empresarial.
            </p>
          </div>

          {/* Footer del panel */}
          <div className="relative z-10">
            <div className="h-px bg-gradient-to-r from-brand-gold/40 to-transparent mb-4" />
            <p className="text-brand-muted/50 text-xs">
              © {new Date().getFullYear()} FEDEINDUSTRIAS · Todos los derechos reservados
            </p>
          </div>
        </aside>

        {/* ── Panel derecho — formulario ────────────────────────── */}
        <section className="flex-1 bg-[#0D1B2E] flex flex-col justify-center px-10 md:px-14 py-12">

          {/* Header mobile */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded bg-brand-gold flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-brand-navy" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display text-sm font-semibold text-white uppercase tracking-wide">
              FEDEINDUSTRIAS
            </span>
          </div>

          {/* Títulos */}
          <div className="mb-10 animate-fade-up">
            <p className="text-brand-gold text-xs tracking-[0.2em] uppercase font-body font-medium mb-2">
              Acceso al sistema
            </p>
            <h2 className="font-display text-3xl font-semibold text-white">
              Bienvenido de vuelta
            </h2>
            <p className="text-brand-muted text-sm mt-2 font-light">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Email */}
            <div className="animate-fade-up">
              <label className="block text-brand-muted text-xs tracking-widest uppercase mb-3">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@fedeindustrias.com"
                required
                autoComplete="email"
                className="input-field"
              />
            </div>

            {/* Password */}
            <div className="animate-fade-up">
              <label className="block text-brand-muted text-xs tracking-widest uppercase mb-3">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-0 bottom-3 text-brand-muted hover:text-brand-gold transition-colors"
                  tabIndex={-1}
                  aria-label="Mostrar u ocultar contraseña"
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              <div className="mt-3 text-right">
                <Link href="/forgot-password"
                  className="text-brand-muted/60 hover:text-brand-gold text-xs transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="animate-fade-up flex items-start gap-3 bg-red-500/10 border border-red-500/25
                              rounded-lg px-4 py-3">
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71
                       c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
                       0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="animate-fade-up pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed
                           disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verificando...
                  </>
                ) : (
                  'Ingresar al sistema'
                )}
              </button>
            </div>

          </form>

          {/* Footer */}
          <div className="animate-fade-up mt-10 pt-6 border-t border-white/5">
            <p className="text-brand-muted/50 text-xs text-center">
              ¿No tienes cuenta?{' '}
              <Link href="/register"
                className="text-brand-gold hover:text-brand-gold-light transition-colors font-medium">
                Solicitar acceso
              </Link>
            </p>
          </div>

        </section>
      </div>
    </main>
  )
}
