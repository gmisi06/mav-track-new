import { useMapEvents } from "react-leaflet";
import { useDispatch } from "react-redux";
import { clearSelectedTripId } from "../trips/store/selectedTripIdSlice";
import { clearPolyline } from "../../store/slices/polylineSlice";

const MapClickHandler = () => {
  const dispatch = useDispatch();

  useMapEvents({
    click() {
      // üres térképre kattintás
      dispatch(clearSelectedTripId());
      dispatch(clearPolyline());
    },
  });
  return null;
};

export default MapClickHandler;
