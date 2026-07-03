# Arquitetura — Visão Geral

## 1. O Modelo Cliente-Servidor
A arquitetura do **Knowledge Hub** será baseada no padrão clássico e mais utilizado no mercado: **Cliente-Servidor**. 

Para um Desenvolvedor ou QA entender facilmente, pense em um restaurante:
* **O Cliente (Frontend / Next.js):** É o seu garçom e o salão. O papel do Next.js é exclusivamente desenhar as telas bonitas, receber os cliques do usuário, pegar o texto que você digitou e "anotar o pedido". Ele **não** guarda os dados permanentemente. Ele usa o *Zustand* pra lembrar o que está acontecendo na tela naquele momento (ex: um modal está aberto) e o *TanStack Query* pra lembrar dos dados que já buscou no Supabase (com cache e atualização automática).
* **O Servidor (Backend / Supabase):** É a cozinha e o cofre. Fica na nuvem e é onde o trabalho pesado acontece. Quando o Next.js pede algo, o Supabase verifica se quem está pedindo tem a "senha" correta (Autenticação) e vai buscar ou salvar os documentos de forma definitiva no banco de dados (PostgreSQL).

> 💡 **Nota de Aprendizado (Mentoria):** diferente do Flutter Web (que só roda no navegador), o Next.js também consegue rodar um pedacinho de código **no servidor da Vercel**, antes de a página chegar no seu navegador (Server Components). Isso não quebra o modelo Cliente-Servidor acima — do ponto de vista do Supabase, o Next.js inteiro (rodando no navegador ou na Vercel) ainda é "o cliente". É só um detalhe a mais que vamos explorar com calma quando começarmos a escrever código de verdade.

## 2. Diagrama Macro da Arquitetura

O fluxo de dados acontece de forma bem direta:

```mermaid
graph TD
    A[Usuário] -->|Interage com a Tela| B(Next.js)
    B -->|Gerencia o que aparece na tela| B
    B -->|Pede os Dados (REST/SDK)| C(Supabase - Servidor)
    C -->|1. Verifica se está logado| D{Supabase Auth}
    C -->|2. Busca os Prompts| E[(Banco de Dados PostgreSQL)]
```

## 3. Separação de Responsabilidades
Como estamos focando em boas práticas (Clean Code / SOLID), nós vamos separar muito bem o que cada lado faz:
- **O Next.js NÃO manipula banco de dados:** Ele não faz queries complexas. Ele só manda o comando: *"Supabase, me dê os prompts do Rodrigo"*.
- **O Supabase NÃO sabe como o site é desenhado:** Ele não faz ideia se o botão do site é azul ou vermelho, ele só entrega e guarda informações (JSON).

**Por que isso é ensinado assim na Engenharia de Software?**
Porque se daqui a 1 ano você decidir criar a versão Mobile (Aplicativo Android/iOS) do Knowledge Hub, você **não vai precisar mexer em nenhuma linha do Backend**. O Supabase já está pronto servindo dados, você só vai criar telas novas no app para consumir esses mesmos dados!
