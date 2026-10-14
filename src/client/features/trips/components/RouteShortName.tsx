import styles from "./Route.module.css";

const RouteShortName = ({ selectedTrip }: { selectedTrip: any }) => {
  return (
    <div
      className={"MNR2007 " + styles.routeShortNameContainer}
      style={{ color: `#${selectedTrip.route.textColor}` }}
    >
      <div className={styles.routeShortNameText}>
        {selectedTrip.routeShortName}
      </div>
      <div
        className={styles.routeShortNameBackground}
        style={{
          backgroundColor: `#${selectedTrip.route.color}`,
        }}
      ></div>
    </div>
  );
};

export default RouteShortName;
