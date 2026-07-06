import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test.local" });

// Decisão (ADR 10, docs/01-arquitetura/06-decisoes-tecnicas.md): E2E roda
// contra o deploy real na Vercel, não contra localhost.
const urlBase =
  process.env.PLAYWRIGHT_BASE_URL ?? "https://site-pessoal-wgis.vercel.app";

export default defineConfig({
  testDir: "./testes-e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: urlBase,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
