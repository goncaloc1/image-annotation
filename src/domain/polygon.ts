import { Annotation, Point, VoidClick } from "./annotation";

const isPointInsidePolygon = (x: number, y: number, polygonPoints: Point[]) => {
  let inside = false;
  for (
    let i = 0, j = polygonPoints.length - 1;
    i < polygonPoints.length;
    j = i++
  ) {
    const xi = polygonPoints[i].x,
      yi = polygonPoints[i].y;
    const xj = polygonPoints[j].x,
      yj = polygonPoints[j].y;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const distance = (p1: Point, p2: Point) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

type State = {
  points: Point[];
  isDrawing: boolean;
  previewPoint: Point | null;
  isFinalized: boolean;
  isDragging: boolean;
  dragOffset: Point | null;
  isSelected: boolean;
};

const DEFAULT_STATE: State = {
  points: [],
  isDrawing: false,
  previewPoint: null,
  isFinalized: false,
  isDragging: false,
  dragOffset: null,
  isSelected: false,
};

export class Polygon extends Annotation {
  state: State;

  constructor(state?: State) {
    super();
    this.state = state ?? { ...DEFAULT_STATE };
  }

  isSelected() {
    return this.state.isSelected;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.state.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(this.state.points[0].x, this.state.points[0].y);
      this.state.points.forEach((point) => ctx.lineTo(point.x, point.y));

      if (this.state.previewPoint) {
        ctx.lineTo(this.state.previewPoint.x, this.state.previewPoint.y);
      } else {
        ctx.closePath();
      }

      // Fill the polygon with a semi-transparent color
      ctx.fillStyle = this.state.isSelected
        ? "rgba(50,205,50, 0.2)"
        : "rgba(0, 0, 0, 0.2)";
      ctx.fill();

      // Draw the polygon outline
      ctx.strokeStyle = this.state.isSelected ? "#32CD32" : "lime";
      ctx.lineWidth = this.state.isSelected ? 2 : 1;
      ctx.stroke();
    }
  }

  handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    canvas: HTMLCanvasElement
  ): VoidClick => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.state.isFinalized) {
      // Check if the click is inside the polygon
      if (isPointInsidePolygon(mouseX, mouseY, this.state.points)) {
        this.state.isSelected = true;
        this.state.isDragging = true;
        this.state.dragOffset = { x: mouseX, y: mouseY };
      } else {
        this.state.isSelected = false;
        return true;
      }
    } else {
      // Handle adding points to the polygon
      if (
        this.state.points.length > 0 &&
        distance({ x: mouseX, y: mouseY }, this.state.points[0]) < 10
      ) {
        this.state.isDrawing = false;
        this.state.isFinalized = true;
        this.state.previewPoint = null;
      } else {
        const updatedPoints = [...this.state.points, { x: mouseX, y: mouseY }];

        this.state.points = updatedPoints;
        this.state.isDrawing = true;
      }
    }
  };

  handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
      this.state.isDragging &&
      this.state.isFinalized &&
      this.state.dragOffset
    ) {
      const offsetX = mouseX - this.state.dragOffset.x;
      const offsetY = mouseY - this.state.dragOffset.y;

      const updatedPoints = this.state.points.map((point) => ({
        x: point.x + offsetX,
        y: point.y + offsetY,
      }));

      this.state.points = updatedPoints;
      this.state.dragOffset = { x: mouseX, y: mouseY };
    } else if (
      !this.state.isFinalized &&
      this.state.isDrawing &&
      this.state.points.length > 0
    ) {
      this.state.previewPoint = { x: mouseX, y: mouseY };
    }
  };

  handleMouseUp = () => {
    if (this.state.isDragging) {
      this.state.isDragging = false;
      this.state.dragOffset = null;
    }
  };
}
