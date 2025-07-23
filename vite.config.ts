// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // this will pull in VITE_BASE_URL from .env or .env.[mode]
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_URL || '/',
    plugins: [react()],
  }
})
