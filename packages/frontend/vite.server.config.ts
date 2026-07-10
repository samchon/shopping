import ttsc from "@ttsc/unplugin/vite";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [ttsc()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  build: {
    emptyOutDir: false,
    outDir: "dist/server",
    ssr: "src/server/index.ts",
    target: "node22",
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: "server.mjs",
      },
    },
  },
});
