import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://execgo.site"),
  title: {
    default: "ExecGo - AI Agent 任务执行内核与运行时生态",
    template: "%s | ExecGo",
  },
  description:
    "ExecGo 为通用 AI Agent 提供可验证、可取消、可审计的任务执行内核，并连接 execgo-runtime 数据面运行时。",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "ExecGo - AI Agent 任务执行内核与运行时生态",
    description:
      "ExecGo 为通用 AI Agent 提供可验证、可取消、可审计的任务执行内核，并连接 execgo-runtime 数据面运行时。",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "execgo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExecGo - AI Agent 任务执行内核与运行时生态",
    description:
      "ExecGo 为通用 AI Agent 提供可验证、可取消、可审计的任务执行内核，并连接 execgo-runtime 数据面运行时。",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
