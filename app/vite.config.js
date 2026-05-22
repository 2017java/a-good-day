import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时设置 base，本地开发和 Zeabur 不需要
  base: process.env.GITHUB_ACTIONS ? '/a-good-day/' : '/',
})
