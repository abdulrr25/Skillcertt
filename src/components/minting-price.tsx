"use client";

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2 } from 'lucide-react';

const MINT_PRICE_USD = 3; // $3 fixed price

export default function MintingPrice() {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching the live SOL/USD price from a source like Chainlink Price Feeds.
    // In a real app, you would use an API call here.
    const fetchPrice = () => {
      setIsLoading(true);
      setTimeout(() => {
        // Using a static price for prototype, but simulating fluctuation.
        const mockSolPrice = 142.50 + (Math.random() - 0.5); 
        setSolPrice(mockSolPrice);
        setIsLoading(false);
      }, 1500); // Simulate network delay
    };

    fetchPrice();
  }, []);

  const mintingCostSol = solPrice ? (MINT_PRICE_USD / solPrice).toFixed(5) : null;

  return (
    <Alert className="border-primary/30 bg-primary/5">
      <Info className="h-4 w-4 text-primary" />
      <AlertTitle>Minting Cost</AlertTitle>
      <AlertDescription>
        {isLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Fetching live SOL/USD price...</span>
          </div>
        )}
        {!isLoading && solPrice && (
          <span>
            A small network fee is required. Current cost: 
            <span className="font-semibold text-foreground"> ${MINT_PRICE_USD.toFixed(2)} USD</span> / 
            <span className="font-semibold text-foreground"> ~{mintingCostSol} SOL</span>.
          </span>
        )}
         {!isLoading && !solPrice && (
          <span>
            Could not fetch live price. A small network fee will apply.
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}
