// Valida um destino de redirect vindo de fora do app (ex: parâmetro ?next=
// na URL), aceitando apenas caminhos internos da aplicação.
//
// Por quê: `new URL(valor, origin)` usa o origin apenas como *base* — se
// `valor` for uma URL absoluta ("https://site-malicioso.com"), protocolo-
// relativa ("//site-malicioso.com") ou iniciada por barra invertida
// ("/\site-malicioso.com", que o parser de URL dos navegadores normaliza
// para "//"), a base é ignorada e o redirect sai do nosso domínio. Essa
// falha, conhecida como Open Redirect, permite usar um link legítimo do
// nosso site como "trampolim confiável" para phishing.
export function caminhoInternoSeguro(valor: string | null): string {
  if (
    valor &&
    valor.startsWith("/") &&
    !valor.startsWith("//") &&
    !valor.startsWith("/\\")
  ) {
    return valor;
  }
  return "/";
}
