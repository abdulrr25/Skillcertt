"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award } from "lucide-react";
import { CustomWalletButton } from "./custom-wallet-button";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              SkillCert
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {pathname !== "/" && <CustomWalletButton />}
          </nav>
        </div>
      </div>
    </header>
  );
}
