import { divIcon } from "leaflet";
import { useMemo } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { TrainIcon } from "./TrainIcon";
import TripHeadSign from "../../trips/TripHeadSign";
import { useDispatch } from "react-redux";
import {
  clearSelectedTripId,
  setSelectedTripId,
} from "../../trips/store/selectedTripIdSlice";
import TripInformation from "../../trips/TripInformation";
import { useStack } from "../../../StackContext";
import { clearPolyline } from "../../../store/slices/polylineSlice";

type VehicleMarkerParams = {
  vehicle: any;
};

const VehicleMarker = ({ vehicle }: VehicleMarkerParams) => {
  const dispatch = useDispatch();

  const { push, pop } = useStack();

  const getDelayColor = (delay: number) => {
    if (delay / 60 >= 60) return "#FA3031";
    if (delay / 60 >= 15) return "#FFA500";
    if (delay / 60 >= 5) return "#FFFF00";
    return "#00FF00";
  };

  const icon = useMemo(
    () =>
      divIcon({
        className: "",
        html: TrainIcon(getDelayColor(vehicle.delay), vehicle.heading),
        iconSize: [30, 30],
      }),
    [vehicle.delay, vehicle.heading]
  );

  return (
    <Marker
      position={[vehicle.lat, vehicle.lon]}
      zIndexOffset={1000}
      icon={icon}
    >
      <Tooltip
        direction="top"
        offset={[0, -20]}
        className="tooltip SourceSans3"
      >
        <TripHeadSign trip={vehicle.trip} />
      </Tooltip>
      <Popup
        eventHandlers={{
          add: async (e) => {
            const map = e.target._map;
            setTimeout(() => {
              map.flyTo([vehicle.lat, vehicle.lon], map.getZoom(), {
                duration: 0.5,
              });
            }, 250);

            dispatch(setSelectedTripId(vehicle.trip.id));

            push({
              id: `trip-${vehicle.trip.id}`,
              component: <TripInformation />,
            });
          },

          remove: async () => {
            pop();
            dispatch(clearSelectedTripId());
            dispatch(clearPolyline());
          },
        }}
        className="SourceSans3 tooltip"
      >
        <div>
          <TripHeadSign trip={vehicle.trip} />
        </div>
        <div>
          Következő megálló:{" "}
          {vehicle.stopRelationship ? vehicle.stopRelationship.stop.name : ""}
        </div>
        <div>
          Késés: {vehicle.delay ? vehicle.delay / 60 + " perc" : "Nincs késés"}
        </div>
      </Popup>
    </Marker>
  );
};

export default VehicleMarker;
