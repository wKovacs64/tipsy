import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || (process.env.CI ? "4173" : "5173");

export default defineConfig({
  testDir: "./playwright/tests",
  outputDir: "./playwright/results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : "50%",
  reporter: [["html", { outputFolder: "./playwright/report" }]],
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI ? "npm run preview" : "npm run dev",
    port: Number.parseInt(PORT, 10),
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 30 * 1000,
  },
});
