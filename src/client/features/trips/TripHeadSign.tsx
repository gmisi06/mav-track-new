import clsx from "clsx";
import RouteShortName from "./components/RouteShortName";
import styles from "./TripHeadSign.module.css";

type TripHeadSignParams = {
  trip: any;
  className?: string;
};

const TripHeadSign = ({ trip, className }: TripHeadSignParams) => {
  return (
    <div className={clsx(styles.headSign, className)}>
      <RouteShortName selectedTrip={trip} />
      <div>
        <b> {trip.tripShortName}</b>
        <span className="Arrows"> Q </span>
        {trip.tripHeadsign}
      </div>
    </div>
  );
};

export default TripHeadSign;
