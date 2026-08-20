"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Scroll-triggered fade-in. Content must never be *permanently* invisible, so
 * the animation is treated as an enhancement: reduced-motion users get the
 * content immediately, and a safety timer reveals anything the viewport
 * observer never fired for (background tabs, restored scroll positions).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={forceVisible ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
}
