export type Point = {
  x: number;
  y: number;
};

export type VoidClick = true | undefined;

export type AnnotationState = {
  points: Point[];
  normalizedPoints: Point[]; // Normalized coordinates (relative to image dimensions)
  isDrawing: boolean;
  previewPoint: Point | null;
  isDragging: boolean;
  isSelected: boolean;
  dragOffset: Point | null;
};

export abstract class Annotation {
  protected abstract state: AnnotationState;

  constructor() {}

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract handleMouseDown(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    canvas: HTMLCanvasElement
  ): VoidClick;

  abstract handleMouseMove(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    canvas: HTMLCanvasElement
  ): void;

  abstract handleMouseUp(): void;

  isSelected = () => this.state.isSelected;

  isDrawing = () => this.state.isDrawing;

  /**
   * Recalculate absolute coordinates based on normalized values
   */
  refreshPoints = (width: number, height: number) => {
    this.state.points = this.state.normalizedPoints.map((point) => ({
      x: point.x * width,
      y: point.y * height,
    }));
  };

  refreshNormalizedPoints = (width: number, height: number) => {
    this.state.normalizedPoints = this.state.points.map((point) => ({
      x: point.x / width,
      y: point.y / height,
    }));
  };
}
