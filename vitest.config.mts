import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // tsconfig keeps JSX as is for Next; the specs that import a component
  // need it compiled here.
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    include: ['src/**/*.spec.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
