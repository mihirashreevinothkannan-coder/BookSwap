import { motion } from "framer-motion";

// Subtle fade + rise. Wrap page content or list items.
// Pass `delay` to stagger items.
export default function FadeIn({ children, delay = 0, y = 14, className, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
