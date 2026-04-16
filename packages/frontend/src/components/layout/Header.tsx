"use client";

import Link from "next/link";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const { isAuthenticated, customer, logout } = useAuthContext();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Shopping Mall
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/sales" className="text-sm font-medium hover:underline">
            Products
          </Link>
          <Link href="/orders" className="text-sm font-medium hover:underline">
            Orders
          </Link>
          <Link href="/cart" className="text-sm font-medium hover:underline">
            Cart
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {customer?.member ? 'Member' : customer?.citizen?.mobile || 'User'}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
