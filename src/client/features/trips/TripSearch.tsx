import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useState, type ChangeEvent } from "react";
import TripHeadSign from "./TripHeadSign";
import { setSelectedTripId } from "./store/selectedTripIdSlice";
import { setMyPosition } from "../vehicles/store/myPositionSlice";
import { useStack } from "../../StackContext";
import TripInformation from "./TripInformation";
import styles from "./TripSearch.module.css";

const TripSearch = () => {
  const dispatch = useDispatch();
  const { push } = useStack();
  const [searchTrip, setSearchTrip] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const vehicles: any[] = useSelector(
    (state: RootState) => state.vehicles.vehicles
  );

  function getNearbyVehicles(
    vehicles: any[],
    myLat: number,
    myLon: number,
    radiusKm: number
  ): any[] {
    return vehicles.filter((vehicle) => {
      const distance = getDistanceFromLatLonInKm(
        myLat,
        myLon,
        vehicle.lat,
        vehicle.lon
      );
      return distance <= radiusKm;
    });
  }

  const search = (text: string) => {
    if (text.length === 0) {
      setResults([]);
      return;
    }
    const query = text.trim().toLowerCase();

    const result = vehicles.filter((vehicle) => {
      const headsign = vehicle.trip.tripHeadsign?.toLowerCase() || "";
      const short = vehicle.trip.tripShortName?.toLowerCase() || "";
      const route = vehicle.trip.route?.longName?.toLowerCase() || "";

      return (
        headsign.includes(query) ||
        short.includes(query) ||
        route.includes(query)
      );
    });
    setResults(result);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchTrip(text);
    search(text);
  };

  const handleClick = (
    tripId: number,
    coords: { lat: number; lon: number }
  ) => {
    dispatch(setMyPosition(coords));
    dispatch(setSelectedTripId(tripId));
    push({
      id: `trip-${tripId}`,
      component: <TripInformation />,
    });
  };

  const handleNearClick = () => {
    if (!navigator.geolocation) {
      console.error("A böngésző nem támogatja a geolokációt.");
      alert(
        "Nem sikerült lekérni a pozíciódat. Kérlek engedélyezd a böngészőben."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(
          setMyPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        );

        const nearbyVehicles = getNearbyVehicles(
          vehicles,
          position.coords.latitude,
          position.coords.longitude,
          15
        );

        setResults(nearbyVehicles);
      },
      (error) => {
        console.error("Pozíció hiba:", error);
      }
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Járat keresése</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Keresés..."
          value={searchTrip}
          onChange={handleChange}
          className={styles.searchInput}
        />
        <button onClick={handleNearClick} className={styles.searchNear}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1263_732649)">
              <path
                d="M10.0002 6.66659C8.1585 6.66659 6.66683 8.15825 6.66683 9.99992C6.66683 11.8416 8.1585 13.3333 10.0002 13.3333C11.8418 13.3333 13.3335 11.8416 13.3335 9.99992C13.3335 8.15825 11.8418 6.66659 10.0002 6.66659ZM17.4502 9.16659C17.2614 7.47669 16.5036 5.9012 15.3013 4.69883C14.0989 3.49646 12.5234 2.73868 10.8335 2.54992V1.66659C10.8335 1.20825 10.4585 0.833252 10.0002 0.833252C9.54183 0.833252 9.16683 1.20825 9.16683 1.66659V2.54992C7.47693 2.73868 5.90144 3.49646 4.69907 4.69883C3.4967 5.9012 2.73892 7.47669 2.55016 9.16659H1.66683C1.2085 9.16659 0.833496 9.54159 0.833496 9.99992C0.833496 10.4583 1.2085 10.8333 1.66683 10.8333H2.55016C2.73892 12.5232 3.4967 14.0986 4.69907 15.301C5.90144 16.5034 7.47693 17.2612 9.16683 17.4499V18.3333C9.16683 18.7916 9.54183 19.1666 10.0002 19.1666C10.4585 19.1666 10.8335 18.7916 10.8335 18.3333V17.4499C12.5234 17.2612 14.0989 16.5034 15.3013 15.301C16.5036 14.0986 17.2614 12.5232 17.4502 10.8333H18.3335C18.7918 10.8333 19.1668 10.4583 19.1668 9.99992C19.1668 9.54159 18.7918 9.16659 18.3335 9.16659H17.4502ZM10.0002 15.8333C6.77516 15.8333 4.16683 13.2249 4.16683 9.99992C4.16683 6.77492 6.77516 4.16659 10.0002 4.16659C13.2252 4.16659 15.8335 6.77492 15.8335 9.99992C15.8335 13.2249 13.2252 15.8333 10.0002 15.8333Z"
                fill="black"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_1263_732649">
                <rect width="20" height="20" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          Közelben
        </button>
      </div>

      <div>
        {results.map((result: any) => (
          <button
            className="list-item"
            key={result.trip.id}
            onClick={() =>
              handleClick(result.trip.id, { lat: result.lat, lon: result.lon })
            }
          >
            <TripHeadSign trip={result.trip} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TripSearch;

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
