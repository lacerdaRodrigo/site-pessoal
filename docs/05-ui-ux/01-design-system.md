# UI/UX — Sistema de Design (Design System)

Como esta ferramenta é focada em produtividade para um Desenvolvedor/QA, a interface não pode cansar a vista e precisa passar uma sensação de ambiente profissional e tecnológico.

Sendo assim, o Tech Lead (Mentoria) definiu o seguinte Sistema de Design para a aplicação:

## 1. Tema Geral e Cores
O sistema será construído com suporte a temas dinâmicos, contendo um botão (toggle) na interface para o usuário alternar livremente entre o **Modo Escuro (Dark Mode)** e o **Modo Claro (Light Mode)**.

* **Modo Escuro (Foco):** Fundo quase preto puro. Evita o cansaço visual.
* **Modo Claro:** Fundo branco quebrado/gelo para não "cegar" os olhos, com textos em grafite.
* **Cor Primária (Destaque nos dois temas):** **Roxo Neon / Violeta**. É uma cor vibrante que remete à inovação e funciona maravilhosamente bem tanto no escuro quanto no claro.
* **Bordas e Linhas:** Extremamente finas (1 pixel), mudando de tom automaticamente dependendo do tema escolhido, para separar o conteúdo de forma bem sutil.

> 💡 Os valores exatos (hex por token, cor de cada categoria) já foram extraídos do protótipo aprovado e estão consolidados em `docs/05-ui-ux/02-tokens-visuais.md` — este documento aqui explica o "porquê" da escolha; aquele é a fonte única de verdade para os números que vão virar código.

## 2. Tipografia (Fontes)
Para dar um aspecto premium e de "ferramenta de trabalho", usaremos duas fontes gratuitas do Google Fonts:

* **Textos, Menus e Títulos:** Fonte **"Inter"**. É a fonte mais utilizada pelas maiores startups do mundo hoje. Ela é limpa, arredondada na medida certa e extremamente legível.
* **Leitura de Código e Prompts:** Fonte **"JetBrains Mono"**. Como você salvará muito conteúdo técnico, a área onde o prompt/código fica salvo terá essa fonte quadrada de programador. Fica lindo e profissional. (Tamanhos e pesos exatos por contexto de uso estão em `02-tokens-visuais.md`.)

## 3. Estilo Visual e Componentes (Minimalista Flat)
Adotaremos a vertente **Minimalista Flat**:
* **Sem excesso de desfoque:** Não usaremos fundos borrados ou vidros (*glassmorphism*) pesados. Tudo será sólido e direto.
* **Cards e Painéis:** Os blocos onde os textos ficam terão o fundo levemente mais claro que o fundo geral, com bordas levemente arredondadas (valores exatos em `02-tokens-visuais.md`).
* **Micro-interações:** Os botões não precisam ser enormes. O charme estará no *Hover* (quando você passar o mouse por cima do botão de "Copiar", ele brilha suavemente em Roxo Neon).

## 4. O "Sentimento" da Interface
O objetivo final de UX (Experiência do Usuário) é que, ao abrir o **Knowledge Hub**, você sinta que está usando uma ferramenta paga e cara. A interface não deve "gritar" por atenção, ela deve sair do caminho para que o seu Prompt seja a verdadeira estrela da tela.

## 5. Documentos Relacionados

Este documento explica a intenção de design. Para a implementação em código, use:
- `02-tokens-visuais.md` — valores exatos de cor, tipografia, espaçamento, raio e sombra, prontos para virar `lib/nucleo/tema/`.
- `03-telas-e-componentes.md` — mapa de cada tela e componente reutilizável do protótipo, ligado à estrutura Feature-First.
