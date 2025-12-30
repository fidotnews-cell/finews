import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ArticleInteractionProvider } from "@/context/ArticleInteractionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fi.News - AI Driven Financial News",
  description: "Automated financial, crypto, and web3 news aggregator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F0F2F5] dark:bg-[#0b0f12] min-h-screen text-gray-900 dark:text-[#eaeaea]`}
      >
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" 
            enableSystem={false}
            disableTransitionOnChange
          >
            <ArticleInteractionProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 min-w-0">
                  {children}
                </div>
              </div>
            </ArticleInteractionProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
