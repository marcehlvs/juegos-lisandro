import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base './' hace que funcione en GitHub Pages sin importar el nombre del repo.
// target es2019 para que corra en navegadores de Smart TV algo viejos.
const single = process.env.SINGLE === '1'

export default defineConfig({
  base: './',
  plugins: [react(), ...(single ? [viteSingleFile()] : [])],
  build: {
    target: 'es2019',
    outDir: single ? 'dist-single' : 'dist',
    assetsInlineLimit: single ? 100000000 : 4096,
  },
})
