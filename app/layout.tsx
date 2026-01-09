import "./globals.css";
import Link from "next/link";
import { UserProvider } from "./context/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <UserProvider>
          {/* NAV */}
          <header className="border-b border-white/10">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-bold text-cyan-400">
                VideoAI
              </Link>

              <nav className="hidden md:flex gap-8 text-white/70">
                <Link href="/features">Features</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/create">Create</Link>
              </nav>

              <div className="flex gap-4">
                <Link href="/login">Login</Link>
                <Link
                  href="/create"
                  className="rounded-full bg-cyan-400 px-4 py-2 text-black"
                >
                  Create Video
                </Link>
              </div>
            </div>
          </header>

          {children}
        </UserProvider>
      </body>
    </html>
  );
}
