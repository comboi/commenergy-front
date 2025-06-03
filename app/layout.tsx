import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/contexts/auth-context';
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
          <QueryProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="flex w-full h-screen">
                  <Sidebar />
                  <main className="flex-1 w-full overflow-y-auto px-8 relative max-h-100vh">
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
