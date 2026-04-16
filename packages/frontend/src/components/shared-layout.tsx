import Link from "next/link";
import { Button } from "@/components/button";

export function SharedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Shopping Mall
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/products" className="hover:underline">
              Products
            </Link>
            <Link href="/cart" className="hover:underline">
              Cart
            </Link>
            <div className="flex gap-2">
              <a href="/login">
                <Button variant="outline">Login</Button>
              </a>
              <a href="/signup">
                <Button>Sign Up</Button>
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-zinc-500">
        <p>© 2024 Shopping Mall. All rights reserved.</p>
      </footer>
    </div>
  );
}
