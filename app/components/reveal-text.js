"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.2, 1, 0.22, 1];

const tags = ["h1", "h2", "h3", "h4", "p", "blockquote", "span"];

export default function RevealText({ children, as = "div", className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  const Tag = tags.includes(as) ? motion[as] : motion.div;

  if (reduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <Tag
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0, y: 12 }}
      whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1.05, delay, ease }}
    >
      {children}
    </Tag>
  );
}
