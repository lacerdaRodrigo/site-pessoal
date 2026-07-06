import estilos from "@/funcionalidades/autenticacao/apresentacao/formulario.module.css";

export default function PaginaEmailConfirmado() {
  return (
    <div className={estilos.pagina}>
      <p className={estilos.sucesso}>
        E-mail confirmado! Sua conta já está ativa.
        <br />
        <a href="/login">Entrar agora</a>
      </p>
    </div>
  );
}
