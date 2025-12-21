"use client";

import { useState } from "react";
import {
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Share2,
  Check,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  message: string;
  url?: string;
  luckyNumbers?: number[];
  className?: string;
  variant?: "default" | "compact" | "inline";
}

export function SocialShare({
  message,
  url,
  luckyNumbers,
  className,
  variant = "default",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const formatShareText = () => {
    let text = `"${message}"`;
    if (luckyNumbers && luckyNumbers.length > 0) {
      text += `\n\nLucky Numbers: ${luckyNumbers.join(", ")}`;
    }
    text += `\n\n🥠 Fortune Cookie AI`;
    return text;
  };

  const shareText = formatShareText();

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i += 1) {
      const word = words[i];
      const testLine = `${currentLine} ${word}`;
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Fortune from Fortune Cookie AI",
          text: shareText,
          url: shareUrl,
        });
        toast.success("Fortune shared successfully!");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Native share failed:", error);
        toast.error("Failed to share");
      }
    }
  };

  const handleDownloadImage = () => {
    if (typeof document === "undefined") return;
    try {
      const canvas = document.createElement("canvas");
      const width = 1200;
      const height = 630;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Download unavailable");
        return;
      }

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#FEF3C7");
      gradient.addColorStop(1, "#FDE68A");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      drawRoundedRect(ctx, 80, 80, width - 160, height - 160, 36);
      ctx.fill();

      ctx.fillStyle = "#92400E";
      ctx.font = "italic 48px Georgia, serif";
      const messageLines = wrapText(ctx, message, width - 260);
      const lineHeight = 58;
      let textY = 200;
      messageLines.slice(0, 6).forEach((line) => {
        ctx.fillText(line, 140, textY);
        textY += lineHeight;
      });

      if (luckyNumbers && luckyNumbers.length > 0) {
        ctx.font = "28px Arial, sans-serif";
        ctx.fillStyle = "#B45309";
        ctx.fillText(
          `Lucky Numbers: ${luckyNumbers.join(", ")}`,
          140,
          height - 170,
        );
      }

      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillStyle = "#92400E";
      ctx.fillText("Fortune Cookie AI", 140, height - 120);

      const link = document.createElement("a");
      link.download = "fortune-cookie.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  const handleCopyLink = async () => {
    try {
      const copyText = `${shareText}\n\n${shareUrl}`;
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy");
    }
  };

  const shareToTwitter = () => {
    const tweetText = encodeURIComponent(`${shareText}`);
    const tweetUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  };

  const shareToFacebook = () => {
    const fbUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${fbUrl}&quote=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {hasNativeShare ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNativeShare}
            className="h-11 w-11 min-h-[44px] min-w-[44px]"
            aria-label="Share fortune"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={shareToTwitter}
              className="h-11 w-11 min-h-[44px] min-w-[44px] hover:text-[#1DA1F2]"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              className="h-11 w-11 min-h-[44px] min-w-[44px]"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="text-sm text-muted-foreground">Share:</span>
        {hasNativeShare && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNativeShare}
            className="h-11 w-11 min-h-[44px] min-w-[44px]"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={shareToTwitter}
          className="h-11 w-11 min-h-[44px] min-w-[44px] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={shareToFacebook}
          className="h-11 w-11 min-h-[44px] min-w-[44px] hover:text-[#1877F2] hover:bg-[#1877F2]/10"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={shareToLinkedIn}
          className="h-11 w-11 min-h-[44px] min-w-[44px] hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyLink}
          className="h-11 w-11 min-h-[44px] min-w-[44px]"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadImage}
          className="h-11 w-11 min-h-[44px] min-w-[44px]"
          aria-label="Download as image"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Default variant - full buttons
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-medium text-muted-foreground">Share your fortune</p>
      <div className="flex flex-wrap gap-2">
        {hasNativeShare && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="gap-2"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={shareToTwitter}
          className="gap-2 hover:text-[#1DA1F2] hover:border-[#1DA1F2]"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shareToFacebook}
          className="gap-2 hover:text-[#1877F2] hover:border-[#1877F2]"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shareToLinkedIn}
          className="gap-2 hover:text-[#0A66C2] hover:border-[#0A66C2]"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
          aria-label="Copy share text"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadImage}
          className="gap-2"
          aria-label="Download as image"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
