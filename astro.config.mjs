import { defineConfig } from 'astro/config';

// Trang tĩnh thuần: không cần server, đưa thẳng lên Vercel hoặc GitHub Pages
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
});
