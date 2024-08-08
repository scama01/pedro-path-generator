export function getLineXYatPercent(
  startPt: Point | ControlPoint,
  endPt: Point | ControlPoint,
  percent: number
) {
  let dx = endPt.x - startPt.x;
  let dy = endPt.y - startPt.y;
  let X = startPt.x + dx * percent;
  let Y = startPt.y + dy * percent;
  return { x: X, y: Y };
}

export function getCubicBezierXYatPercent(
  startPt: Point | ControlPoint,
  controlPt1: Point | ControlPoint,
  controlPt2: Point | ControlPoint,
  endPt: Point | ControlPoint,
  percent: number
) {
  let x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
  let y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
  return { x: x, y: y };
}

export function getQuadraticBezierXYatPercent(
  startPt: Point | ControlPoint,
  controlPt: Point | ControlPoint,
  endPt: Point | ControlPoint,
  percent: number
) {
  let x =
    Math.pow(1 - percent, 2) * startPt.x +
    2 * (1 - percent) * percent * controlPt.x +
    Math.pow(percent, 2) * endPt.x;
  let y =
    Math.pow(1 - percent, 2) * startPt.y +
    2 * (1 - percent) * percent * controlPt.y +
    Math.pow(percent, 2) * endPt.y;
  return { x: x, y: y };
}

export function CubicN(
  pct: number,
  a: number,
  b: number,
  c: number,
  d: number
) {
  let t2 = pct * pct;
  let t3 = t2 * pct;
  return (
    a +
    (-a * 3 + pct * (3 * a - a * pct)) * pct +
    (3 * b + pct * (-6 * b + b * 3 * pct)) * pct +
    (c * 3 - c * 3 * pct) * t2 +
    d * t3
  );
}

export function getRobotCoordinates(
  percent: number,
  lines: Line[],
  startPoint: Point
) {
  let _percent = (percent * 1.0) / 10;

  let currentLineIdx = (lines.length * _percent) / 100;
  let currentLine =
    lines[Math.min(Math.trunc(currentLineIdx), lines.length - 1)];

  let _startPoint =
    Math.floor(currentLineIdx) === 0
      ? startPoint
      : lines[Math.floor(currentLineIdx) - 1].endPoint;

  let linePercent = easeInOutQuad(currentLineIdx - Math.floor(currentLineIdx));

  let robotXY =
    currentLine.controlPoints.length === 0
      ? getLineXYatPercent(_startPoint, currentLine.endPoint, linePercent)
      : currentLine.controlPoints.length === 1
      ? getQuadraticBezierXYatPercent(
          _startPoint,
          currentLine.controlPoints[0],
          currentLine.endPoint,
          linePercent
        )
      : currentLine.controlPoints.length === 2
      ? getCubicBezierXYatPercent(
          _startPoint,
          currentLine.controlPoints[0],
          currentLine.controlPoints[1],
          currentLine.endPoint,
          linePercent
        )
      : null;

  let robotHeading =
    _startPoint.heading +
    (currentLine.endPoint.heading - _startPoint.heading) * linePercent;

  return { robotXY, robotHeading };
}

export function inOutQuad(n: number) {
  n *= 2;
  if (n < 1) return 0.5 * n * n;
  return -0.5 * (--n * (n - 2) - 1);
}

export function isPointInCircle(
  point: Point | ControlPoint,
  x: number,
  y: number,
  pointRadius: number,
  scalingFactor: number
) {
  const dx = point.x * scalingFactor - x;
  const dy = point.y * scalingFactor - y;
  return dx * dx + dy * dy <= pointRadius * pointRadius;
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
