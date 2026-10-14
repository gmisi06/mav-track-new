import React, { useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useDrag } from "@use-gesture/react";

export default function BottomSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const sheetHeight = window.innerHeight * 0.6;
  const closedY = sheetHeight - 50;

  const y = useMotionValue(closedY);
  const [isOpen, setIsOpen] = useState(false);
  const isDragging = useRef(false);

  const animateSheet = (open: boolean) => {
    animate(y, open ? 0 : closedY, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    setIsOpen(open);
  };

  const bind = useDrag(
    ({ down, movement: [, my], velocity: [, vy], direction: [, dy], last }) => {
      if (down) {
        isDragging.current = true;
        const newY = my + (isOpen ? 0 : closedY);
        y.set(Math.max(0, Math.min(newY, closedY)));
      }

      if (last) {
        const currentY = y.get();
        const shouldOpen = vy > 0.3 ? dy < 0 : currentY < closedY / 2;
        animateSheet(shouldOpen);
        isDragging.current = false;
      }
    },
    {
      from: () => [0, y.get()],
      bounds: { top: 0, bottom: closedY },
      axis: "y",
      rubberband: true,
    }
  );

  return (
    <motion.div className="bottom-sheet" style={{ y }}>
      <div
        className="bottom-sheet-header"
        {...bind()}
        onClick={() => {
          if (!isDragging.current) animateSheet(!isOpen);
        }}
      >
        <div className="drag-handle" />
      </div>

      <div className="bottom-sheet-content">
        {/* <TripInformation /> */}
        {children}
      </div>
    </motion.div>
  );
}
