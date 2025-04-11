import React, { useRef } from "react";
import { AnnotationMode } from "@/app/types";

import useCanvas from "@/hooks/useCanvas";

type AnnotationProps = {
  image: HTMLImageElement | null;
  mode: AnnotationMode;
};

const Annotation = ({ image, mode }: AnnotationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvas({
    canvasRef,
    image,
    mode,
  });

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
