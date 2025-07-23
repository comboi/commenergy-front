import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/app/platform/auth/contexts/auth-context';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
