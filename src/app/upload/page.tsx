"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import UploadClient from "@/components/upload-client";
import { CustomWalletButton } from "@/components/custom-wallet-button";

export default function UploadPage() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <div className="max-w-md">
          <h1 className="font-headline text-3xl font-bold">Connect your wallet</h1>
          <p className="mt-2 text-muted-foreground">
            Please connect your wallet to mint a new certificate.
          </p>
          <div className="mt-6">
            <CustomWalletButton />
          </div>
        </div>
      </div>
    );
  }

  return <UploadClient />;
}
