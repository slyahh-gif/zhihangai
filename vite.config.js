import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages uses a repository subpath; local development still uses '/'.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/zhihangai/' : '/',
});
