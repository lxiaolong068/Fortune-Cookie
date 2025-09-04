"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { createSeededRandom } from "@/lib/utils";
import { useEffect, useState } from "react";
import { StaticBackground } from "./StaticBackground";

export function BackgroundEffects() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkMotionPreference = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    const checkDataSaver = () => {
      // Check for data saver mode
      const connection = (navigator as any).connection;
      if (connection) {
        setSaveData(connection.saveData || false);
      }
    };

    const checkVisibility = () => {
      // Use Intersection Observer to detect when component is visible
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some(entry => entry.isIntersecting)) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(document.body);
      return () => observer.disconnect();
    };

    checkMobile();
    checkMotionPreference();
    checkDataSaver();
    const cleanupVisibility = checkVisibility();

    // Use requestIdleCallback to defer animation initialization
    const idleCallback = typeof window.requestIdleCallback === 'function' ?
      window.requestIdleCallback(() => {
        setCanAnimate(true);
      }) :
      setTimeout(() => {
        setCanAnimate(true);
      }, 100);

    window.addEventListener('resize', checkMobile);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', checkMotionPreference);

    return () => {
      window.removeEventListener('resize', checkMobile);
      motionQuery.removeEventListener('change', checkMotionPreference);
      cleanupVisibility();
      if (typeof window.requestIdleCallback === 'function') {
        window.cancelIdleCallback(idleCallback as number);
      } else {
        clearTimeout(idleCallback as number);
      }
    };
  }, []);

  // Return static background if animations should be disabled
  if (prefersReducedMotion || saveData || !isVisible || !canAnimate) {
    return <StaticBackground />;
  }

  // Reduce animation count on mobile for better performance
  // Further reduce for data saver mode
  const sparkleCount = isMobile ? (saveData ? 3 : 6) : (saveData ? 6 : 12);
  const particleCount = isMobile ? (saveData ? 4 : 8) : (saveData ? 10 : 20);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(254, 215, 170, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(254, 215, 170, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 60%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(254, 215, 170, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0"
      />
      
      {/* Floating ambient sparkles */}
      {[...Array(sparkleCount)].map((_, i) => {
        const rng = createSeededRandom(i);
        const initialX = rng.range(0, 1200);
        const initialY = rng.range(0, 800);
        const x1 = rng.range(0, 1200);
        const x2 = rng.range(0, 1200);
        const x3 = rng.range(0, 1200);
        const y1 = rng.range(0, 800);
        const y2 = rng.range(0, 800);
        const y3 = rng.range(0, 800);
        const scale = rng.range(0.3, 0.8);
        const opacity = rng.range(0.2, 0.8);
        const duration = rng.range(15, 25);
        const size = rng.int(2, 5); // 2-4

        return (
          <motion.div
            key={i}
            initial={{
              x: initialX,
              y: initialY,
              scale: 0,
              opacity: 0
            }}
            animate={{
              x: [initialX, x1, x2, x3],
              y: [initialY, y1, y2, y3],
              scale: [0, scale, 0],
              opacity: [0, opacity, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            className="absolute will-change-transform"
            style={{ willChange: 'transform, opacity' }}
          >
            <Sparkles className={`w-${size} h-${size} text-amber-300/40`} />
          </motion.div>
        );
      })}
      
      {/* Floating light particles */}
      {[...Array(particleCount)].map((_, i) => {
        const rng = createSeededRandom(i + 100); // 偏移种子避免与星星重复
        const initialX = rng.range(0, 1200);
        const endX = rng.range(0, 1200) + rng.range(-100, 100);
        const scale = rng.range(0.2, 1.0);
        const opacity = rng.range(0.1, 0.5);
        const duration = rng.range(12, 20);

        return (
          <motion.div
            key={`particle-${i}`}
            initial={{
              x: initialX,
              y: 850,
              scale: 0
            }}
            animate={{
              x: [initialX, endX],
              y: [850, -50],
              scale: [0, scale, 0],
              opacity: [0, opacity, 0]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.8
            }}
            className="absolute w-1 h-1 bg-amber-300/60 rounded-full blur-sm will-change-transform"
            style={{ willChange: 'transform, opacity' }}
          />
        );
      })}
      
      {/* Subtle light rays */}
      <motion.div
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-200/20 via-amber-200/10 to-transparent rounded-full blur-3xl"
      />
    </div>
  );
}