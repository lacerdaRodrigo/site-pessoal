# Arquitetura — Requisitos Funcionais (RF)

Os Requisitos Funcionais descrevem todas as ações que o sistema deve permitir que o usuário realize (O que o sistema faz). Eles formam a base para o desenvolvimento das telas e chamadas ao backend.

## RF01 — Gestão de Conta e Autenticação
* **RF01.1:** O sistema deve permitir que o usuário crie uma conta fornecendo e-mail e senha.
  * **RF01.1.1 (Política de senha):** senha com **mínimo de 8 caracteres**. Sem exigência de complexidade arbitrária (símbolo/maiúscula obrigatórios) — comprimento mínimo é a barreira que importa (referência: recomendações atuais de NIST sobre autenticação).
  * **RF01.1.2 (Confirmação de e-mail):** obrigatória antes do primeiro login (comportamento padrão do Supabase Auth, mantido intencionalmente — ver `docs/04-backend/01-supabase-e-seguranca.md`).
* **RF01.2:** O sistema deve permitir que o usuário faça o login com e-mail e senha.
* **RF01.3:** O sistema deve permitir que o usuário faça o logout (encerrar sessão).
* **RF01.4:** O sistema deve fornecer uma opção de "Esqueci minha senha" (recuperação de acesso por email).

## RF02 — Gestão de Documentos (Prompts, Comandos, Queries)
* **RF02.1:** O sistema deve permitir a criação (Create) de um novo documento.
* **RF02.2:** O sistema deve permitir a visualização/leitura (Read) completa do documento salvo.
* **RF02.3:** O sistema deve permitir a edição (Update) do conteúdo e do título do documento.
* **RF02.4:** O sistema deve permitir a exclusão (Delete) do documento, mediante um aviso de confirmação.
* **RF02.5:** O sistema deve conter um botão de cópia rápida ("Copiar para a área de transferência") dentro da visualização do documento.
  * **RF02.5.1:** O botão deve copiar **apenas o conteúdo do(s) bloco(s) de código** do documento (o prompt/snippet em si), não o Markdown inteiro (títulos, explicações, etc.).
  * **RF02.5.2:** Se o documento não tiver nenhum bloco de código, o botão deve copiar o texto completo do documento (fallback).
  * **RF02.5.3:** Ao copiar, o sistema deve exibir uma confirmação visual temporária (ex: "Prompt copiado!") por cerca de 1,6s, retornando ao estado normal em seguida.

## RF03 — Organização e Busca
*(Nota: Baseado na necessidade de ser ágil e rápido, sugerimos as funcionalidades abaixo para evitar a perda de prompts antigos)*
* **RF03.1:** O sistema deve permitir atrelar os documentos a **Categorias** maiores (ex: Banco de Dados, IAs, Git).
* **RF03.2:** O sistema deve disponibilizar uma **Busca Global** na tela inicial, para achar documentos pelo nome digitando.
* **RF03.3:** O sistema deve permitir marcar documentos como **Favoritos** ("Estrelinha"), os quais aparecerão em uma lista de acesso rápido.
