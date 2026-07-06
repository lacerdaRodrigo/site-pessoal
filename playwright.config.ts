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
  // No CI (variável CI=true, definida automaticamente pelo GitHub Actions),
  // uma falha ganha 1 nova tentativa: além de absorver instabilidade
  // passageira de rede, é o que faz o trace ("on-first-retry", abaixo)
  // ser gravado quando algo quebra de verdade.
  retries: process.env.CI ? 1 : 0,
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
