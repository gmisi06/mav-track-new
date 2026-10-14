import { useStack } from "../../StackContext";
import styles from "./StackPane.module.css";

const StackPane = () => {
  const { stack, pop } = useStack();
  const top = stack[stack.length - 1];

  return (
    <div>
      <div className={styles.operations}>
        {stack.length > 1 && (
          <button className="back" onClick={pop}>
            <span className="Arrows">B</span> <span>Vissza</span>
          </button>
        )}
      </div>

      <div>{top.component}</div>
    </div>
  );
};

export default StackPane;
