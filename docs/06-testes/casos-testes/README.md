# Casos de Teste

Casos de teste em Markdown, um arquivo por funcionalidade dentro de cada subpasta — separados por **tipo de teste**, para não misturar a escrita de níveis diferentes da pirâmide (ver `docs/06-testes/01-estrategia-de-testes.md`):

- `unitarios/` — funções isoladas da camada `dominio/`, sem rede/navegador.
- `componentes/` — telas React renderizadas em memória, Server Action mockada.
- `e2e/` — jornada completa num navegador real, contra o deploy da Vercel.

Cada caso tem um ID (`CT-XX`) único **no projeto inteiro** (não reinicia por pasta), usado também no nome do teste automatizado correspondente (`it("CT-XX: ...")` / `test("CT-XX: ...")`), para rastrear a documentação e o código nos dois sentidos.
