import type { Metadata } from "next";
import "./globals.css";
import { BoardProvider } from '@/components/providers/BoardProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "Robust Kanban board application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <BoardProvider>
            {children}
          </BoardProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
