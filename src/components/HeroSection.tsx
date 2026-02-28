import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface HeroSectionProps {
  onSearchFocus: () => void;
}

const FloatingOrb = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: string }) => (
  <motion.div
    className="absolute rounded-full bg-primary/10 blur-3xl"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

export function HeroSection({ onSearchFocus }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb delay={0} x="10%" y="20%" size="300px" />
        <FloatingOrb delay={2} x="70%" y="10%" size="200px" />
        <FloatingOrb delay={4} x="50%" y="60%" size="250px" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            Research Paper Search Engine
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6">
            <span className="text-foreground">Discover </span>
            <span className="glow-text">Research</span>
            <br />
            <span className="text-foreground">That Matters</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Search across thousands of academic papers with advanced filtering, 
            full-text search, and relevance scoring.
          </p>

          <motion.button
            onClick={onSearchFocus}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Search className="w-5 h-5" />
            Start Searching
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
