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

  private render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.annotations.forEach((annotation) => annotation.draw(this.ctx));
  }

  setMode(mode: AnnotationMode) {
    this.mode = mode;
  }

  deleteSelected() {
    this.annotations = this.annotations.filter(
      (annotation) => !annotation.isSelected()
    );
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
