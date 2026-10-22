import { Popup } from "@vis.gl/react-maplibre";
import TripHeadSign from "../../trips/TripHeadSign";

type VehiclePopupParams = {
  vehicle: any;
  onClose: () => void;
};

const VehiclePopup = ({ vehicle, onClose }: VehiclePopupParams) => {
  return (
    <Popup
      longitude={vehicle.lon}
      latitude={vehicle.lat}
      anchor="bottom"
      offset={18}
      maxWidth="300px"
      closeOnClick={false}
      focusAfterOpen={false}
      onClose={onClose}
      className="SourceSans3 vehicle-popup"
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
  );
};

export default VehiclePopup;
