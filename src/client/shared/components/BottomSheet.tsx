import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { useDispatch } from "react-redux";
import { setPanelOpen } from "../../store/slices/panelSlice";

type SnapState = "peek" | "half" | "full";

// Ennyi látszik a lapból összecsukva: a fogantyú és egy kis sáv.
const PEEK_HEIGHT = 56;
// Félig nyitva a képernyő ekkora része látszik; a térkép felül még használható.
const HALF_VISIBLE_RATIO = 0.6;
// A húzás lendületét ennyi ms-nyi továbbmozgásként vesszük figyelembe.
const PROJECTION_MS = 200;

const useViewportHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    // Mobilon a címsor be- és kicsúszása is átméretezésnek számít.
    const update = () => setHeight(window.innerHeight);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return height;
};

export default function BottomSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const reducedMotion = useReducedMotion();
  const viewportHeight = useViewportHeight();

  // A lap tetejének függőleges eltolása; 0 = teljesen felhúzva.
  const snapY: Record<SnapState, number> = {
    full: 0,
    half: viewportHeight * (1 - HALF_VISIBLE_RATIO),
    peek: viewportHeight - PEEK_HEIGHT,
  };

  const [snap, setSnap] = useState<SnapState>("peek");
  const y = useMotionValue(snapY.peek);
  const contentRef = useRef<HTMLDivElement>(null);

  const moveTo = (next: SnapState) => {
    setSnap(next);
    dispatch(setPanelOpen(next !== "peek"));
  };

  // Az állapotváltáskor és átméretezéskor a lap a megfelelő magasságra ugrik.
  useEffect(() => {
    animate(
      y,
      snapY[snap],
      reducedMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 300, damping: 32 }
    );
    // Összecsukáskor a tartalom tetejéről induljon, ha újra kinyitják.
    if (snap !== "full") contentRef.current?.scrollTo({ top: 0 });
  }, [snap, viewportHeight]);

  // Az alsó lap eltűnésekor (pl. desktop nézetre váltáskor) ne maradjon "nyitott" állapot.
  useEffect(() => () => void dispatch(setPanelOpen(false)), [dispatch]);

  const nearestSnap = (position: number): SnapState =>
    (Object.keys(snapY) as SnapState[]).reduce((best, candidate) =>
      Math.abs(snapY[candidate] - position) < Math.abs(snapY[best] - position)
        ? candidate
        : best
    );

  const toggle = () =>
    moveTo(snap === "peek" ? "half" : snap === "half" ? "peek" : "half");

  const bind = useDrag(
    ({
      event,
      last,
      tap,
      offset: [, offsetY],
      velocity: [, vy],
      direction: [, dy],
    }) => {
      if (tap) {
        // Csak a fogantyú érintése vált állapotot, a tartalom elemeié nem.
        const onHeader = (event.target as HTMLElement).closest(
          ".bottom-sheet-header"
        );
        if (last && onHeader) toggle();
        return;
      }
      y.set(offsetY);

      if (last) {
        // A lendületet előre vetítjük, így egy gyors pöccintés a következő állapotra visz.
        moveTo(nearestSnap(offsetY + dy * vy * PROJECTION_MS));
      }
    },
    {
      from: () => [0, y.get()],
      bounds: { top: snapY.full, bottom: snapY.peek },
      axis: "y",
      rubberband: true,
      filterTaps: false,
      threshold: 6,
      pointer: { touch: true },
    }
  );

  return (
    <motion.div
      className={`bottom-sheet ${snap === "full" ? "full" : ""}`}
      style={{ y }}
    >
      <div
        className="bottom-sheet-header"
        role="button"
        tabIndex={0}
        aria-label={snap === "peek" ? "Információk megnyitása" : "Információk"}
        aria-expanded={snap !== "peek"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          } else if (e.key === "ArrowUp") {
            moveTo(snap === "peek" ? "half" : "full");
          } else if (e.key === "ArrowDown") {
            moveTo(snap === "full" ? "half" : "peek");
          }
        }}
        {...bind()}
      >
        <div className="drag-handle" />
      </div>

      {/* Teljesen felhúzva görgethető; egyébként a tartalom húzása is a lapot mozgatja. */}
      <div
        ref={contentRef}
        {...(snap === "full" ? {} : bind())}
        className={`bottom-sheet-content ${snap === "full" ? "scrollable" : ""}`}
      >
        {children}
      </div>
    </motion.div>
  );
}
