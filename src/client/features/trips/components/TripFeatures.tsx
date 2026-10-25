import {
  accessibilityFeature,
  bikeFeature,
  occupancyLabel,
  reservationRows,
} from "../tripFeatures";
import styles from "./TripFeatures.module.css";

type Coach = {
  attachedFromStop?: { name?: string };
  attachedTillStop?: { name?: string };
  trip?: { tripShortName?: string; tripHeadsign?: string };
};

const coachTitle = (coach: Coach) => {
  const { tripShortName, tripHeadsign } = coach.trip ?? {};
  return tripShortName ?? tripHeadsign ?? "";
};

const CoachList = ({ title, coaches }: { title: string; coaches: Coach[] }) => (
  <div className={styles.group}>
    <div className={styles.groupTitle}>{title}</div>
    <ul>
      {coaches.map((coach, index) => (
        <li key={index}>
          <b>{coachTitle(coach)}</b>
          {coach.attachedFromStop?.name && coach.attachedTillStop?.name && (
            <span className={styles.stops}>
              {" "}
              ({coach.attachedFromStop.name} – {coach.attachedTillStop.name})
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const TripFeatures = ({ trip }: { trip: any }) => {
  const badges = [
    accessibilityFeature(trip.wheelchairAccessible),
    bikeFeature(trip.bikesAllowed),
  ].filter((feature) => feature !== null);
  const occupancy = occupancyLabel(trip.occupancy?.occupancyStatus);
  const reservations = reservationRows(trip.availableComfortLevels);
  const throughCoaches: Coach[] = trip.throughCoaches ?? [];
  const pullingTrips: Coach[] = trip.pullingTrips ?? [];

  if (
    !badges.length &&
    !occupancy &&
    !reservations.length &&
    !throughCoaches.length &&
    !pullingTrips.length
  )
    return null;

  return (
    <div className={styles.container}>
      {(badges.length > 0 || occupancy) && (
        <div className={styles.badges}>
          {badges.map((feature) => (
            <span key={feature.key} className={styles.badge}>
              <span aria-hidden="true">{feature.icon}</span> {feature.label}
            </span>
          ))}
          {occupancy && (
            <span className={styles.badge}>
              <span aria-hidden="true">👥</span> Kihasználtság: {occupancy}
            </span>
          )}
        </div>
      )}
      {reservations.length > 0 && (
        <div className={styles.group}>
          <div className={styles.groupTitle}>Helyjegy</div>
          <ul>
            {reservations.map((row, index) => (
              <li key={index}>
                {row.name}:{" "}
                <b>
                  {row.reservation === "MANDATORY"
                    ? "helyjegyköteles"
                    : "helyjegy váltható"}
                </b>
                {row.from && row.till && row.from !== row.till && (
                  <span className={styles.stops}>
                    {" "}
                    ({row.from} – {row.till})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {throughCoaches.length > 0 && (
        <CoachList title="Átmenő kocsik" coaches={throughCoaches} />
      )}
      {pullingTrips.length > 0 && (
        <CoachList title="Vontatott vonatok" coaches={pullingTrips} />
      )}
    </div>
  );
};

export default TripFeatures;
