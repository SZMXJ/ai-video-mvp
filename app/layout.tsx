import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* ===== NAV BAR ===== */}
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-cyan-400">
              VideoAI
            </Link>

            {/* Nav Links */}
            <nav className="hidden gap-8 md:flex text-white/70">
              <Link href="/features" className="hover:text-white">
                Features
              </Link>
              <Link href="/models" className="hover:text-white">
                Models
              </Link>
              <Link href="/demo" className="hover:text-white">
                Demo
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </nav>

            {/* Right Actions */}
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

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}
