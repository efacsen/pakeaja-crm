import type { Metadata } from "next";
import "./globals.css";
import "./emergency-styles.css";
import "./comprehensive-fallback.css";
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
        {/* Tailwind CSS CDN Fallback for Production */}
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css" rel="stylesheet" />
        
        {/* Inline Critical CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1f2937; background-color: #ffffff; }
            .dark body { color: #f9fafb; background-color: #0a0b0d; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .gap-4 { gap: 1rem; }
            .gap-6 { gap: 1.5rem; }
            .p-4 { padding: 1rem; }
            .p-6 { padding: 1.5rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-3xl { font-size: 1.875rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .text-primary { color: #3b82f6; }
            .bg-primary { background-color: #3b82f6; }
            .text-white { color: #ffffff; }
            .bg-white { background-color: #ffffff; }
            .border { border: 1px solid #e5e7eb; }
            .rounded { border-radius: 0.25rem; }
            .rounded-lg { border-radius: 0.5rem; }
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .w-64 { width: 16rem; }
            .h-screen { height: 100vh; }
            .overflow-auto { overflow: auto; }
            .flex-1 { flex: 1; }
            .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
            .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
            .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
            .bg-card { background-color: #ffffff; }
            .dark .bg-card { background-color: #13151a; }
            .border-r { border-right: 1px solid #e5e7eb; }
            .dark .border-r { border-right-color: #2d3139; }
            .text-muted-foreground { color: #6b7280; }
            .dark .text-muted-foreground { color: #9ca3af; }
            .hover\\:bg-accent:hover { background-color: #f3f4f6; }
            .dark .hover\\:bg-accent:hover { background-color: #1a1d23; }
            .btn { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
            .btn-primary { background-color: #3b82f6; color: white; }
            .btn-primary:hover { background-color: #2563eb; }
          `
        }} />
      </head>
      <body className="antialiased">
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