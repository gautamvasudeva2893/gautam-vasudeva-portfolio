import { defineConfig } from 'vite';

export default defineConfig({
  base: '/gautam-vasudeva-portfolio/',
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});