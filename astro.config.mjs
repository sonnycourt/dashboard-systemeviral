import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'hybrid',
  server: {
    port: 4321
  }
});

