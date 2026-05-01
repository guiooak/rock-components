import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.stories.tsx',
        'src/utils/**',
        'src/types/**',
        'src/docs/**',
        'src/components/_template/**',
      ],
      tsconfigPath: './tsconfig.json',
    }),
  ],
  css: {
    modules: {
      generateScopedName: '[name]_[local]_[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'tokens/index': resolve(__dirname, 'src/tokens/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entry) => `${entry}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'clsx'],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
