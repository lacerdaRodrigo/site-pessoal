# Roadmap — Detalhamento por Versão

O README traz a visão macro do roadmap (V1/V2/V3). Este documento detalha um pouco mais o **o quê** de cada fase, sem ainda comprometer prazos (o projeto é pessoal e sem deadline fixo).

## V1 (MVP) — Em Planejamento

Foco: aplicação web funcional, single user, cobrindo o ciclo completo de gestão de conhecimento pessoal.

- Autenticação (cadastro, login, logout, recuperação de senha).
- CRUD de Documentos com editor Markdown.
- Categorias e Etiquetas para organização.
- Busca global por título/conteúdo.
- Favoritos.
- Dashboard com visão geral.
- Perfil e configurações básicas (incluindo alternância de tema claro/escuro).
- Pipeline de CI/CD com lint, testes e deploy automático.

**Critério de saída da V1:** todos os RF/RNF definidos em `docs/01-arquitetura/03-requisitos-funcionais.md` e `04-requisitos-nao-funcionais.md` implementados e cobertos por testes (ver Definition of Done em `docs/06-testes/01-estrategia-de-testes.md`).

## V2 — Compartilhamento, Produtividade e IA

Fora de escopo da V1 (ver README, "Fora do Escopo da V1"), mas já mapeado como próximo passo natural:
- **Tornar Público:** marcar um documento específico como "Público", gerando um link de compartilhamento somente leitura.
- **Modo Portfólio:** tela pública e curada listando os melhores guias e prompts do usuário, funcionando como um currículo vivo de habilidades técnicas.
- Integrações de produtividade (a definir quais — ex: exportação, atalhos de teclado avançados).
- **Assistente de IA embutido:** IA nativa (via API) rodando dentro do sistema para tirar dúvidas e ajudar a corrigir/melhorar queries e prompts salvos.
- **Auto-classificação:** ao colar um texto novo, a IA sugere automaticamente em qual categoria ele deve ser salvo.

**Pré-requisito arquitetural:** compartilhamento público exige revisão do modelo de RLS atual (hoje 100% privado por `usuario_id`), então esta fase começa por uma revisão de `docs/04-backend/01-supabase-e-seguranca.md`.

## V3 — Multiusuário e Colaboração

- Sistema multiusuário completo.
- Controle de permissões (RBAC — Role-Based Access Control).
- Versionamento de documentos (histórico de edições).
- Colaboração em tempo real.

**Pré-requisito arquitetural:** esta fase provavelmente exige revisitar a modelagem de dados (`docs/02-banco-de-dados/01-entidades.md`) para suportar múltiplos donos/colaboradores por documento, algo que o modelo atual (um `usuario_id` fixo por linha) não contempla.

## Como Este Documento Deve Evoluir

Sempre que uma funcionalidade de V2 ou V3 for antecipada ou repriorizada, esta página deve ser atualizada **junto** com a seção "Evolução do Projeto" do README, seguindo a Regra de Ouro de sincronia da documentação.
