import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Compress assets with gzip
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Compress assets with brotli
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // Optimize images
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
    }),
    // Copy index to 404 for SPA routing
    {
      name: 'copy-index-to-404',
      writeBundle() {
        const distPath = resolve(__dirname, 'dist');
        const indexPath = join(distPath, 'index.html');
        const notFoundPath = join(distPath, '404.html');
        
        if (existsSync(indexPath)) {
          copyFileSync(indexPath, notFoundPath);
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize bundle size
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'editor-vendor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-color',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-task-item',
            '@tiptap/extension-task-list',
            '@tiptap/extension-text-align',
            '@tiptap/extension-text-style',
            '@tiptap/extension-underline',
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://notefade-861651561873.europe-west1.run.app',
        changeOrigin: true,
      },
    },
  },
})
