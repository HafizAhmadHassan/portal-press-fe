import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig(() => {
  return {
    plugins: [react()],
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
        "@store_device": path.resolve(__dirname, "src/pages/device/core/store"),
        "@sections_admin": path.resolve(__dirname, "src/pages/admin/sections"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@root": path.resolve(__dirname, "src"),
        "@global_styles": path.resolve(__dirname, "src/pages/admin/global"),
      },
    },
  };
});
