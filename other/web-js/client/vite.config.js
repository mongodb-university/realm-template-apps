/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [react(), topLevelAwait()],
  build: {
    outDir: "build",
  },
  server: {
    open: true,
    port: 3000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    coverage: {
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/setupTests.js"],
    },
  },
});
