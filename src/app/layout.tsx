import type { Metadata } from "next";
import "./globals.css";

const description =
  "CogniFlip — platform belajar coding untuk anak SD: jelaskan, prediksi, dan perbaiki bersama teman AI.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL ?? "http://localhost:3000"),
  title: { default: "CogniFlip", template: "%s · CogniFlip" },
  description,
  applicationName: "CogniFlip",
  openGraph: {
    title: "CogniFlip — Flip the Way You Learn",
    description,
    locale: "id_ID",
    type: "website",
    siteName: "CogniFlip",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
