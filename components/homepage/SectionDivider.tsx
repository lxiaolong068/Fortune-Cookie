import { cn } from "@/lib/utils";

type DividerVariant = "wave" | "curve" | "zigzag";
type DividerPosition = "top" | "bottom";

interface SectionDividerProps {
  /** The variant of the divider shape */
  variant?: DividerVariant;
  /** Color of the divider (Tailwind fill class, e.g., "fill-white") */
  fillColor?: string;
  /** Position relative to the section */
  position?: DividerPosition;
  /** Additional className */
  className?: string;
  /** Height of the divider in pixels */
  height?: number;
}

/**
 * SectionDivider - Decorative SVG dividers between page sections
 *
 * Features:
 * - Multiple shape variants (wave, curve, zigzag)
 * - Configurable colors
 * - Top/bottom positioning with automatic flip
 * - Accessible (decorative, hidden from screen readers)
 */
export function SectionDivider({
  variant = "wave",
  fillColor = "fill-white",
  position = "bottom",
  className,
  height = 60,
}: SectionDividerProps) {
  const isFlipped = position === "top";

  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-[0]",
        isFlipped && "rotate-180",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className={cn("w-full block", fillColor)}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ height }}
      >
        {variant === "wave" && (
          <path d="M0,0 C150,100 350,0 500,50 C650,100 800,20 1000,80 C1100,100 1150,60 1200,80 L1200,120 L0,120 Z" />
        )}
        {variant === "curve" && (
          <path d="M0,60 Q300,120 600,60 T1200,60 L1200,120 L0,120 Z" />
        )}
        {variant === "zigzag" && (
          <path d="M0,40 L100,80 L200,40 L300,80 L400,40 L500,80 L600,40 L700,80 L800,40 L900,80 L1000,40 L1100,80 L1200,40 L1200,120 L0,120 Z" />
        )}
      </svg>
    </div>
  );
}

/**
 * Pre-configured divider variants for common use cases
 */
export function WaveDivider({
  className,
  ...props
}: Omit<SectionDividerProps, "variant">) {
  return <SectionDivider variant="wave" className={className} {...props} />;
}

export function CurveDivider({
  className,
  ...props
}: Omit<SectionDividerProps, "variant">) {
  return <SectionDivider variant="curve" className={className} {...props} />;
}

export function ZigzagDivider({
  className,
  ...props
}: Omit<SectionDividerProps, "variant">) {
  return <SectionDivider variant="zigzag" className={className} {...props} />;
}
