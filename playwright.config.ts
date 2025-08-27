import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  use: {
    headless: true,
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
      viewport: { width: 1280, height: 900 }, // чтобы desktop-таблица была видна
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  reporter: [["list"]],
});

