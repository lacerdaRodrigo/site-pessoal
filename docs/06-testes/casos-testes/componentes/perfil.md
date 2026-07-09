# Casos de Teste (Componente) — Perfil e Tema

Casos de teste de componente da tela de Configurações/Perfil. Renderizam os componentes em memória (React Testing Library + jsdom), com Server Actions e hooks globais substituídos por mocks quando necessário. Código em `src/funcionalidades/perfil/apresentacao/{FormularioPerfil,SeletorDeTema}.test.tsx`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-64 — Formulário exibe e-mail somente leitura e nome inicial
- **Pré-condições:** `FormularioPerfil` recebe `nomeCompleto` e `email`.
- **Passos:** Renderizar o formulário.
- **Resultado esperado:** O campo de e-mail aparece preenchido e desabilitado; o campo "Nome de exibição" aparece com o valor inicial.

## CT-65 — Formulário exibe sucesso devolvido pela Server Action
- **Pré-condições:** A Server Action `atualizarPerfil` é mockada para devolver `{ erro: null, mensagem: "Perfil atualizado!" }`.
- **Passos:** Preencher o nome e clicar em "Salvar".
- **Resultado esperado:** A mensagem de sucesso aparece em um elemento com `role="status"`.

## CT-66 — Formulário exibe erro devolvido pela Server Action
- **Pré-condições:** A Server Action `atualizarPerfil` é mockada para devolver erro.
- **Passos:** Clicar em "Salvar".
- **Resultado esperado:** A mensagem de erro aparece em um elemento com `role="alert"`.

## CT-67 — Seletor de tema marca a opção atual
- **Pré-condições:** Hook `useTema` mockado para retornar `tema: "sistema"`.
- **Passos:** Renderizar `<SeletorDeTema />`.
- **Resultado esperado:** A opção "Sistema" aparece com `aria-checked="true"`.

## CT-68 — Seletor solicita troca de tema
- **Pré-condições:** Hook `useTema` mockado com `definirTema`.
- **Passos:** Clicar na opção "Escuro".
- **Resultado esperado:** `definirTema("escuro")` é chamado.

---

## Como rodar

```
npm run test
```

Não precisa de rede nem banco: Server Actions e hook de tema são mockados.
