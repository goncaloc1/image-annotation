import React, { useEffect, useRef, useState } from "react";
import { AnnotationMode } from "@/app/types";

import useCanvas from "@/hooks/useCanvas";

type AnnotationProps = {
  mode: AnnotationMode;
  imageId: string | null;
  exportTrigger?: number;
};

const Annotation = ({ mode, imageId, exportTrigger }: AnnotationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      // This is a workaround for the SSR issue where document is not available
      // useRef wouldn't trigger a re-render hence not using it
      setImage(document.querySelector("img"));
    }
  }, []);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
    exportImage,
  } = useCanvas({
    canvasRef,
    image,
    mode,
  });

  useEffect(clearCanvas, [imageId, clearCanvas]);

  useEffect(() => {
    if (exportTrigger) exportImage();
  }, [exportTrigger, exportImage]);

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
};

export default Annotation;
