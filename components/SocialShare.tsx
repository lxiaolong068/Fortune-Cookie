"use client";

import { useState } from "react";
import { Twitter, Facebook, Linkedin, Link2, Share2, Check } from "lucide-react";
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

  const shareUrl = url || (typeof window !== "undefined" ? window.location.origin : "");

  const formatShareText = () => {
    let text = `"${message}"`;
    if (luckyNumbers && luckyNumbers.length > 0) {
      text += `\n\nLucky Numbers: ${luckyNumbers.join(", ")}`;
    }
    text += `\n\n🥠 Fortune Cookie AI`;
    return text;
  };

  const shareText = formatShareText();

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
            className="h-8 w-8"
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
              className="h-8 w-8 hover:text-[#1DA1F2]"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              className="h-8 w-8"
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
        <Button
          variant="ghost"
          size="icon"
          onClick={shareToTwitter}
          className="h-8 w-8 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={shareToFacebook}
          className="h-8 w-8 hover:text-[#1877F2] hover:bg-[#1877F2]/10"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={shareToLinkedIn}
          className="h-8 w-8 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyLink}
          className="h-8 w-8"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
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
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shareToFacebook}
          className="gap-2 hover:text-[#1877F2] hover:border-[#1877F2]"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shareToLinkedIn}
          className="gap-2 hover:text-[#0A66C2] hover:border-[#0A66C2]"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
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
      </div>
    </div>
  );
}
