import { describe, expect, it } from "vitest";

// Este é o único teste do projeto que fala com o Supabase de verdade (sem
// mock). Sua função é diferente dos demais testes de unidade/componente
// (que usam vi.mock ou MSW, ver docs/06-testes/01-estrategia-de-testes.md):
// aqui o objetivo é confirmar que a URL e a anon key do .env.local realmente
// apontam para um projeto Supabase ativo, antes de construir qualquer
// funcionalidade em cima dele.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const temCredenciais = Boolean(url && anonKey);

describe("conexão com o Supabase", () => {
  // Sem as credenciais, o teste é PULADO em vez de falhar — mesmo padrão do
  // E2E. Isso importa porque os PRs do Dependabot rodam o CI SEM acesso aos
  // GitHub Secrets (o GitHub não os expõe a PRs automáticos, por segurança):
  // ali as env vars chegam vazias e um teste de conexão real não teria como
  // passar. Onde há credenciais (.env.local na máquina, CI de PRs normais e
  // da main), ele roda de verdade e valida a conexão. Ver
  // docs/06-testes/01-estrategia-de-testes.md, seção 2.
  it.skipIf(!temCredenciais)(
    "CT-06: responde no endpoint de saúde do serviço de autenticação",
    async () => {
      const resposta = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: anonKey! },
      });

      expect(resposta.status).toBe(200);
    },
  );
});
