import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/three-body-simulator/" : "/",
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: "es2022",
    sourcemap: false,
  },
}));
