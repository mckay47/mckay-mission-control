import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error — plugin is .mjs, no declaration file
import mckayPlugin from './scripts/vite-mckay-plugin.mjs'

export default defineConfig({
  plugins: [react(), tailwindcss(), mckayPlugin()],
})
