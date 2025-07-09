import type { Metadata } from "next";
import "./globals.css";
import "./emergency-styles.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CSSGuard } from "@/components/CSSGuard";

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
        {/* CDN removed - using local Tailwind */}
        
        {/* Development CSP bypass */}
        {process.env.NODE_ENV === 'development' && (
          <meta 
            httpEquiv="Content-Security-Policy" 
            content="default-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://bemrgpgwaatizgxftzgg.supabase.co wss://bemrgpgwaatizgxftzgg.supabase.co https://api.vercel.com https://vitals.vercel-insights.com;" 
          />
        )}
        
        {/* Debug: Log what's trying to load Tailwind CDN */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Intercept and log any dynamic stylesheet additions
              const originalAppendChild = document.head.appendChild;
              const originalInsertBefore = document.head.insertBefore;
              
              // Block appendChild
              document.head.appendChild = function(element) {
                if (element.tagName === 'LINK' && element.href && element.href.includes('cdn')) {
                  console.error('BLOCKED CDN stylesheet via appendChild:', element.href);
                  console.trace('Stack trace for CDN load:');
                  return element; // Return element without adding it
                }
                return originalAppendChild.call(this, element);
              };
              
              // Block insertBefore
              document.head.insertBefore = function(element, reference) {
                if (element.tagName === 'LINK' && element.href && element.href.includes('cdn')) {
                  console.error('BLOCKED CDN stylesheet via insertBefore:', element.href);
                  console.trace('Stack trace for CDN load:');
                  return element; // Return element without adding it
                }
                return originalInsertBefore.call(this, element, reference);
              };
              
              // Also intercept createElement to see what's creating these links
              const originalCreateElement = document.createElement;
              document.createElement = function(tagName) {
                const element = originalCreateElement.call(document, tagName);
                if (tagName.toUpperCase() === 'LINK') {
                  // Add a setter to track href changes
                  let _href = '';
                  Object.defineProperty(element, 'href', {
                    get() { return _href; },
                    set(value) {
                      if (value && value.includes('cdn.jsdelivr.net') && value.includes('tailwind')) {
                        console.error('DETECTED: Trying to set Tailwind CDN href:', value);
                        console.trace('Stack trace:');
                      }
                      _href = value;
                    }
                  });
                }
                return element;
              };
              
              // Monitor DOM changes
              const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                  mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'LINK' && node.href?.includes('cdn')) {
                      console.error('CDN Link added to DOM:', node.href);
                      node.remove(); // Remove it immediately
                    }
                  });
                });
              });
              
              // Start observing when DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                  observer.observe(document.head, { childList: true });
                });
              } else {
                observer.observe(document.head, { childList: true });
              }
            `,
          }}
        />
        
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
        <CSSGuard />
        <ThemeProvider>
          <ErrorBoundary>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
} 