import { defineConfig, loadEnv } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return defineConfig({
    plugins: [react()],
    base: "/",
    build: {
      outDir: "dist",
      assetsDir: "./",
    },
    server: {
      port: 3000,
      open: true,
    },
  });
});
