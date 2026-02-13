"use client";

import { useState, useCallback } from "react";
import {
  Twitter,
  Facebook,
  Link2,
  Check,
  Download,
  Share2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface FortuneShareCardProps {
  message: string;
  luckyNumbers: number[];
  className?: string;
}

/**
 * FortuneShareCard - A visually prominent share card that appears after fortune generation
 *
 * Features:
 * - Visual preview card with fortune message and lucky numbers
 * - Canvas-based image generation for download (no external deps)
 * - Twitter/X share with pre-filled text
 * - Native share API support on mobile
 * - Copy to clipboard
 */
export function FortuneShareCard({
  message,
  luckyNumbers,
  className,
}: FortuneShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.origin + "/generator"
      : "https://fortunecookieai.com/generator";

  const shareText = `🥠 My fortune cookie says: "${message}"\n\nLucky Numbers: ${luckyNumbers.join(", ")}\n\nGet your fortune →`;

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const wrapText = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number,
    ): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = words[0] || "";

      for (let i = 1; i < words.length; i++) {
        const word = words[i] || "";
        if (!word) continue;
        const testLine = `${currentLine} ${word}`;
        if (ctx.measureText(testLine).width > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    },
    [],
  );

  const drawRoundedRect = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    },
    [],
  );

  const handleDownloadImage = useCallback(async () => {
    if (typeof document === "undefined") return;
    setIsGeneratingImage(true);

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

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#FEF3C7");
      gradient.addColorStop(0.5, "#FDE68A");
      gradient.addColorStop(1, "#FBBF24");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Decorative dots
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random() * 8 + 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // White card
      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      drawRoundedRect(ctx, 60, 60, width - 120, height - 120, 32);
      ctx.fill();

      // Card shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 4;

      // Cookie emoji
      ctx.font = "64px serif";
      ctx.textAlign = "center";
      ctx.fillText("🥠", width / 2, 140);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Fortune message
      ctx.fillStyle = "#78350F";
      ctx.font = 'italic 36px Georgia, "Times New Roman", serif';
      ctx.textAlign = "center";
      const messageLines = wrapText(ctx, `"${message}"`, width - 220);
      let textY = 210;
      const lineHeight = 50;
      messageLines.slice(0, 5).forEach((line) => {
        ctx.fillText(line, width / 2, textY);
        textY += lineHeight;
      });

      // Lucky numbers
      const numbersY = Math.max(textY + 30, height - 200);
      ctx.font = "bold 22px Arial, sans-serif";
      ctx.fillStyle = "#B45309";
      ctx.fillText(
        `Lucky Numbers: ${luckyNumbers.join(" · ")}`,
        width / 2,
        numbersY,
      );

      // Branding
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillStyle = "#92400E";
      ctx.fillText("fortunecookieai.com", width / 2, height - 90);

      // Download
      const link = document.createElement("a");
      link.download = "my-fortune-cookie.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Fortune image saved!");
    } catch {
      toast.error("Failed to create image");
    } finally {
      setIsGeneratingImage(false);
    }
  }, [message, luckyNumbers, wrapText, drawRoundedRect]);

  const handleShareToTwitter = useCallback(() => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420",
    );
  }, [shareText, shareUrl]);

  const handleShareToFacebook = useCallback(() => {
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420",
    );
  }, [shareText, shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: "My Fortune Cookie",
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }
  }, [shareText, shareUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [shareText, shareUrl]);

  return (
    <div className={cn("w-full", className)}>
      {/* Share CTA Header */}
      <div className="text-center mb-4">
        <p className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
          Share Your Fortune
        </p>
      </div>

      {/* Visual Share Card Preview */}
      <div className="relative mx-auto max-w-sm mb-5">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-2xl p-6 text-center shadow-lg border border-amber-200/50">
          <div className="text-3xl mb-3">🥠</div>
          <p className="text-base font-serif text-amber-900 italic leading-relaxed mb-3">
            &ldquo;{message}&rdquo;
          </p>
          <div className="flex justify-center gap-1.5 flex-wrap mb-3">
            {luckyNumbers.map((num) => (
              <span
                key={num}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-800 text-xs font-bold"
              >
                {num}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-amber-500 font-medium">
            fortunecookieai.com
          </p>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {hasNativeShare && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="gap-2 border-amber-300 text-amber-800 hover:bg-amber-50"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareToTwitter}
          className="gap-2 hover:text-[#1DA1F2] hover:border-[#1DA1F2]"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareToFacebook}
          className="gap-2 hover:text-[#1877F2] hover:border-[#1877F2]"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadImage}
          disabled={isGeneratingImage}
          className="gap-2 hover:text-emerald-600 hover:border-emerald-600"
        >
          {isGeneratingImage ? (
            <ImageIcon className="h-4 w-4 animate-pulse" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Save Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
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
