export function quadraticToCubic(
  P0: BasePoint,
  P1: BasePoint,
  P2: BasePoint
): { Q1: BasePoint; Q2: BasePoint } {
  const Q1 = {
    x: P0.x + (2 / 3) * (P1.x - P0.x),
    y: P0.y + (2 / 3) * (P1.y - P0.y),
  };

  const Q2 = {
    x: P2.x + (2 / 3) * (P1.x - P2.x),
    y: P2.y + (2 / 3) * (P1.y - P2.y),
  };

  return { Q1, Q2 };
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function getMousePos(evt: MouseEvent, canvas: any) {
  let rect = canvas.getBoundingClientRect();
  return {
    x:
      ((evt.clientX - rect.left) / (rect.right - rect.left)) *
      canvas.width.baseVal.value,
    y:
      ((evt.clientY - rect.top) / (rect.bottom - rect.top)) *
      canvas.height.baseVal.value,
  };
}

export function vh(percent: number) {
  var h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  return (percent * h) / 100;
}

export function vw(percent: number) {
  var w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  return (percent * w) / 100;
}

export function transformAngle(angle: number) {
  return ((angle + 180) % 360) - 180;
}

export function shortestRotation(
  startAngle: number,
  endAngle: number,
  t: number
) {
  // Normalize the angles to be between -180 and 180 degrees
  startAngle = (startAngle + 360) % 360;
  endAngle = (endAngle + 360) % 360;
  if (startAngle > 180) startAngle -= 360;
  if (endAngle > 180) endAngle -= 360;

  // Calculate the difference
  let delta = endAngle - startAngle;

  // Find the shortest path
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  // Interpolate the angle based on the percentage
  let result = startAngle + delta * t;

  // Normalize the result to be between 0 and 360
  return transformAngle(result);
}
