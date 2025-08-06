"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ConfettiProps {
  className?: string;
  fireOnce?: boolean;
  particleCount?: number;
  particleSize?: number;
  colors?: string[];
  spread?: number;
  gravity?: number;
  duration?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  velocity: {
    x: number;
    y: number;
  };
}

export const Confetti = ({
  className,
  fireOnce = false,
  particleCount = 100,
  particleSize = 8,
  colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
  spread = 70,
  gravity = 0.7,
  duration = 3000,
}: ConfettiProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (fireOnce && fired) return;

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 3,
        size: Math.random() * particleSize + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * spread,
          y: (Math.random() * -spread) / 2,
        },
      });
    }

    setParticles(newParticles);
    if (fireOnce) setFired(true);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [fireOnce, fired, particleCount, particleSize, colors, spread, duration]);

  return (
    <div
      className={cn(
        "fixed inset-0 overflow-hidden z-50 pointer-events-none",
        className,
      )}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotation,
              opacity: 1,
            }}
            animate={{
              x: particle.x + particle.velocity.x * 50,
              y: particle.y + particle.velocity.y * 50 + gravity * 200,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: "50%",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;
