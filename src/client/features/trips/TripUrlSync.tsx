import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useStack } from "../../StackContext";
import { setPanelOpen } from "../../store/slices/panelSlice";
import { showToast } from "../../store/slices/toastSlice";
import { setSelectedTripId } from "./store/selectedTripIdSlice";
import TripInformation from "./TripInformation";

const TRIP_PARAM = "trip";

/** A kijelölt járatot a `?trip=<id>` paraméterrel tartja szinkronban az URL-ben. */
const TripUrlSync = () => {
  const dispatch = useDispatch();
  const { push } = useStack();
  const selectedTripId = useSelector(
    (state: RootState) => state.selectedTripId.tripId
  );
  // Amíg az URL-ből a kezdeti járat be nem töltött, a (még üres) kijelölés nem írhatja felül az URL-t.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = new URL(window.location.href).searchParams.get(TRIP_PARAM);
    if (raw === null) {
      setReady(true);
      return;
    }

    let cancelled = false;
    const invalid = () => {
      dispatch(showToast("Érvénytelen járat."));
      setReady(true);
    };

    if (!/^[\w.:-]+$/.test(raw)) {
      invalid();
      return;
    }

    fetch(`/api/trips/${encodeURIComponent(raw)}`)
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) return invalid();
        dispatch(setSelectedTripId(raw));
        push({ id: `trip-${raw}`, component: <TripInformation /> });
        dispatch(setPanelOpen(true));
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) invalid();
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (selectedTripId === null) url.searchParams.delete(TRIP_PARAM);
    else url.searchParams.set(TRIP_PARAM, String(selectedTripId));
    if (url.href !== window.location.href) {
      window.history.replaceState(null, "", url);
    }
  }, [ready, selectedTripId]);

  return null;
};

export default TripUrlSync;
