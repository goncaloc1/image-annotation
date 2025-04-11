import { AnnotationMode } from "@/app/types";
import styles from "./annotation-menu.module.css";

type AnnotationMenuProps = {
  mode: AnnotationMode;
  setMode: (mode: AnnotationMode) => void;
};

const AnnotationMenu = ({ mode, setMode }: AnnotationMenuProps) => {
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

export default AnnotationMenu;
