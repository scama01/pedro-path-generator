export function getRandomColor() {
  var letters = "56789ABCD";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

export function drawImage(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  x: number,
  y: number,
  w: number,
  h: number,
  degrees: number
) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((degrees * Math.PI) / 180.0);
  ctx.translate(-x - w / 2, -y - h / 2);
  ctx.drawImage(image, x, y, w, h);
  ctx.restore();
}

export function drawRobot(ctx: CanvasRenderingContext2D, robotWidth: number) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.rect(0, 0, robotWidth, robotWidth);
  ctx.fill();

  ctx.strokeStyle = "red";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(robotWidth / 2, 0);
  ctx.lineTo(robotWidth / 2, robotWidth / 2);
  ctx.stroke();

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(robotWidth / 2, robotWidth / 2, 12, 0, 2 * Math.PI);
  ctx.fill();
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  startPoint: Point,
  scalingFactor: number
) {
  ctx.lineWidth = 3.5;

  lines.forEach((line, idx) => {
    ctx.strokeStyle = line.color;
    ctx.beginPath();

    if (idx === 0) {
      ctx.moveTo(startPoint.x * scalingFactor, startPoint.y * scalingFactor);
    } else {
      ctx.moveTo(
        lines[idx - 1].endPoint.x * scalingFactor,
        lines[idx - 1].endPoint.y * scalingFactor
      );
    }

    let bezierLine: number[] = [];
    line.controlPoints.forEach((point) => {
      bezierLine.push(point.x * scalingFactor);
      bezierLine.push(point.y * scalingFactor);
    });
    bezierLine.push(line.endPoint.x * scalingFactor);
    bezierLine.push(line.endPoint.y * scalingFactor);

    if (bezierLine.length === 4) {
      ctx.quadraticCurveTo(...(bezierLine as [number, number, number, number]));
    } else if (bezierLine.length === 6) {
      ctx.bezierCurveTo(
        ...(bezierLine as [number, number, number, number, number, number])
      );
    } else if (bezierLine.length === 2) {
      ctx.lineTo(...(bezierLine as [number, number]));
    }

    ctx.stroke();
  });
}

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  point: Point | ControlPoint,
  color: string,
  pointRadius: number,
  scalingFactor: number
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(
    point.x * scalingFactor,
    point.y * scalingFactor,
    pointRadius,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

export function clearCanvas(...contexts: CanvasRenderingContext2D[]) {
  contexts.forEach((ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  });
}
