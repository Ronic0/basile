import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Safari iPadOS attend un Content-Type audio correct pour lire un AIFF.
 * Vite ne connaît pas l'extension .aiff → on l'ajoute explicitement.
 */
function aiffMime(): Plugin {
  const handle: Connect.NextHandleFunction = (req, res, next) => {
    const path = (req.url ?? "").split("?")[0].toLowerCase();
    if (path.endsWith(".aiff") || path.endsWith(".aif")) {
      res.setHeader("Content-Type", "audio/aiff");
    }
    next();
  };

  return {
    name: "alphas-aiff-mime",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}

export default defineConfig({
  plugins: [react(), aiffMime()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
