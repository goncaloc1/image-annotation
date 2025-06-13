"use client";

import Annotation from "@/components/annotation";
import styles from "./page.module.css";
import AnnotationControls from "@/components/annotation-controls/annotation-controls";
import ImageControls from "@/components/image-controls/image-controls";
import { StateManagerProvider, useStateManager } from "@/state/useStateManager";

const Page = () => {
  const state = useStateManager();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <AnnotationControls mode={state.mode} />
        <ImageControls />
      </header>
      <main className={styles.main}>
        <div className={styles.image_container}>
          <img
            src={state.base64Image ?? "/warehouse2.jpg"}
            alt="warehouse image"
          />
          <Annotation
            mode={state.mode}
            imageId={state.base64Image}
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
