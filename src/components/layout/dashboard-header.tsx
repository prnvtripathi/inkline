import Link from "next/link";
import { NavbarLogo } from "../ui/resizable-navbar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <NavbarLogo />
        <nav className="flex flex-1 items-center space-x-4">
          {/* Future nav items can go here */}
        </nav>
      </div>
    </header>
  );
}
