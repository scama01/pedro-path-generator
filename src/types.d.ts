interface Point {
  x: number;
  y: number;
  isDragging: boolean;
  heading: number;
}

type ControlPoint = Omit<Point, "heading">;

interface Line {
  endPoint: Point;
  controlPoints: ControlPoint[];
  color: string;
}
