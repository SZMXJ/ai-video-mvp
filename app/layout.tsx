import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="text-xl font-semibold text-cyan-400">
              VideoAI
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
              <Link href="/features" className="hover:text-white">Features</Link>
              <Link href="/models" className="hover:text-white">Models</Link>
              <Link href="/gallery" className="hover:text-white">Gallery</Link>
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/create"
                className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-medium text-black hover:bg-cyan-300 transition"
              >
                Create Video
              </Link>
            </div>

          </div>
        </header>

        {/* PAGE */}
        <main>{children}</main>
      </body>
    </html>
  );
}
