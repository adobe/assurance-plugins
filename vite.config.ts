import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    server: {
      deps: {
        inline: [
          /@adobe\/react-spectrum\/.*/,
          /@react-spectrum\/.*/,
          /@spectrum-icons\/.*/,
        ],
      },
    },
  },
});
