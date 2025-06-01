import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/delivery/',  // <-- important for GH Pages
  plugins: [react()],
});
