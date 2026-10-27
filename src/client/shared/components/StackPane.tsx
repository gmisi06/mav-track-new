import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { showToast } from "../../store/slices/toastSlice";
import { useStack } from "../../StackContext";
import { clearSelectedTripId } from "../../features/trips/store/selectedTripIdSlice";
import { clearPolyline } from "../../store/slices/polylineSlice";
import styles from "./StackPane.module.css";

const StackPane = () => {
  const { stack, pop } = useStack();
  const top = stack[stack.length - 1];
  const dispatch = useDispatch();

  const selectedTripId = useSelector(
    (state: RootState) => state.selectedTripId.tripId
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      dispatch(showToast("Hivatkozás vágólapra másolva."));
    } catch {
      dispatch(showToast("A másolás nem sikerült."));
    }
  };

  // A járat nézetből visszalépve a kijelölés is megszűnik, a többi vonat újra látszik.
  const back = () => {
    dispatch(clearSelectedTripId());
    dispatch(clearPolyline());
    pop();
  };

  return (
    <div>
      <div className={styles.operations}>
        {stack.length > 1 && (
          <button className="back" onClick={back}>
            <span className="Arrows">B</span> <span>Vissza</span>
          </button>
        )}
        {stack.length > 1 && selectedTripId !== null && (
          <button
            className="back"
            onClick={copyLink}
            aria-label="Hivatkozás másolása"
            title="Hivatkozás másolása"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
            </svg>
          </button>
        )}
      </div>

      <div>{top.component}</div>
    </div>
  );
};

export default StackPane;
