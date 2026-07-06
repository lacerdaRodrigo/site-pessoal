import estilos from "@/funcionalidades/autenticacao/apresentacao/formulario.module.css";

export default function PaginaEmailConfirmado() {
  return (
    <div className={estilos.pagina}>
      <div className={estilos.cartao}>
        <div className={estilos.logo}>K</div>
        <p className={estilos.sucesso}>E-mail confirmado! Sua conta já está ativa.</p>
        <p className={estilos.linkSecundario}>
          <a href="/login">Entrar agora</a>
        </p>
      </div>
    </div>
  );
}
