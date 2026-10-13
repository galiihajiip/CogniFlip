import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-12">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <Image
            src="/brand/cogniflip-logo.png"
            alt="CogniFlip"
            width={100}
            height={24}
            className="h-6 w-auto"
          />
          <span className="text-label-ui font-medium text-on-surface-variant">
            © 2026 CogniFlip. Ruang Eksplorasi &amp; Kreasi Kode Anak Bangsa.
          </span>
        </div>
        <nav
          aria-label="Tautan bantuan"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          <Link
            className="py-2 text-label-ui text-on-surface-variant hover:text-primary"
            href="/petunjuk"
          >
            Petunjuk FlipBot
          </Link>
          <Link
            className="py-2 text-label-ui text-on-surface-variant hover:text-primary"
            href="/panduan"
          >
            Panduan Guru &amp; Orang Tua
          </Link>
          <Link
            className="py-2 text-label-ui text-on-surface-variant hover:text-primary"
            href="/privasi"
          >
            Ruang Aman Anak
          </Link>
        </nav>
      </div>
    </footer>
  );
}
