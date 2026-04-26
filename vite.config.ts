import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:   resolve(__dirname, "index.html"),
        arcade: resolve(__dirname, "arcade/index.html")
      }
    }
  }
});
