import React from "react";
import styles from "./Vehicle.module.css";

type MapOverlayProps = {
  children: React.ReactNode;
};
const MapOverlay = ({ children }: MapOverlayProps) => {
  return (
    <div className={styles.mapOverlayContainer}>
      <span className={styles.mapOverlayContent}>{children}</span>
    </div>
  );
};

export default MapOverlay;
