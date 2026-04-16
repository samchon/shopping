import { cn } from "@/lib/utils";

export interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Navbar({ className, children }: NavbarProps) {
  return (
    <nav className={cn("flex items-center justify-between px-6 py-4", className)}>
      {children}
    </nav>
  );
}

export function NavbarBrand({ children }: { children: React.ReactNode }) {
  return <div className="text-2xl font-bold">{children}</div>;
}

export function NavbarMenu({ children }: { children: React.ReactNode }) {
  return <div className="flex space-x-4">{children}</div>;
}

export function NavbarItem({ children, href }: { children: React.ReactNode; href?: string }) {
  if (href) {
    return <a href={href} className="text-sm font-medium hover:underline">{children}</a>;
  }
  return <span className="text-sm font-medium">{children}</span>;
}

export function NavbarAuth({ children }: { children: React.ReactNode }) {
  return <div className="flex space-x-2">{children}</div>;
}
