/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom", // 👈 enables DOM for React testing
    globals: true,        // allows describe/it/expect without imports everywhere
    setupFiles: "./src/setupTests.js", // optional setup file
  },
});