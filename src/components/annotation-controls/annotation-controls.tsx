import { AnnotationMode } from "@/app/types";
import styles from "./annotation-controls.module.css";

type AnnotationControlsProps = {
  mode: AnnotationMode;
  setMode: (mode: AnnotationMode) => void;
};

const AnnotationControls = ({ mode, setMode }: AnnotationControlsProps) => {
  return (
    <div className={styles.annotation_menu}>
      <button
        className={mode === "polygon" ? "selected" : ""}
        onClick={() => setMode("polygon")}
      >
        Polygon
      </button>
      <button
        className={mode === "arrow" ? "selected" : ""}
        onClick={() => setMode("arrow")}
      >
        Arrow
      </button>
    </div>
  );
};

export default AnnotationControls;
