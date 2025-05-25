import '@/styles/globals.css';
import { Inter } from 'next/font/google';

import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/contexts/auth-context';
import { QueryProvider } from '@/providers/query-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="flex w-full h-screen">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto p-8 relative max-h-100vh">
                    {children}
                  </main>
                  <Toaster />
                </div>
              </SidebarProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
