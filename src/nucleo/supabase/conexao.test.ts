import { describe, expect, it } from "vitest";

// Este é o único teste do projeto que fala com o Supabase de verdade (sem
// mock). Sua função é diferente dos testes de unidade/componente futuros
// (que vão usar MSW, ver docs/06-testes/01-estrategia-de-testes.md): aqui
// o objetivo é confirmar que a URL e a anon key do .env.local realmente
// apontam para um projeto Supabase ativo, antes de construir qualquer
// funcionalidade em cima dele.
describe("conexão com o Supabase", () => {
  it("responde no endpoint de saúde do serviço de autenticação", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(url, ".env.local precisa definir NEXT_PUBLIC_SUPABASE_URL").toBeDefined();
    expect(anonKey, ".env.local precisa definir NEXT_PUBLIC_SUPABASE_ANON_KEY").toBeDefined();

    const resposta = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: anonKey! },
    });

    expect(resposta.status).toBe(200);
  });
});
