import { AnnotationMode } from "@/app/types";
import styles from "./annotation-controls.module.css";
import {
  StateManagerActionType,
  useStateManagerDispatch,
} from "@/state/useStateManager";

type AnnotationControlsProps = {
  mode: AnnotationMode;
};

const AnnotationControls = ({ mode }: AnnotationControlsProps) => {
  const dispatch = useStateManagerDispatch();

  return (
    <div className={styles.annotation_menu}>
      <button
        className={mode === "polygon" ? "selected" : ""}
        onClick={() =>
          dispatch({ type: StateManagerActionType.SET_POLYGON_MODE })
        }
      >
        Polygon
      </button>
      <button
        className={mode === "arrow" ? "selected" : ""}
        onClick={() =>
          dispatch({ type: StateManagerActionType.SET_ARROW_MODE })
        }
      >
        Arrow
      </button>
    </div>
  );
};

export default AnnotationControls;
