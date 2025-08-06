import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBeamProps {
  className?: string;
  beamColor?: string;
  beamOpacity?: number;
  beamHeight?: number;
  beamWidth?: string;
  glowColor?: string;
  glowSpread?: number;
  glowOpacity?: number;
  speed?: number;
  direction?: "left-to-right" | "right-to-left";
}

const AnimatedBeam = ({
  className,
  beamColor = "#ffffff",
  beamOpacity = 0.2,
  beamHeight = 2,
  beamWidth = "100%",
  glowColor = "#4f8eff",
  glowSpread = 20,
  glowOpacity = 0.6,
  speed = 1.5,
  direction = "left-to-right",
}: AnimatedBeamProps) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    const beamElement = beamRef.current;
    if (beamElement) {
      resizeObserver.observe(beamElement);
      setContainerWidth(beamElement.offsetWidth);
    }

    return () => {
      if (beamElement) {
        resizeObserver.unobserve(beamElement);
      }
    };
  }, []);

  useEffect(() => {
    let animationId: number;
    let timestamp = Date.now();
    const animateBeam = () => {
      const now = Date.now();
      const delta = (now - timestamp) * 0.001; // Convert to seconds
      timestamp = now;

      // Update position based on direction
      if (direction === "left-to-right") {
        setPosition((prevPos) =>
          prevPos >= containerWidth ? 0 : prevPos + speed * 100 * delta,
        );
      } else {
        setPosition((prevPos) =>
          prevPos <= 0 ? containerWidth : prevPos - speed * 100 * delta,
        );
      }

      animationId = requestAnimationFrame(animateBeam);
    };

    if (containerWidth > 0) {
      animationId = requestAnimationFrame(animateBeam);
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [containerWidth, speed, direction]);

  return (
    <div
      ref={beamRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        height: beamHeight,
        width: beamWidth,
        backgroundColor: beamColor,
        opacity: beamOpacity,
      }}
    >
      {/* The moving glow effect */}
      <div
        className="absolute h-full"
        style={{
          left: `${position}px`,
          width: `${glowSpread}px`,
          backgroundImage: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />
    </div>
  );
};

export default AnimatedBeam;
