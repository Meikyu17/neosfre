"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.2, 1, 0.22, 1];

export default function SectionLine() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <motion.div
      className="section-line"
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.4, ease }}
    />
  );
}
