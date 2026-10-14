import React from "react";
import styles from "./Route.module.css";

type RouteTimeParams = {
  scheduled: number;
  realtime: number;
};

const RouteTime = ({ scheduled, realtime }: RouteTimeParams) => {
  const formatSecondsToHHMM = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600) % 24;
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const isDelayed = realtime - scheduled >= 60;

  return (
    <b className={isDelayed ? styles.delayedTime : styles.onTime}>
      {isDelayed
        ? formatSecondsToHHMM(realtime)
        : formatSecondsToHHMM(scheduled)}
    </b>
  );
};

export default React.memo(RouteTime);
