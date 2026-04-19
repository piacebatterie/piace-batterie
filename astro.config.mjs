import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

throw new Error('CONFIG LETTA');

export default defineConfig({
  output: 'server',
  adapter: vercel(),
});