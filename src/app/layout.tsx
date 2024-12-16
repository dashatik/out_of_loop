import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientWrapper from "@/components/client-wrapper";
import PageRouter from "@/components/page-router";

export const metadata = {
  title: "AI Chat Application",
  description: "A modern AI chat interface built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-uniSans">
        <ClientWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="chat-theme"
          >
            <PageRouter>{children}</PageRouter>
          </ThemeProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}