import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "../components/ToastProvider";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Ứng dụng quản lý công việc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}