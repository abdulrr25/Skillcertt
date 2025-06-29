
"use client";

import { Toaster } from "@/components/ui/toaster"
import { ClientWalletProvider } from "@/context/client-wallet-provider";
import { CertificateProvider } from "@/context/certificate-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientWalletProvider>
      <CertificateProvider>
        {children}
        <Toaster />
      </CertificateProvider>
    </ClientWalletProvider>
  );
}
