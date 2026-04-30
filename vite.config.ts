import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "./",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Force new hash on every build so stale browser caches are busted
        entryFileNames: `assets/[name]-[hash]-v4.js`,
        chunkFileNames: `assets/[name]-[hash]-v4.js`,
        assetFileNames: `assets/[name]-[hash]-v4.[ext]`,
        // ── Manual chunk splitting ── keeps initial bundle small on mobile
        manualChunks(id) {
          // MediaPipe / face landmarker — only loaded on TryOn page
          if (id.includes('@mediapipe')) return 'mediapipe';
          // Quagga barcode scanner — only loaded on Scanner page
          if (id.includes('quagga')) return 'quagga';
          // Heavy UI lib vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/wouter') || id.includes('node_modules/@tanstack')) return 'react-vendor';
          // Radix UI components
          if (id.includes('@radix-ui')) return 'radix';
          // Lucide icons
          if (id.includes('lucide-react')) return 'icons';
        },
      },
    },
    // Raise warning threshold — we've split chunks manually
    chunkSizeWarningLimit: 600,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
