"use client";

import Annotation from "@/components/annotation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import AnnotationControls from "@/components/annotation-controls/annotation-controls";
import ImageControls from "@/components/image-controls/image-controls";
import { StateManagerProvider, useStateManager } from "@/state/useStateManager";

const Page = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const state = useStateManager();

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
        <AnnotationControls mode={state.mode} />
        <ImageControls setBase64Image={setBase64Image} />
      </header>
      <main className={styles.main}>
        <div className={styles.image_container}>
          <img src={base64Image ?? "/warehouse2.jpg"} alt="warehouse image" />
          <Annotation
            image={image}
            mode={state.mode}
            imageId={base64Image}
            exportTrigger={state.exportTrigger}
          />
        </div>
      </main>
    </div>
  );
};

export default function Home() {
  return (
    <StateManagerProvider>
      <Page />
    </StateManagerProvider>
  );
}
