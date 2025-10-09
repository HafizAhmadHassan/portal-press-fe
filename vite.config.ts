import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import * as path from "path";

export default defineConfig(() => {
  return {
    // Configurazione server per sviluppo
    server: {
      port: 5174,
    },

    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        manifest: false, // Usa il manifest in public/manifest.webmanifest
        strategies: "generateSW", // Usa generateSW invece di injectManifest
        workbox: {
          navigateFallback: "/index.html",
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
          // Aggiungi le icone al precaching
          additionalManifestEntries: [
            { url: "/assets/icons/icon-48.png", revision: null },
            { url: "/assets/icons/icon-72.png", revision: null },
            { url: "/assets/icons/icon-96.png", revision: null },
            { url: "/assets/icons/icon-144.png", revision: null },
            { url: "/assets/icons/icon-192.png", revision: null },
            { url: "/assets/icons/icon-512.png", revision: null },
            { url: "/assets/icons/icon-512-maskable.png", revision: null },
          ],
          // Crea una route per le icone
          runtimeCaching: [
            {
              urlPattern: /^\/assets\/icons\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "icons-cache",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 anno
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        // alias esistenti
        "@public": path.resolve(__dirname, "public"),
        "@assets": path.resolve(__dirname, "public/assets"),
        "@components": path.resolve(__dirname, "src/components"),
        "@shared": path.resolve(__dirname, "src/components/shared"),
        "@layouts": path.resolve(__dirname, "src/layouts"),
        "@core_admin": path.resolve(__dirname, "src/pages/admin/core"),
        "@store_admin": path.resolve(__dirname, "src/pages/admin/core/store"),
        "@store_device": path.resolve(__dirname, "src/pages/device/store"),
        "@sections_admin": path.resolve(__dirname, "src/pages/admin/sections"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@root": path.resolve(__dirname, "src"),
        "@global_styles": path.resolve(__dirname, "src/pages/admin/global"),
        "@/lib": path.resolve(__dirname, "src/lib"),
      },
    },
  };
});
