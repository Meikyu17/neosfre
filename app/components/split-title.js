"use client";

import { motion, useReducedMotion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.038, delayChildren: 0.05 },
  },
};

const charVariants = {
  hidden: { y: "115%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.72, ease: [0.2, 1, 0.22, 1] },
  },
};

export default function SplitTitle({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  const text = String(children);

  if (reduceMotion) {
    return <h1 className={className}>{children}</h1>;
  }

  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      aria-label={text}
      style={{ lineHeight: "inherit" }}
      transition={{ delayChildren: delay }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", lineHeight: "inherit" }}
        >
          <motion.span variants={charVariants} style={{ display: "inline-block" }}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}
