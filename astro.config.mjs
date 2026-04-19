import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

console.log('🔥 CONFIG CARICATA');

export default defineConfig({
  adapter: vercel()
});