import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test.local" });

// Decisão (ADR 10, docs/01-arquitetura/06-decisoes-tecnicas.md): E2E roda
// contra o deploy real na Vercel, não contra localhost.
const urlBase =
  process.env.PLAYWRIGHT_BASE_URL ?? "https://site-pessoal-wgis.vercel.app";

// A URL interna de um deploy (a que o CI recebe via deployment_status) fica
// atrás da Deployment Protection da Vercel (Vercel Authentication): sem estar
// logado na Vercel, a requisição leva um redirect para a tela de login em vez
// do app, e o Playwright quebra. O "Protection Bypass for Automation" (fluxo
// oficial da Vercel para CI/E2E) resolve isso — um secret do projeto enviado
// no header x-vercel-protection-bypass faz a Vercel liberar a requisição sem
// tocar na proteção real. O valor chega pelo GitHub Secret de mesmo nome
// (ver docs/07-deploy/01-ambientes-e-pipeline.md, seção 7). Quando ele não
// existe — ex.: rodar local contra o domínio público, que não é protegido —
// nenhum header é enviado.
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const extraHTTPHeaders = bypassSecret
  ? {
      "x-vercel-protection-bypass": bypassSecret,
      // Grava o bypass num cookie (via Set-Cookie) já na primeira resposta,
      // para que as navegações seguintes dentro do navegador também passem —
      // necessário para o teste in-browser, não só para a primeira request.
      "x-vercel-set-bypass-cookie": "true",
    }
  : undefined;

export default defineConfig({
  testDir: "./testes-e2e",
  // Os E2E usam a mesma conta real do Supabase. Rodar em paralelo cria disputa
  // de sessão/logout entre testes; serializar deixa a suíte mais determinística.
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  // No CI (variável CI=true, definida automaticamente pelo GitHub Actions),
  // uma falha ganha 1 nova tentativa: além de absorver instabilidade
  // passageira de rede, é o que faz o trace ("on-first-retry", abaixo)
  // ser gravado quando algo quebra de verdade.
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: urlBase,
    trace: "on-first-retry",
    extraHTTPHeaders,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
