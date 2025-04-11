"use client";

import Annotation from "@/components/annotation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import AnnotationControls from "@/components/annotation-controls/annotation-controls";
import { AnnotationMode } from "./types";
import ImageControls from "@/components/image-controls/image-controls";

export default function Home() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<AnnotationMode>("polygon");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [exportTrigger, setExportTrigger] = useState(0);

  useEffect(() => {
    if (typeof document !== "undefined") {
      // This is a workaround for the SSR issue where document is not available
      // useRef wouldn't trigger a re-render hence not using it
      setImage(document.querySelector("img"));
    }
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <AnnotationControls mode={mode} setMode={setMode} />
        <ImageControls
          setBase64Image={setBase64Image}
          setExportTrigger={setExportTrigger}
        />
      </header>
      <main className={styles.main}>
        <div className={styles.image_container}>
          <img src={base64Image ?? "/warehouse2.jpg"} alt="warehouse image" />
          <Annotation
            image={image}
            mode={mode}
            imageId={base64Image}
            exportTrigger={exportTrigger}
          />
        </div>
      </main>
    </div>
  );
}
