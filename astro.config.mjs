import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

console.log('🚀 CONFIG CARICATA');

export default defineConfig({
  output: 'server',
  adapter: vercel(),
});