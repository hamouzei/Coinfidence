import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Vite automatically loads .env files, but we ensure it's configured
  envPrefix: 'VITE_',
  server: {
    port: 5174,
    host: true,
  },
});

