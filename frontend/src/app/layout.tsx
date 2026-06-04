import type { Metadata } from "next";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Список добрых дел",
  description: "Приложение для ведения списка добрых дел",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <Header/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
