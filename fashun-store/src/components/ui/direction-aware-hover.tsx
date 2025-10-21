"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: {
  imageUrl: string;
  children: React.ReactNode | string;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right" | string
  >("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!ref.current) return;

    const direction = getDirection(event, ref.current);
    switch (direction) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={cn(
        "group/card relative overflow-hidden rounded-lg bg-transparent h-96 w-full",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 h-full w-full",
          imageClassName
        )}
      >
        <img
          src={imageUrl}
          alt="background"
          className="h-full w-full object-cover"
        />
      </div>

      <motion.div
        className={cn(
          "absolute inset-0 z-10 flex items-end bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 py-6 transition duration-300 group-hover/card:opacity-100",
          childrenClassName
        )}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            x: direction === "left" ? -80 : direction === "right" ? 80 : 0,
            y: direction === "top" ? -80 : direction === "bottom" ? 80 : 0,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
