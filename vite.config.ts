/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'stellar-icon.svg'],
      manifest: {
        name: 'STELLAR - Astronaut Health Monitoring',
        short_name: 'STELLAR',
        description: 'Autonomous Spaceflight Tracking and Risk Awareness - Astronaut Health Monitoring System',
        theme_color: '#080E1B',
        background_color: '#080E1B',
        display: 'standalone',
        orientation: 'landscape-primary',
        icons: [
          {
            src: 'stellar-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts']
  }
} as any);
