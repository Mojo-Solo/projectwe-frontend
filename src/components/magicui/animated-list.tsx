import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  items: {
    key: string;
    content: React.ReactNode;
  }[];
  className?: string;
  itemClassName?: string;
  stagger?: number;
  initialDelay?: number;
  animateFromSide?: "left" | "right" | "top" | "bottom" | "none";
  onItemClick?: (key: string) => void;
}

const AnimatedList = ({
  items,
  className,
  itemClassName,
  stagger = 0.05,
  initialDelay = 0.1,
  animateFromSide = "left",
  onItemClick,
}: AnimatedListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Define animation variants based on the chosen side
  const getVariants = () => {
    const distance = 20; // how far the items move in px

    switch (animateFromSide) {
      case "left":
        return {
          hidden: { x: -distance, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: distance, opacity: 0 },
        };
      case "right":
        return {
          hidden: { x: distance, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: -distance, opacity: 0 },
        };
      case "top":
        return {
          hidden: { y: -distance, opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: distance, opacity: 0 },
        };
      case "bottom":
        return {
          hidden: { y: distance, opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: -distance, opacity: 0 },
        };
      case "none":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const variants = getVariants();

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <AnimatePresence initial={true}>
        {items.map((item, index) => (
          <motion.div
            key={item.key}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.3,
              delay: initialDelay + index * stagger,
              ease: "easeOut",
            }}
            className={cn(
              "transition-all",
              itemClassName,
              onItemClick ? "cursor-pointer" : "",
            )}
            onClick={() => onItemClick?.(item.key)}
          >
            {item.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedList;
