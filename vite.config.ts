import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
  build: {
    // No exponer el código fuente legible en el build de producción.
    // Esto no evita que alguien vea el HTML/CSS final (eso es inevitable,
    // así funciona un navegador) pero sí evita dejarles el mapa directo
    // al código original prolijo.
    sourcemap: false,
  },
});
