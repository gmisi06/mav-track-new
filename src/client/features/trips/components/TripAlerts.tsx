import styles from "./TripAlert.module.css";

const TripAlerts = ({ alerts }: { alerts: any[] }) => {
  const regexes = [
    /^A kerékpárszállító kocsi a vonat (.*?) kocsija\.$/,
    /^A kerékpárszállító kocsik a vonat (.*?) kocsijai\.$/,
    /^A kerékpárszállító a vonat (.*?) kocsija\.$/,
    /^A kerékpárszállító a vonat (.*?) kocsijai\.$/,
  ];

  const realAlerts: string[] = [];
  const bikes: string[] = [];

  alerts.forEach((alert: any) => {
    const match = regexes.find((r) =>
      r.test(alert.alertDescriptionText.trim())
    );
    match ? bikes.push(alert) : realAlerts.push(alert);
  });

  return (
    <>
      {realAlerts.length > 0 && (
        <div className="alerts">
          <div className={styles.alertTitle}>
            <span className="MNR2007">Ʈ</span> {realAlerts.length} db
            figyelmeztetés
          </div>
          {realAlerts.map((alert: any, index: number) => (
            <p key={index}>{alert.alertDescriptionText}</p>
          ))}
        </div>
      )}
      {bikes.length > 0 && (
        <div className={styles.bikesContainer}>
          <div className={styles.bikesTitle}>
            <span className="MNR2007">Õ</span>
            <b> Kerékpárszállító kocsi</b>
          </div>
          {bikes.map((message: any, index: number) => (
            <p key={index}>{message.alertDescriptionText}</p>
          ))}
        </div>
      )}
    </>
  );
};

export default TripAlerts;
