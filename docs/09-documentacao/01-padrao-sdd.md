# Documentação — Padrão SDD e Regras de Escrita

Este documento explica **como** a documentação do projeto é escrita e mantida — é a "documentação da documentação".

## 1. O Que é SDD (Software Design Document)

SDD é um formato de documentação técnica focado em registrar **decisões e o raciocínio por trás delas**, não só o estado final do sistema. Diferente de um manual de usuário, o SDD é escrito para quem vai *manter e evoluir* o sistema (no caso deste projeto, o próprio Rodrigo, no futuro, ou qualquer pessoa que vier a colaborar).

Cada documento dentro de `docs/` deve responder a uma pergunta clara e ter responsabilidade única — por isso a estrutura é modular (um arquivo por assunto) em vez de um único documento gigante.

## 2. Regras de Ouro (também registradas no README)

1. **Sincronia obrigatória:** qualquer decisão técnica nova, mudança estrutural ou mudança de plano deve ser refletida imediatamente no documento correspondente **e** no `README.md`. O README é o índice/resumo; os documentos em `docs/` são a fonte detalhada.
2. **Idioma:** Português (PT-BR) em toda a documentação, pastas e nomes de estrutura, para maximizar o aprendizado.

## 3. Convenções de Escrita Adotadas

- **Numeração de arquivos:** cada módulo (`00-`, `01-`, `02-`...) tem arquivos numerados internamente (`01-`, `02-`...) na ordem em que devem ser lidos.
- **Callouts de aprendizado:** trechos marcados com `> 💡 **Nota de Aprendizado (Mentoria):**` são explicações extras, voltadas a ensinar um conceito de engenharia de software, não apenas descrever uma decisão do projeto.
- **Diagramas:** sempre que possível, usar blocos ` ```mermaid ` para diagramas (arquitetura, ERD) em vez de imagens, para que o diagrama fique versionado como texto no Git.
- **ADRs para decisões técnicas:** decisões de arquitetura com alternativas descartadas seguem o formato Contexto/Decisão/Consequências (ver `docs/01-arquitetura/06-decisoes-tecnicas.md` como referência de formato).

## 4. Checklist ao Criar ou Alterar um Documento

- [ ] O documento responde a uma única pergunta clara (não mistura assuntos de módulos diferentes)?
- [ ] O README foi atualizado (tabela de status dos módulos, e "Decisões Tomadas" se aplicável)?
- [ ] Pontos em aberto foram marcados explicitamente (não deixar ambiguidade silenciosa)?
- [ ] Se a decisão afeta outro módulo já escrito, aquele documento foi revisado também?

## 5. Por Que Isso Importa Para o Aprendizado

Manter esse padrão é, em si, um exercício de engenharia de software: times profissionais gastam tempo real documentando decisões (ADRs, RFCs, Design Docs) exatamente para evitar retrabalho e perda de contexto. Praticar isso aqui, mesmo em um projeto solo, constrói o hábito.
