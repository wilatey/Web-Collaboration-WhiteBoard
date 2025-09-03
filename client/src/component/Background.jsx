import { motion } from "motion/react";

export default function Background() {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  );
}
