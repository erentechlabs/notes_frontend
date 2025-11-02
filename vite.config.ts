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
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        safari10: true,
      },
    },
    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group React-related packages
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          // Group TipTap editor packages separately (they're lazy loaded)
          if (id.includes('@tiptap')) {
            return 'editor-vendor';
          }
          // Group Lucide icons
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          // Other node_modules in a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk filenames for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Source maps for debugging (can be disabled for smaller builds)
    sourcemap: false,
  },
  server: {
    port: 3000,
    // Proxy only if using url backend
    proxy: process.env.VITE_USE_LOCAL_BACKEND === 'true' ? {
      '/api': {
        target: 'https://notefade-861651561873.europe-west1.run.app',
        changeOrigin: true,
      },
    } : undefined,
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'tiptap-vendor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-text-align',
            '@tiptap/extension-underline',
            '@tiptap/extension-text-style',
            '@tiptap/extension-color',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-task-list',
            '@tiptap/extension-task-item',
            '@tiptap/extension-highlight',
            '@tiptap/extension-subscript',
            '@tiptap/extension-superscript',
            '@tiptap/extension-strike',
            '@tiptap/extension-code-block',
          ],
          'ui-vendor': ['lucide-react', 'clsx'],
          'utils': ['axios', 'date-fns'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging (optional)
    sourcemap: false,
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Copy public assets including service worker
    copyPublicDir: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tiptap/react',
      '@tiptap/starter-kit',
    ],
  },
})
