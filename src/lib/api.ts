/**
 * auth.ts — Capa de servicios de autenticación
 * Lista para conectar con el backend Django de tu compañero.
 * Cuando él diga "está listo el endpoint", solo actualizas BASE_URL.
 */

import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access: string   // JWT access token (Django SimpleJWT)
  refresh: string  // JWT refresh token
  user: {
    id: number
    email: string
    full_name: string
    role: string
  }
}

export interface ApiError {
  message: string
  status?: number
}

/* ------------------------------------------------------------------ */
/*  Auth calls                                                          */
/* ------------------------------------------------------------------ */

/**
 * POST /api/auth/login/
 * Espera { email, password } y devuelve tokens + info del usuario.
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login/', payload)
  return data
}

/**
 * Guarda el access token en localStorage (simple por ahora).
 * Cuando implementemos refresh, movemos el refresh a httpOnly cookie.
 */
export function saveSession(response: LoginResponse) {
  localStorage.setItem('access_token', response.access)
  localStorage.setItem('refresh_token', response.refresh)
  localStorage.setItem('user', JSON.stringify(response.user))
}

export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}
