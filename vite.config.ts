import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "https://connect.soulhunters.site:3636",
        changeOrigin: true,
        secure: false, // Ignora erros de certificado
      },
    },
  },
});
