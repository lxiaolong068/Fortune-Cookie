"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronUp, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  label: string;
}

interface FloatingNavProps {
  categories: Category[];
}

/**
 * FloatingNav - Floating navigation with Back to Top and Category TOC
 *
 * Features:
 * - Back to Top button (appears after 300px scroll)
 * - Collapsible category TOC with active section highlighting
 * - Intersection Observer for tracking active section
 * - Mobile-optimized with simplified controls
 * - Keyboard accessible
 */
export function FloatingNav({ categories }: FloatingNavProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Track scroll position for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section with Intersection Observer
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach((category) => {
      const element = document.getElementById(category.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(category.id);
              }
            });
          },
          {
            rootMargin: "-20% 0px -70% 0px", // Active when section is in upper portion of viewport
            threshold: 0,
          }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [categories]);

  // Scroll to top handler
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Scroll to section handler
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setShowTOC(false);
    }
  }, []);

  // Toggle TOC visibility
  const toggleTOC = useCallback(() => {
    setShowTOC((prev) => !prev);
  }, []);

  // Handle keyboard events for TOC toggle
  const handleTOCKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && showTOC) {
        setShowTOC(false);
      }
    },
    [showTOC]
  );

  // Don't render if we're at the top and have nothing to show
  if (!showBackToTop && !showTOC) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        onKeyDown={handleTOCKeyDown}
      >
        {/* TOC Toggle - always visible */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTOC}
          className="h-12 w-12 rounded-full bg-white shadow-lg border-[#FFD6C5] hover:bg-[#FFE4D6] hover:border-[#FF6B3D] focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2"
          aria-label="Open table of contents"
          aria-expanded={showTOC}
          aria-controls="floating-toc"
        >
          <List className="h-5 w-5 text-[#FF6B3D]" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      onKeyDown={handleTOCKeyDown}
    >
      {/* TOC Dropdown Panel */}
      {showTOC && (
        <div
          id="floating-toc"
          className="bg-white rounded-xl shadow-xl border border-[#FFE4D6] p-4 mb-2 w-64 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="navigation"
          aria-label="Category navigation"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#222222] text-sm">Categories</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTOC(false)}
              className="h-6 w-6 p-0 text-[#888888] hover:text-[#555555]"
              aria-label="Close table of contents"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-1" role="list">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => scrollToSection(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-1 ${
                    activeSection === category.id
                      ? "bg-[#FFE4D6] text-[#E55328] font-medium"
                      : "text-[#555555] hover:bg-[#F5F5F5] hover:text-[#222222]"
                  }`}
                  aria-current={activeSection === category.id ? "true" : undefined}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Button Row */}
      <div className="flex items-center gap-2">
        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="h-12 w-12 rounded-full bg-white shadow-lg border-[#FFD6C5] hover:bg-[#FFE4D6] hover:border-[#FF6B3D] focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5 text-[#FF6B3D]" />
          </Button>
        )}

        {/* TOC Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTOC}
          className={`h-12 w-12 rounded-full bg-white shadow-lg border-[#FFD6C5] hover:bg-[#FFE4D6] hover:border-[#FF6B3D] focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2 ${
            showTOC ? "bg-[#FFE4D6] border-[#FF6B3D]" : ""
          }`}
          aria-label={showTOC ? "Close table of contents" : "Open table of contents"}
          aria-expanded={showTOC}
          aria-controls="floating-toc"
        >
          {showTOC ? (
            <X className="h-5 w-5 text-[#FF6B3D]" />
          ) : (
            <List className="h-5 w-5 text-[#FF6B3D]" />
          )}
        </Button>
      </div>
    </div>
  );
}
