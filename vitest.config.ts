import { defineConfig, loadEnv } from "vite";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    env: loadEnv(mode, process.cwd(), ""),
    exclude: ["**/node_modules/**", "**/testes-e2e/**"],
    // Cobertura de testes — meta de 80% focada na CAMADA DE LÓGICA
    // (decidido em 2026-07-06, ver docs/06-testes/01-estrategia-de-testes.md,
    // seção 5). A meta cobre a regra de negócio (`dominio/`) e os utilitários
    // de núcleo (`nucleo/`), onde um número alto significa de fato "minha
    // lógica está testada". Deliberadamente NÃO cobre UI (`app/`,
    // `apresentacao/`), Server Actions (`dados/`) e os wrappers de infra do
    // Supabase — essas camadas são validadas por testes de componente e E2E,
    // não por unidade, e incluí-las só distorceria o número.
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/funcionalidades/**/dominio/**/*.{ts,tsx}",
        "src/nucleo/**/*.{ts,tsx}",
      ],
      exclude: [
        // Wrappers de infra do Supabase (cliente/servidor/proxy/conexão):
        // dependem de ambiente/rede — validados pelo teste de conexão real e
        // pelo E2E, não fazem sentido como alvo de cobertura unitária.
        "src/nucleo/supabase/**",
        "**/*.test.{ts,tsx}",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
