import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import RouteLine from "./components/RouteLine";
import RouteTime from "./components/RouteTime";
import RouteStop from "./components/RouteStop";
import TripAlerts from "./components/TripAlerts";
import TripFeatures from "./components/TripFeatures";
import TripHeadSign from "./TripHeadSign";
import React, { useEffect, useMemo } from "react";
import { useGetTripQuery } from "./api/tripsApiSlice";
import { getLastPassedIndex } from "./vehicleProgress";
import { setPolyline } from "../../store/slices/polylineSlice";
import styles from "./TripInformation.module.css";
import tripHeadSignStyles from "./TripHeadSign.module.css";

const TripInformation = () => {
  const dispatch = useDispatch();

  const selectedTripId = useSelector(
    (state: RootState) => state.selectedTripId.tripId
  );

  const { data: selectedTrip, isError } = useGetTripQuery(selectedTripId!, {
    skip: !selectedTripId,
    refetchOnMountOrArgChange: true,
    pollingInterval: 60_000,
    skipPollingIfUnfocused: true,
  });

  const processedStoptimes = useMemo(() => {
    if (!selectedTrip || !selectedTrip.stoptimes || !selectedTrip.nextStop)
      return [];

    const vehicleIndex = getLastPassedIndex(
      selectedTrip.stoptimes,
      selectedTrip.nextStop
    );

    return selectedTrip.stoptimes.map(
      (stoptime: any, index: any, arr: any[]) => {
        const isFirst = index === 0;
        const isLast = index === arr.length - 1;
        const isVehicle = index === vehicleIndex;
        // Amelyik megállót a vonat már elhagyta (a vonat jelzése után van a következő).
        const isPassed = vehicleIndex >= 0 && index <= vehicleIndex;

        return {
          ...stoptime,
          isFirst,
          isLast,
          isVehicle,
          isPassed,
        };
      }
    );
  }, [selectedTrip]);

  useEffect(() => {
    if (selectedTrip?.polyline) {
      dispatch(setPolyline(selectedTrip.polyline));
    }
  }, [dispatch, selectedTrip?.polyline]);

  if (!selectedTripId || !selectedTrip)
    return (
      <div className={styles.content}>
        <span className={styles.notSelected}>
          {selectedTripId && isError
            ? "A járat adatai nem érhetők el."
            : "Válasszon egy járatot!"}
        </span>
      </div>
    );

  const formatSecondsToHHMM = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600) % 24;
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  if (selectedTrip) {
    return (
      <div className={styles.content}>
        <TripHeadSign
          trip={selectedTrip}
          className={tripHeadSignStyles.detailed}
        />
        {selectedTrip.alerts && selectedTrip.alerts.length !== 0 && (
          <TripAlerts alerts={selectedTrip.alerts} />
        )}
        <TripFeatures trip={selectedTrip} />
        {selectedTrip.delay > 0 && (
          <div className={styles.delay}>
            <b>Késés: </b>
            {selectedTrip.delay / 60} perc
          </div>
        )}
        <table>
          <thead>
            <tr>
              <th className={styles.arrivalTitle}>Érkezés</th>
              <th className={styles.lineTitle}></th>
              <th className={styles.departureTitle}>Indulás</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processedStoptimes.map((stoptime: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td className={styles.arrivalRealtime}>
                      {!stoptime.isFirst &&
                        stoptime.realtimeArrival !==
                          stoptime.scheduledArrival &&
                        formatSecondsToHHMM(stoptime.scheduledArrival)}
                    </td>
                    <td className={styles.lineRealtime}>
                      {!stoptime.isFirst && <RouteLine />}
                    </td>
                    <td className={styles.departureRealtime}>
                      {!stoptime.isLast &&
                        stoptime.realtimeDeparture !==
                          stoptime.scheduledDeparture &&
                        formatSecondsToHHMM(stoptime.scheduledDeparture)}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className={styles.arrivalTime}>
                      {!stoptime.isFirst && (
                        <RouteTime
                          scheduled={stoptime.scheduledArrival}
                          realtime={stoptime.realtimeArrival}
                        />
                      )}
                    </td>
                    <td className={styles.departureTime}>
                      <RouteStop
                        first={stoptime.isFirst}
                        last={stoptime.isLast}
                        passed={stoptime.isPassed}
                      />
                    </td>
                    <td>
                      {!stoptime.isLast && (
                        <RouteTime
                          scheduled={stoptime.scheduledDeparture}
                          realtime={stoptime.realtimeDeparture}
                        />
                      )}
                    </td>
                    <td>
                      <b>{stoptime.stop.name}</b>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className={styles.lineDetails}>
                      {!stoptime.isLast && (
                        <RouteLine isVehicle={stoptime.isVehicle} />
                      )}
                    </td>
                    <td colSpan={2}>
                      <div className={styles.departureDetails}>
                        <div>Vágány: {stoptime.stop.platformCode}</div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {selectedTrip.infoServices && (
          <>
            <h2>Szolgáltatások</h2>
            <table className={styles.services}>
              <tbody>
                {[...selectedTrip.infoServices]
                  .sort((a: any, b: any) => a.font.localeCompare(b.font))
                  .map((infoService: any, index: number) => (
                    <tr className="SourceSans3" key={index}>
                      <td className={"MNR2007 " + styles.serviceIcon}>
                        {infoService.font}
                      </td>
                      <td>
                        <div>{infoService.name}</div>
                        {!(
                          infoService.fromStop.name ===
                            selectedTrip.stoptimes[0].stop.name &&
                          infoService.tillStop.name ===
                            selectedTrip.stoptimes[
                              selectedTrip.stoptimes.length - 1
                            ].stop.name
                        ) && (
                          <div className={styles.serviceStops}>
                            <i>
                              {infoService.fromStop.name}
                              {infoService.fromStop.name !==
                                infoService.tillStop.name &&
                                " - " + infoService.tillStop.name}
                            </i>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}

        {selectedTrip.vehicleType && (
          <>
            <h2>Információk</h2>
            <div className={styles.services}>
              <b>Jármű típusa: </b>
              {selectedTrip.vehicleType}
            </div>
          </>
        )}
      </div>
    );
  }
};

export default TripInformation;
