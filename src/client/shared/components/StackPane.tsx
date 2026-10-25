import { useDispatch } from "react-redux";
import { useStack } from "../../StackContext";
import { clearSelectedTripId } from "../../features/trips/store/selectedTripIdSlice";
import { clearPolyline } from "../../store/slices/polylineSlice";
import styles from "./StackPane.module.css";

const StackPane = () => {
  const { stack, pop } = useStack();
  const top = stack[stack.length - 1];
  const dispatch = useDispatch();

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
      </div>

      <div>{top.component}</div>
    </div>
  );
};

export default StackPane;
