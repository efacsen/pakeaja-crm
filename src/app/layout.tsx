import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "PakeAja CRM - Complete Business Solution",
  description: "Complete CRM & ERP solution for modern businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                  document.documentElement.setAttribute('data-theme', 'dark')
                } else {
                  document.documentElement.classList.add('light')
                  document.documentElement.setAttribute('data-theme', 'light')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased transition-theme">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
} 