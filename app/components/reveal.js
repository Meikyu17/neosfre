"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.2, 1, 0.22, 1];

export default function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
