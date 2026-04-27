import React from "react";
import { motion } from "framer-motion";
import { hairlineDraw, viewport, reduceVariants } from "../../lib/motion";

function Hairline({ className, color = "var(--rule)" }) {
  return (
    <motion.div
      className={className}
      style={{
        height: 1,
        background: color,
        transformOrigin: "left center",
        width: "100%",
      }}
      variants={reduceVariants(hairlineDraw)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    />
  );
}

export default Hairline;
