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
    outDir: './dist',
    rollupOptions: {
      input: './src/index.ts',
      output: [
        {
          dir: 'dist',
          entryFileNames: `event-matrix.mjs`,
          format: 'es',
          sourcemap: true,
        },
        {
          dir: 'dist',
          entryFileNames: `event-matrix.min.js`,
          format: 'iife',
          name: 'EventMatrix',
          sourcemap: true,
        }
      ],
    }
  }
})
