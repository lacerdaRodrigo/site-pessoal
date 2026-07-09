import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ProvedorDeTema } from "@/nucleo/tema/ProvedorDeTema";
import { scriptAntiFlash } from "@/nucleo/tema/scriptAntiFlash";
import "./globals.css";

const inter = Inter({
  variable: "--fonte-ui",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--fonte-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knowledge Hub",
  description: "Base de conhecimento pessoal — prompts, guias e anotações técnicas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Aplica o tema salvo antes da primeira pintura (evita flash). */}
        <script dangerouslySetInnerHTML={{ __html: scriptAntiFlash }} />
        <ProvedorDeTema>{children}</ProvedorDeTema>
      </body>
    </html>
  );
}
