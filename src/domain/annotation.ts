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

  abstract isSelected(): boolean;

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
}
