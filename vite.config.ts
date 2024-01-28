import typescript from '@rollup/plugin-typescript'
import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [
    typescript({
      target: 'es5',
      sourceMap: true,
      outDir: 'dist',
    })
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'EventMatrix',
      fileName: (format) => `event-matrix.${format}.js`
    },
    outDir: './dist',
    sourcemap: true
  }
})
