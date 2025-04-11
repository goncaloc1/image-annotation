import React, { useEffect, useRef } from "react";
import { AnnotationMode } from "@/app/types";

import useCanvas from "@/hooks/useCanvas";

type AnnotationProps = {
  image: HTMLImageElement | null;
  mode: AnnotationMode;
  imageId: string | null;
  exportTrigger?: number;
};

const Annotation = ({
  image,
  mode,
  imageId,
  exportTrigger,
}: AnnotationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
