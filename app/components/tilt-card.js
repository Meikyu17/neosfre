"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export default function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 180,
    damping: 28,
  });
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [4, -4]), {
    stiffness: 180,
    damping: 28,
  });
  const glareX = useTransform(rawX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(rawY, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    glareOpacity.set(0.06);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    glareOpacity.set(0);
  };

  if (reduceMotion) {
    return <article className={className}>{children}</article>;
  }

  return (
    <motion.article
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.14), transparent 65%)`,
          opacity: glareOpacity,
        }}
      />
    </motion.article>
  );
}
