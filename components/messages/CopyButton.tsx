"use client";

import { useState, useCallback } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CopyButtonProps {
  message: string;
  luckyNumbers?: number[];
  className?: string;
}

/**
 * CopyButton - Copy fortune message to clipboard with optional lucky numbers
 *
 * Features:
 * - Copy message only (default click)
 * - Dropdown to copy with lucky numbers
 * - Visual feedback with checkmark
 * - ARIA live region for screen reader announcement
 * - Keyboard accessible (Enter/Space)
 */
export function CopyButton({
  message,
  luckyNumbers,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [copiedWithLucky, setCopiedWithLucky] = useState(false);

  const handleCopyFeedback = useCallback((includeLucky: boolean) => {
    if (includeLucky) {
      setCopiedWithLucky(true);
      setCopied(false);
      setTimeout(() => setCopiedWithLucky(false), 2000);
      toast.success("Copied with lucky numbers");
      return;
    }

    setCopied(true);
    setCopiedWithLucky(false);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied message");
  }, []);

  const copyToClipboard = useCallback(
    async (includeLucky: boolean = false) => {
      let textToCopy = message;

      if (includeLucky && luckyNumbers && luckyNumbers.length > 0) {
        textToCopy = `${message}\n\nLucky Numbers: ${luckyNumbers.join(", ")}`;
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        handleCopyFeedback(includeLucky);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        handleCopyFeedback(includeLucky);
      }
    },
    [handleCopyFeedback, message, luckyNumbers]
  );

  const hasLuckyNumbers = luckyNumbers && luckyNumbers.length > 0;
  const isCopied = copied || copiedWithLucky;

  // Simple button if no lucky numbers
  if (!hasLuckyNumbers) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(false)}
          className={`h-8 w-8 p-0 text-[#555555] hover:text-[#FF6B3D] hover:bg-[#FFE4D6] focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2 ${className}`}
          aria-label={copied ? "Copied!" : "Copy message"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        {/* ARIA live region for screen reader announcement */}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {copied ? "Message copied to clipboard" : ""}
        </span>
      </>
    );
  }

  // Dropdown button if has lucky numbers
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 text-[#555555] hover:text-[#FF6B3D] hover:bg-[#FFE4D6] focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2 ${className}`}
            aria-label={isCopied ? "Copied!" : "Copy options"}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => copyToClipboard(false)}
            className="cursor-pointer focus:bg-[#FFE4D6] focus:text-[#E55328]"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy message
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyToClipboard(true)}
            className="cursor-pointer focus:bg-[#FFE4D6] focus:text-[#E55328]"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy with lucky numbers
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* ARIA live region for screen reader announcement */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copied
          ? "Message copied to clipboard"
          : copiedWithLucky
            ? "Message with lucky numbers copied to clipboard"
            : ""}
      </span>
    </>
  );
}
