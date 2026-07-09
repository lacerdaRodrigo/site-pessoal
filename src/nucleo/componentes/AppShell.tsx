"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sair } from "@/funcionalidades/autenticacao/dados/acoes";
import { SeletorDeTema } from "@/funcionalidades/perfil/apresentacao/SeletorDeTema";
import estilos from "./appShell.module.css";

// Casca da área autenticada: sidebar fixa no desktop e, abaixo de 768px, uma
// gaveta (drawer) que desliza sobre o conteúdo por um botão ☰ (RNF02.3). A
// guarda de sessão fica no layout (Server Component); aqui só mora a UI e o
// estado de abrir/fechar a gaveta. Recebe o e-mail já resolvido no servidor.
const ITENS_NAV = [
  { href: "/inicio", rotulo: "Início" },
  { href: "/documentos", rotulo: "Documentos" },
  { href: "/configuracoes", rotulo: "Configurações" },
];

export function AppShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const [aberta, setAberta] = useState(false);
  const caminho = usePathname();

  const fechar = () => setAberta(false);

  // Fecha a gaveta com a tecla Esc (padrão de acessibilidade para overlays).
  useEffect(() => {
    if (!aberta) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberta]);

  // Um link/rota é "ativo" se o caminho atual começa por ele (cobre subrotas,
  // ex: /documentos/123 destaca "Documentos").
  const ehAtivo = (href: string) =>
    caminho === href || caminho.startsWith(`${href}/`);

  return (
    <div className={estilos.shell}>
      {/* Barra superior só no mobile: abre a gaveta. */}
      <div className={estilos.barraMobile}>
        <button
          type="button"
          className={estilos.botaoMenu}
          aria-label="Abrir menu"
          aria-expanded={aberta}
          aria-controls="menu-lateral"
          onClick={() => setAberta(true)}
        >
          ☰
        </button>
        <Link href="/inicio" className={estilos.marca} onClick={fechar}>
          <span className={estilos.logo}>K</span>
          <span>Knowledge Hub</span>
        </Link>
      </div>

      {/* Overlay escurecido: aparece só com a gaveta aberta (mobile). */}
      {aberta && (
        <button
          type="button"
          className={estilos.overlay}
          aria-label="Fechar menu"
          onClick={fechar}
        />
      )}

      <aside
        id="menu-lateral"
        className={`${estilos.sidebar} ${aberta ? estilos.sidebarAberta : ""}`}
        aria-label="Navegação principal"
      >
        <Link href="/inicio" className={estilos.marca} onClick={fechar}>
          <span className={estilos.logo}>K</span>
          <span>Knowledge Hub</span>
        </Link>

        <Link
          href="/documentos/novo"
          className={estilos.botaoNovo}
          onClick={fechar}
        >
          + Novo documento
        </Link>

        <nav className={estilos.nav}>
          {ITENS_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={fechar}
              aria-current={ehAtivo(item.href) ? "page" : undefined}
              className={`${estilos.navLink} ${
                ehAtivo(item.href) ? estilos.navLinkAtivo : ""
              }`}
            >
              {item.rotulo}
            </Link>
          ))}
        </nav>

        <div className={estilos.rodape}>
          <SeletorDeTema />
          {email && <span className={estilos.email}>{email}</span>}
          <form action={sair}>
            <button type="submit" className={estilos.botaoSair}>
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className={estilos.area}>
        <main className={estilos.conteudo}>{children}</main>
      </div>
    </div>
  );
}
