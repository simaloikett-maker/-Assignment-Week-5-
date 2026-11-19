import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/books': {
        target: 'http://localhost:3000',
        bypass(request) {
          if (request.headers.accept?.includes('text/html')) {
            return request.url;
          }
        },
      },
      '/genres': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
    },
  },
});
