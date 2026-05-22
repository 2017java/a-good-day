import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时需要设置 base，本地开发不需要
  // 取消注释下面这行，推送到 GitHub 前启用
  // base: '/a-good-day/',
})
