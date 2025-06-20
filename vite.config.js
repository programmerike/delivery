// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/shipday-backend': 'http://localhost:5000', //Your backend API base API  
    }
  }
});
