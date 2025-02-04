/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [...configDefaults.exclude, "./node_modules/*"],
    environment: "jsdom",
    globals: true,
  },
});
