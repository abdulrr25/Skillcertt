"use client";

import { useState, useEffect } from "react";
import { Loader2, ShieldCheck, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type VerificationStatus = "verifying" | "verified" | "failed";

export default function VerifyClient() {
  const [status, setStatus] = useState<VerificationStatus>("verifying");

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate a successful verification from Chainlink Functions
      setStatus("verified"); 
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {status === "verifying" && (
        <div className="flex items-center space-x-2 text-muted-foreground p-4 bg-muted/50 rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="font-medium">Verifying on-chain data with Chainlink...</span>
        </div>
      )}
      {status === "verified" && (
        <Alert className="border-accent/50 text-accent [&>svg]:text-accent">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle className="font-bold">Certificate Verified</AlertTitle>
          <AlertDescription className="text-accent/80">
            This certificate's authenticity has been confirmed on the Solana blockchain via Chainlink.
          </AlertDescription>
        </Alert>
      )}
       {status === "failed" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>
            We could not verify the authenticity of this certificate.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
