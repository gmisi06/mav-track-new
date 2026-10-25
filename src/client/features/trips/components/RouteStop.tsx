import React from "react";
import styles from "./Route.module.css";
import clsx from "clsx";

const RouteStop = ({
  first = false,
  last = false,
  passed = false,
}: {
  first: boolean;
  last: boolean;
  /** A vonat már elhagyta a megállót. */
  passed?: boolean;
}) => {
  return (
    <div className={styles.routeStopContainer}>
      <div
        className={clsx(
          styles.routeStopLine,
          first ? styles.first : last ? styles.last : styles.notFirstOrLast
        )}
      />
      <div className={clsx(styles.routeStop, passed && styles.passed)} />
    </div>
  );
};

export default React.memo(RouteStop);
