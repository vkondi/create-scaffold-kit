import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  shims: true,
  dts: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  bundle: true,
  platform: 'node',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
