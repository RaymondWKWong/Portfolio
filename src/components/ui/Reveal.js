import React from "react";
import { motion } from "framer-motion";
import { fadeUp, viewport, reduceVariants } from "../../lib/motion";

function Reveal({ as = "div", variants = fadeUp, className, children, ...rest }) {
  const Tag = motion[as] || motion.div;
  const v = reduceVariants(variants);
  return (
    <Tag
      className={className}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
