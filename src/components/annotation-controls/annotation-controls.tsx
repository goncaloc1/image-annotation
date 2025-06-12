import { AnnotationMode } from "@/app/types";
import styles from "./annotation-controls.module.css";
import {
  StateManagementActionType,
  useStateManagementDispatch,
} from "@/state/useStateManagement";

type AnnotationControlsProps = {
  mode: AnnotationMode;
};

const AnnotationControls = ({ mode }: AnnotationControlsProps) => {
  const dispatch = useStateManagementDispatch();

  return (
    <div className={styles.annotation_menu}>
      <button
        className={mode === "polygon" ? "selected" : ""}
        onClick={() =>
          dispatch({ type: StateManagementActionType.SET_POLYGON_MODE })
        }
      >
        Polygon
      </button>
      <button
        className={mode === "arrow" ? "selected" : ""}
        onClick={() =>
          dispatch({ type: StateManagementActionType.SET_ARROW_MODE })
        }
      >
        Arrow
      </button>
    </div>
  );
};

export default AnnotationControls;
