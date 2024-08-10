interface BasePoint {
  x: number;
  y: number;
}

interface Point extends BasePoint {
  heading: number;
}

type ControlPoint = BasePoint;

interface Line {
  endPoint: Point;
  controlPoints: ControlPoint[];
  color: string;
}
