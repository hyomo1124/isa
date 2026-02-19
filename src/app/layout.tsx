import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "든든 ISA",
  description: "ISA 리밸런싱 + 절세혜택 데모",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "든든ISA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body style={{ margin: 0, background: "#F5F6F8" }}>{children}</body>
    </html>
  );
}
