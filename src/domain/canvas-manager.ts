import { AnnotationMode } from "@/app/types";
import { Annotation, VoidClick } from "./annotation";
import { Polygon } from "./polygon";
import { Arrow } from "./arrow";

export class CanvasManager {
  private annotations: Annotation[] = [];

  constructor(
    private mode: AnnotationMode,
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {}

  private newAnnotation() {
    let annotation;

    if (this.mode === "polygon") annotation = new Polygon();
    else if (this.mode === "arrow") annotation = new Arrow();

    if (annotation) {
      this.annotations.push(annotation);
    }

    return annotation;
  }

  private render({
    skipPointsNormalization = false,
    image,
  }: { skipPointsNormalization?: boolean; image?: HTMLImageElement } = {}) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (image) {
      this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }

    this.annotations.forEach((annotation) => {
      if (!skipPointsNormalization) {
        // TODO this can potentially be optimized by only calling when stricly necessary
        annotation.refreshNormalizedPoints(
          this.canvas.width,
          this.canvas.height
        );
      }
      annotation.draw(this.ctx);
    });
  }

  /**
   * Export the canvas as a PNG image
   */
  export(image: HTMLImageElement) {
    this.render({ skipPointsNormalization: true, image });

    this.canvas.toBlob((blob) => {
      if (!blob) return;

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "annotations.png";
      link.click();

      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    }, "image/png");
  }

  setMode(mode: AnnotationMode) {
    this.mode = mode;
  }

  /**
   * Recalculate absolute coordinates based on normalized values
   * Necessary when the canvas is resized
   */
  refreshPoints() {
    this.annotations.forEach((annotation) =>
      annotation.refreshPoints(this.canvas.width, this.canvas.height)
    );

    this.render({ skipPointsNormalization: true });
  }

  /**
   * Delete selected annotations
   */
  clearSelected() {
    this.annotations = this.annotations.filter(
      (annotation) => !annotation.isSelected()
    );
    this.render({ skipPointsNormalization: true });
  }

  /**
   * Clear the on-going drawing
   */
  clearDrawing() {
    this.annotations = this.annotations.filter(
      (annotation) => !annotation.isDrawing()
    );
    this.render({ skipPointsNormalization: true });
  }

  /**
   * Clear all annotations
   */
  clear() {
    this.annotations = [];
    this.render();
  }

  handleMouseDown(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    let isVoidClick: VoidClick = true;

    this.annotations.forEach((annotation) => {
      const result = annotation.handleMouseDown(event, this.canvas);
      isVoidClick = isVoidClick && result;
    });

    // Check if the click is inside any annotation, if not, create a new annotation
    if (isVoidClick) {
      this.newAnnotation()?.handleMouseDown(event, this.canvas);
    }

    this.render();
  }

  handleMouseMove(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    this.annotations.forEach((annotation) =>
      annotation.handleMouseMove(event, this.canvas)
    );
    this.render();
  }

  handleMouseUp() {
    this.annotations.forEach((annotation) => annotation.handleMouseUp());
    this.render();
  }
}
