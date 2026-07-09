# Casos de Teste (Unitário) — Perfil e Tema

Casos de teste unitário da funcionalidade **Perfil e Configurações** (item da V1 "Perfil e Configurações — tema claro/escuro"). Testam as regras puras, sem depender de rede, banco ou navegador.

- **Perfil** (camada `dominio/`): validação/normalização do nome de exibição. Código em `src/funcionalidades/perfil/dominio/perfil.test.ts`.
- **Tema** (núcleo `nucleo/tema/`): validação e resolução do tema (claro/escuro/sistema). Código em `src/nucleo/tema/tema.test.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro. (Continuação da numeração global — os anteriores, `CT-35` a `CT-46`, são de Documentos.)

---

## Perfil — `nomeValido` e `normalizarNome`

O nome de exibição é **opcional** (a coluna `perfis.nome_completo` é nullable, sem `CHECK`). A regra aplicada na aplicação é só um teto de tamanho (120), para não guardar um nome absurdamente longo.

## CT-47 — Nome comum é aceito
- **Pré-condições:** Nenhuma (função pura).
- **Passos:** Chamar `nomeValido("Rodrigo Lacerda")`.
- **Resultado esperado:** Retorna `true`.

## CT-48 — Nome vazio é aceito (nome é opcional)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeValido("")`.
- **Resultado esperado:** Retorna `true` (a coluna é nullable — "sem nome" é permitido).

## CT-49 — Nome com exatamente 120 caracteres é aceito (fronteira)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeValido()` com um texto de exatamente 120 caracteres.
- **Resultado esperado:** Retorna `true` (120 é o limite máximo).

## CT-50 — Nome com 121 caracteres é rejeitado (fronteira)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeValido()` com um texto de 121 caracteres (um acima do limite).
- **Resultado esperado:** Retorna `false`.

## CT-51 — Normalização apara os espaços das pontas
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `normalizarNome("  Rodrigo  ")`.
- **Resultado esperado:** Retorna `"Rodrigo"`.

## CT-52 — Normalização converte vazio/só-espaços em null
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `normalizarNome("   ")` e `normalizarNome("")`.
- **Resultado esperado:** Retorna `null` nos dois casos (guardamos null, não string vazia).

---

## Tema — `temaValido` e `resolverTema`

## CT-53 — Os três temas conhecidos são válidos
- **Pré-condições:** Nenhuma (função pura).
- **Passos:** Chamar `temaValido()` com `"claro"`, `"escuro"` e `"sistema"`.
- **Resultado esperado:** Retorna `true` para os três.

## CT-54 — Valor desconhecido é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `temaValido()` com `"azul"`, `null` e `undefined` (ex.: lixo no localStorage).
- **Resultado esperado:** Retorna `false` (protege a leitura da preferência salva).

## CT-55 — "claro" resolve para claro, ignorando o SO
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `resolverTema("claro", true)` (SO prefere escuro).
- **Resultado esperado:** Retorna `"claro"` (a escolha explícita sobrepõe o SO).

## CT-56 — "escuro" resolve para escuro, ignorando o SO
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `resolverTema("escuro", false)` (SO prefere claro).
- **Resultado esperado:** Retorna `"escuro"`.

## CT-57 — "sistema" segue o SO (prefere escuro)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `resolverTema("sistema", true)`.
- **Resultado esperado:** Retorna `"escuro"`.

## CT-58 — "sistema" segue o SO (prefere claro)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `resolverTema("sistema", false)`.
- **Resultado esperado:** Retorna `"claro"`.

---

## Tema — `ProvedorDeTema` e `scriptAntiFlash`

## CT-59 — Provider usa o tema salvo no localStorage ao montar
- **Pré-condições:** `localStorage["kh-tema"] = "escuro"` e `matchMedia` mockado.
- **Passos:** Renderizar `<ProvedorDeTema>` com um componente de teste que lê `useTema()`.
- **Resultado esperado:** O tema atual vira `"escuro"` e o `<html>` recebe `data-tema="escuro"` / `data-tema-resolvido="escuro"`.

## CT-60 — Provider troca, aplica e persiste o tema
- **Pré-condições:** Provider montado em jsdom.
- **Passos:** Clicar no botão de teste que chama `definirTema("escuro")`.
- **Resultado esperado:** O estado muda para `"escuro"`, o `localStorage` é atualizado e o `<html>` recebe `data-tema-resolvido="escuro"`.

## CT-61 — Modo sistema acompanha troca da preferência do SO
- **Pré-condições:** Provider em modo `"sistema"` e `matchMedia` mockado.
- **Passos:** Simular mudança do sistema de claro para escuro.
- **Resultado esperado:** O `<html>` troca `data-tema-resolvido` de `"claro"` para `"escuro"`.

## CT-62 — Script anti-flash aplica o tema salvo antes da hidratação
- **Pré-condições:** `localStorage["kh-tema"] = "escuro"`.
- **Passos:** Executar a string `scriptAntiFlash` em jsdom.
- **Resultado esperado:** O `<html>` recebe `data-tema="escuro"`, `data-tema-resolvido="escuro"` e `color-scheme: dark`.

## CT-63 — Script anti-flash ignora valor inválido salvo
- **Pré-condições:** `localStorage["kh-tema"] = "azul"` e sistema preferindo escuro.
- **Passos:** Executar a string `scriptAntiFlash`.
- **Resultado esperado:** O tema volta para `"sistema"` e resolve para `"escuro"`.

---

## Como rodar

```
npm run test
```

Não precisa de nada além do ambiente já configurado (regras puras, sem rede).
