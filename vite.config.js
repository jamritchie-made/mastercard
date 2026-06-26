import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

// Multi-page app: every root-level .html file must be declared as a build
// input, otherwise Vite only emits index.html and the other routes 404.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        about: resolve(root, "about.html"),
        exploration: resolve(root, "exploration.html"),
        404: resolve(root, "404.html"),
        403: resolve(root, "403.html"),
      },
    },
  },
});
