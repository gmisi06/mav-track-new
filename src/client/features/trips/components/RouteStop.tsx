import React from "react";
import styles from "./Route.module.css";
import clsx from "clsx";

const RouteStop = ({
  first = false,
  last = false,
}: {
  first: boolean;
  last: boolean;
}) => {
  return (
    <div className={styles.routeStopContainer}>
      <div
        className={clsx(
          styles.routeStopLine,
          first ? styles.first : last ? styles.last : styles.notFirstOrLast
        )}
      />
      <div className={styles.routeStop} />
    </div>
  );
};

export default React.memo(RouteStop);
