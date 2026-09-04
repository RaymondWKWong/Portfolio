import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, viewport } from "../../lib/motion";

function Reveal({
  as = "div",
  variants = fadeUp,
  className,
  children,
  ...rest
}) {
  const Tag = motion[as] || motion.div;
  const reduce = useReducedMotion();
  return (
    <Tag
      className={className}
      variants={variants}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
