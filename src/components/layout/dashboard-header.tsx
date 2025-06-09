import Link from "next/link";
import { NavbarLogo } from "../ui/resizable-navbar";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <NavbarLogo />
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Future nav items can go here */}
        </nav>
      </div>
    </header>
  );
}
