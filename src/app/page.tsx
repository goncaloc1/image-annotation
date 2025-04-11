"use client";

import Annotation from "@/components/annotation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import AnnotationMenu from "@/components/annotation-menu/annotation-menu";
import { AnnotationMode } from "./types";
import ImageUploader from "@/components/image-uploader/image-uploader";

export default function Home() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<AnnotationMode>("polygon");
  const [base64Image, setBase64Image] = useState<string | null>(null);

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
        <AnnotationMenu mode={mode} setMode={setMode} />
        <ImageUploader setBase64Image={setBase64Image} />
      </header>
      <main className={styles.main}>
        <div className={styles.image_container}>
          <img src={base64Image ?? "/warehouse2.jpg"} alt="warehouse image" />
          <Annotation image={image} mode={mode} imageId={base64Image} />
        </div>
      </main>
    </div>
  );
}
