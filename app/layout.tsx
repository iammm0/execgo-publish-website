import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://execgo.site"),
  title: {
    default: "execgo",
    template: "%s | execgo",
  },
  description:
    "execgo 控制面与 execgo-runtime 数据面运行时的文档与分支索引。",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "execgo",
    description: "execgo 控制面与 execgo-runtime 数据面运行时的文档与分支索引。",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "execgo" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
