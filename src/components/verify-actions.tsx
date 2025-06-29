"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Share2 } from "lucide-react";

export default function VerifyActions({ certificateId }: { certificateId: string }) {
  const { toast } = useToast();
  const [shareableLink, setShareableLink] = useState("");

  useEffect(() => {
    // This ensures the URL is generated on the client side, avoiding SSR mismatches.
    setShareableLink(`${window.location.origin}/verify/${certificateId}`);
  }, [certificateId]);

  const copyToClipboard = () => {
    if (!shareableLink) return;
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share your certificate link.",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="transition-transform hover:scale-105"><Share2 className="mr-2"/> Share</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Share Certificate</h4>
              <p className="text-sm text-muted-foreground">
                Anyone with this link can view the certificate.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Input value={shareableLink} readOnly className="h-9 font-code text-xs" />
              <Button type="button" size="icon" className="h-9 w-9 flex-shrink-0" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* The button is wrapped in a span to allow the tooltip to work when disabled */}
            <span tabIndex={0}>
              <Button variant="outline" className="transition-transform hover:scale-105 w-full" disabled>
                <Download className="mr-2"/> Download
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download feature coming soon!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
