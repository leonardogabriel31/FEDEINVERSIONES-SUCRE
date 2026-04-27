# FEDEINDUSTRIAS — Sistema de Gestión de Fondos

Plataforma web para la gestión de fondos de inversión. Desarrollada con **Next.js 14** + **TailwindCSS**.

---

## 🚀 Cómo levantar el proyecto

```bash
# 1. Instala dependencias
npm install

# 2. Configura variables de entorno
cp .env.example .env.local
# Edita .env.local con la URL del backend cuando esté lista

# 3. Corre el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── login/         → Pantalla de inicio de sesión
│   ├── register/      → Registro de usuario (próximo)
│   └── dashboard/     → Panel principal (próximo)
├── lib/
│   └── auth.ts        → Servicios de autenticación (consume API Django)
└── components/
    └── ui/            → Componentes reutilizables (próximo)
```

---

## 🔌 Conexión con el Backend (Django)

Cuando el endpoint de login esté listo, solo actualiza `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://tu-servidor:8000/api
```

El servicio en `src/lib/auth.ts` espera:

**POST** `/api/auth/login/`

**Body:**
```json
{ "email": "usuario@ejemplo.com", "password": "contraseña" }
```

**Response esperada (Django SimpleJWT):**
```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "full_name": "Juan Pérez",
    "role": "admin"
  }
}
```

---

## 🎨 Stack

- **Next.js 14** (App Router)
- **TailwindCSS 3**
- **TypeScript**
- **Axios** para peticiones HTTP
- **Fuentes**: Playfair Display + DM Sans (Google Fonts)
