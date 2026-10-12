import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CogniFlip",
  description:
    "CogniFlip — platform belajar coding untuk anak SD: jelaskan, prediksi, dan perbaiki bersama teman AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
