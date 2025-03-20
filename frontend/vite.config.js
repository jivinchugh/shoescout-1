import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Change this line
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})