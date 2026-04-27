/** @type {import('next').NextConfig} */
const nextConfig = {
  // Variable de entorno para la URL del backend Django
  // En producción: configura NEXT_PUBLIC_API_URL en tu .env.local
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
}

module.exports = nextConfig
