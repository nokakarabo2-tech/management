import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration: the React plugin enables JSX and fast refresh.
// The "test" section configures Vitest (the automated test runner).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // simulates a browser so React components can render in tests
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
