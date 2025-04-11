export type Point = {
  x: number;
  y: number;
};

export type VoidClick = true | undefined;

export abstract class Annotation {
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
