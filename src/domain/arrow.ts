import { Annotation, AnnotationState, Point, VoidClick } from "./annotation";

const isPointNearLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point,
  tolerance = 5
) => {
  // Calculate the distance from the point to the line segment
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  const param = lenSq !== 0 ? dot / lenSq : -1;

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy) <= tolerance;
};

type ArrowState = AnnotationState & {
  resizingEnd: "start" | "end" | null;
};

const DEFAULT_STATE: ArrowState = {
  points: [],
  normalizedPoints: [],
  isDrawing: false,
  previewPoint: null,
  isDragging: false,
  resizingEnd: null,
  dragOffset: null,
  isSelected: false,
};

export class Arrow extends Annotation {
  protected state: ArrowState;

  constructor(state?: ArrowState) {
    super();
    this.state = state ?? { ...DEFAULT_STATE };
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.state.points.length < 2 && !this.state.previewPoint) return;

    const startPoint = this.state.points[0];
    const endPoint =
      this.state.points.length < 2 && this.state.previewPoint
        ? this.state.previewPoint
        : this.state.points[1];

    const headLength = 15; // Length of the arrowhead
    const angle = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x
    );

    const color = "lime";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // Highlight the arrow if selected
    ctx.lineWidth = this.state.isSelected ? 2 : 1;

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
      endPoint.x - headLength * Math.cos(angle - Math.PI / 6),
      endPoint.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endPoint.x - headLength * Math.cos(angle + Math.PI / 6),
      endPoint.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.fill();
  }

  handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    canvas: HTMLCanvasElement
  ): VoidClick => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (!this.state.isDrawing && this.state.points.length === 0) {
      // First click: Set the start point of the arrow
      this.state.points = [{ x: mouseX, y: mouseY }];
      this.state.isDrawing = true;
      this.state.isSelected = false;
    } else if (this.state.isDrawing && this.state.points.length === 1) {
      // Second click: Set the end point of the arrow and finish drawing
      this.state.points = [...this.state.points, { x: mouseX, y: mouseY }];
      this.state.isDrawing = false;
      this.state.previewPoint = null;
      this.state.isSelected = true; // Automatically select the arrow after drawing
    } else if (this.state.points.length === 2) {
      // Check if the user is clicking near the start of the arrow
      const distanceToStart = Math.hypot(
        mouseX - this.state.points[0].x,
        mouseY - this.state.points[0].y
      );
      if (distanceToStart < 10) {
        this.state.resizingEnd = "start";
        this.state.isSelected = true;
        return;
      }

      // Check if the user is clicking near the end of the arrow
      const distanceToEnd = Math.hypot(
        mouseX - this.state.points[1].x,
        mouseY - this.state.points[1].y
      );
      if (distanceToEnd < 10) {
        this.state.resizingEnd = "end";
        this.state.isSelected = true;
        return;
      }

      // Check if the user is clicking on the arrow line
      if (
        isPointNearLine(
          { x: mouseX, y: mouseY },
          this.state.points[0],
          this.state.points[1]
        )
      ) {
        this.state.isDragging = true;
        this.state.dragOffset = {
          x: mouseX - this.state.points[0].x,
          y: mouseY - this.state.points[0].y,
        };
        this.state.isSelected = true;
        return;
      }

      // If the user clicks outside the arrow, deselect it
      this.state.isSelected = false;
      return true;
    }
  };

  handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.state.isDrawing && this.state.points.length === 1) {
      // While drawing, update the end point dynamically to show a preview
      this.state.previewPoint = { x: mouseX, y: mouseY };
      this.state.isSelected = true;
    } else if (
      this.state.isDragging &&
      this.state.dragOffset &&
      this.state.points.length === 2
    ) {
      const dx = mouseX - this.state.dragOffset.x;
      const dy = mouseY - this.state.dragOffset.y;
      const deltaX = dx - this.state.points[0].x;
      const deltaY = dy - this.state.points[0].y;

      this.state.points = [
        {
          x: this.state.points[0].x + deltaX,
          y: this.state.points[0].y + deltaY,
        },
        {
          x: this.state.points[1].x + deltaX,
          y: this.state.points[1].y + deltaY,
        },
      ];
    } else if (this.state.resizingEnd === "start") {
      this.state.points = [{ x: mouseX, y: mouseY }, this.state.points[1]];
    } else if (this.state.resizingEnd === "end") {
      this.state.points = [this.state.points[0], { x: mouseX, y: mouseY }];
    }
  };

  handleMouseUp = () => {
    this.state.isDragging = false;
    this.state.resizingEnd = null;
    this.state.dragOffset = null;
  };
}
