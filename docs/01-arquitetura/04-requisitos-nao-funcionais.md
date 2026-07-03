# Arquitetura — Requisitos Não-Funcionais (RNF)

Os Requisitos Não-Funcionais descrevem as restrições, performance, segurança e regras tecnológicas da aplicação (Como o sistema se comporta).

## RNF01 — Segurança de Dados (RLS - Row Level Security)
* **RNF01.1:** O banco de dados (Supabase) deve implementar políticas de **RLS**. Isso garante, no nível do servidor (e não só na tela), que um usuário autenticado jamais consiga ler, editar ou apagar os registros (prompts) de outro usuário.
* **RNF01.2:** As senhas nunca trafegam ou são salvas no banco de dados como texto normal (O Supabase Auth gerencia o "hash" criptográfico automaticamente).
* **RNF01.3:** A comunicação entre o Next.js (Navegador/Vercel) e o Supabase deve ser feita apenas através de conexão segura (HTTPS).

## RNF02 — Plataforma e Responsividade
* **RNF02.1:** O sistema não possuirá versões mobile nativas (aplicativos de loja Android/iOS) nesta fase do MVP.
* **RNF02.2:** O projeto será desenvolvido com **Next.js**, com deploy exclusivo para Web (sem apps nativos nesta fase).
* **RNF02.3 (Mobile First/Responsive):** O layout deve ser fluido. É obrigatório que o design se ajuste e continue elegante tanto no navegador de um PC quanto no navegador de um celular (sem quebrar botões ou esconder textos importantes). Em telas menores que 768px, o menu lateral não pode ficar fixo consumindo a largura da tela — deve virar um menu hambúrguer em gaveta (*drawer*), conforme especificado em `docs/05-ui-ux/03-telas-e-componentes.md`.

## RNF03 — Padrões Arquiteturais e Ferramentas
* **RNF03.1:** O código frontend (Next.js) deve seguir a organização de pastas *Feature-First*.
* **RNF03.2:** O gerenciamento de estado deve ser feito de forma padronizada utilizando *Zustand* (estado de UI/local) e *TanStack Query* (estado de servidor — dados vindos do Supabase, com cache e refetch automático).
* **RNF03.3:** O roteamento de telas na web (e o controle das URLs do navegador) deve ser feito pelo *App Router*, nativo do Next.js.
* **RNF03.4 (Ferramentas de Teste):** a suíte de testes deve usar *Vitest* (unidade/componente), *Playwright* (E2E) e *MSW* (mock de chamadas ao Supabase) — detalhamento completo da estratégia em `docs/06-testes/01-estrategia-de-testes.md`.
