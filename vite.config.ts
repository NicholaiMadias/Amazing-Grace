import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:              resolve(__dirname, "index.html"),
        arcade:            resolve(__dirname, "arcade/index.html"),
        arcadeCertificates:      resolve(__dirname, "arcade/certificates/index.html"),
        arcadeStarMatrix:        resolve(__dirname, "arcade/star-matrix/index.html"),
        arcadeMatrixOfConscience: resolve(__dirname, "arcade/matrix-of-conscience/index.html"),
        arcadeMatrixAct1:        resolve(__dirname, "arcade/matrix-act-1/index.html"),
        ministry:          resolve(__dirname, "ministry/index.html"),
        ministries:        resolve(__dirname, "ministries/index.html"),
        stories:           resolve(__dirname, "stories/index.html"),
        support:           resolve(__dirname, "support/index.html"),
        gallery1142:       resolve(__dirname, "galleries/1142-7th-street/index.html"),
        gallery1144:       resolve(__dirname, "galleries/1144-7th-street/index.html"),
        gallery926:        resolve(__dirname, "galleries/926-poinsettia/index.html"),
        galleryTampa:      resolve(__dirname, "galleries/tampa-property/index.html"),
        galleryMinistry:   resolve(__dirname, "galleries/ministry/index.html"),
      }
    }
  }
});
