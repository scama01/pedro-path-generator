import { DPI } from "./math";

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

const robotImage = new Image();
robotImage.src = "/robot.png";
robotImage.loading = "eager";

export function drawRobot(
  ctx: CanvasRenderingContext2D,
  robotWidth: number,
  robotHeight: number
) {
  // ctx.fillStyle = "white";
  // ctx.beginPath();
  // ctx.rect(0, 0, robotWidth * DPI, robotWidth * DPI);
  // ctx.fill();

  // ctx.strokeStyle = "red";
  // ctx.lineWidth = 0.75 * DPI;
  // ctx.beginPath();
  // ctx.moveTo(robotWidth * DPI, (robotWidth * DPI) / 2);
  // ctx.lineTo((robotWidth * DPI) / 2, (robotWidth * DPI) / 2);
  // ctx.stroke();

  // ctx.fillStyle = "red";
  // ctx.beginPath();
  // ctx.arc(
  //   (robotWidth * DPI) / 2,
  //   (robotWidth * DPI) / 2,
  //   1 * DPI,
  //   0,
  //   2 * Math.PI
  // );
  // ctx.fill();

  ctx.drawImage(robotImage, 0, 0, robotWidth * DPI, robotHeight * DPI);
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  startPoint: Point
) {
  ctx.lineWidth = 0.5 * DPI;

  lines.forEach((line, idx) => {
    ctx.strokeStyle = line.color;
    ctx.beginPath();

    if (idx === 0) {
      ctx.moveTo(startPoint.x * DPI, startPoint.y * DPI);
    } else {
      ctx.moveTo(
        lines[idx - 1].endPoint.x * DPI,
        lines[idx - 1].endPoint.y * DPI
      );
    }

    let bezierLine: number[] = [];
    line.controlPoints.forEach((point) => {
      bezierLine.push(point.x * DPI);
      bezierLine.push(point.y * DPI);
    });
    bezierLine.push(line.endPoint.x * DPI);
    bezierLine.push(line.endPoint.y * DPI);

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
  pointRadius: number
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x * DPI, point.y * DPI, pointRadius * DPI, 0, 2 * Math.PI);
  ctx.fill();
}

export function clearCanvas(...contexts: CanvasRenderingContext2D[]) {
  contexts.forEach((ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  });
}
