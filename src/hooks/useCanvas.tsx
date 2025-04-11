import {
  useEffect,
  MouseEventHandler,
  useState,
  RefObject,
  useCallback,
} from "react";

import { AnnotationMode } from "@/app/types";
import { CanvasManager } from "@/domain/canvas-manager";

/**
 * Match canvas size to the image
 */
const refreshCanvasSize = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement
) => {
  canvas.width = image.clientWidth;
  canvas.height = image.clientHeight;
};

type UseCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  image: HTMLImageElement | null;
  mode: AnnotationMode;
};

const useCanvas = ({ canvasRef, image, mode }: UseCanvasProps) => {
  const [canvasManager, setCanvasManager] = useState<CanvasManager | null>(
    null
  );

  useEffect(() => {
    // Initialize canvas manager only once
    if (canvasManager) return;

    // Check if canvasRef and image are available
    if (!canvasRef.current || !image) return;

    const canvasContext = canvasRef.current.getContext("2d");
    if (!canvasContext) {
      throw Error("Failed to get canvas context");
    }

    refreshCanvasSize(canvasRef.current, image);

    setCanvasManager(new CanvasManager(mode, canvasRef.current, canvasContext));
  }, [canvasRef, image, canvasManager, mode]);

  useEffect(() => {
    canvasManager?.setMode(mode);
  }, [canvasManager, mode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") canvasManager?.clearSelected();
      if (event.key === "Escape") canvasManager?.clearDrawing();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasManager]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !image) return;

      refreshCanvasSize(canvasRef.current, image);

      canvasManager?.refreshPoints();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, image, canvasManager]);

  const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) =>
    canvasManager?.handleMouseDown(event);

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) =>
    canvasManager?.handleMouseMove(event);

  const handleMouseUp = () => canvasManager?.handleMouseUp();

  const clearCanvas = useCallback(
    () => canvasManager?.clear(),
    [canvasManager]
  );

  const exportImage = useCallback(() => {
    if (!image) return;

    canvasManager?.export(image);
  }, [image, canvasManager]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
    exportImage,
  };
};

export default useCanvas;
