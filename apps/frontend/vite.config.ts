import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,            // better than "::" (works for all devices)
    port: 8080,
    strictPort: true,      // avoid random port switching
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },

  // 🔥 Optional but useful for debugging
  define: {
    __DEV__: mode === "development",
  },

  // 🔥 Fix for some CSS + Tailwind edge cases
  css: {
    devSourcemap: true,
  },
}));