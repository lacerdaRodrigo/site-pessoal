const TAMANHO_MINIMO_SENHA = 8;

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function senhaValida(senha: string): boolean {
  return senha.length >= TAMANHO_MINIMO_SENHA;
}
