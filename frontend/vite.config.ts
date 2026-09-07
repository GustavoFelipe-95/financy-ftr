import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@constants': '/src/constants',
      '@context': '/src/context',
      '@graphql': '/src/graphql',
      '@hooks': '/src/hooks',
      '@lib': '/src/lib',
      '@pages': '/src/pages',
      '@routes': '/src/routes',
      '@storage': '/src/storage',
      '@types': '/src/types',
      '@validations': '/src/validations'
    }
  }
})
