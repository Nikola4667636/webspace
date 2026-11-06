import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const page = (name) => fileURLToPath(new URL(name, import.meta.url));

export default defineConfig({
  // Relative base lets the build work on GitHub Pages under any repository name
  base: "./",
  // Listen on all interfaces, not only on localhost
  server: { host: true, port: 5173, strictPort: true },
  preview: { host: true, port: 4173, strictPort: true },
  build: {
    rollupOptions: {
      // Multi-page site: every HTML file is an entry point
      input: {
        main: page("index.html"),
        planets: page("planets.html"),
        missions: page("missions.html")
      }
    }
  }
});
