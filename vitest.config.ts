import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/utils/test-setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        '**/*.stories.tsx',
        '**/*.test.{ts,tsx}',
        '**/index.ts',
        'src/types/**',
        'src/utils/test-*',
        'src/docs/**',
      ],
    },
  },
});
