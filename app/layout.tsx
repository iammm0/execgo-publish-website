import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "execgo 发布网站",
    template: "%s | execgo 发布网站",
  },
  description:
    "围绕 execgo 的稳定主线与集群预览线搭建的发布网站，展示分支能力、静态文档快照、代码模块、接口和发布信息。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full scroll-smooth">
      <body className="min-h-full">
        <div className="site-bg" />
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
