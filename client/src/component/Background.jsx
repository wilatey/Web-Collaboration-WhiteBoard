// import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background";

export function Background() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className=" relative flex flex-col gap-4 items-center justify-center px-4">
        </motion.div>
    </AuroraBackground>
  );
}

export default Background;
