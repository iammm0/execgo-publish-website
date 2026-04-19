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
    "围绕 execgo 仓库主线与集群预览线搭建的完整发布网站，展示分支能力、代码模块、文档入口、接口面与发布信息。",
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
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
