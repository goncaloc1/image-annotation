import React, { useEffect, useRef } from "react";
import { AnnotationMode } from "@/app/types";

import useCanvas from "@/hooks/useCanvas";

type AnnotationProps = {
  image: HTMLImageElement | null;
  mode: AnnotationMode;
  imageId: string | null;
};

const Annotation = ({ image, mode, imageId }: AnnotationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { handleMouseDown, handleMouseMove, handleMouseUp, clearCanvas } =
    useCanvas({
      canvasRef,
      image,
      mode,
    });

  useEffect(clearCanvas, [imageId, clearCanvas]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Annotation;
