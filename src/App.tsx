import { MouseEventHandler, useEffect, useRef, useState } from "react";
import ControlsTab from "./components/ControlsTab";
import {
  clearCanvas,
  DPI,
  drawImage,
  drawLines,
  drawPoint,
  drawRobot,
  getMousePos,
  getRandomColor,
  getRobotCoordinates,
  isPointInCircle,
} from "./utils";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [pointRadius] = useState(1);

  const [robotWidth, setRobotWidth] = useState(14);
  const [robotHeight, setRobotHeight] = useState(14);

  const [percent, setPercent] = useState(0);

  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | undefined>();

  const togglePlaying = () => {
    if (playing) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setPercent((prevProgress) => {
          if (prevProgress >= 1000) {
            return 0;
          }
          return prevProgress + 6 / lines.length;
        });
      }, 7.5);
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const [startPoint, setStartPoint] = useState<Point>({
    x: 83.976,
    y: 7.257,
    isDragging: false,
    heading: -90,
  });

  const [lines, setLines] = useState<Line[]>([
    {
      endPoint: { x: 83.976, y: 35.489, isDragging: false, heading: -90 },
      controlPoints: [],
      color: getRandomColor(),
    },
    {
      endPoint: { x: 123.7, y: 35.489, isDragging: false, heading: 180 },
      controlPoints: [
        { x: 97.412, y: 28.771, isDragging: false },
        { x: 110.118, y: 41.623, isDragging: false },
      ],
      color: getRandomColor(),
    },
    {
      endPoint: { x: 10.661, y: 35.781, isDragging: false, heading: 180 },
      controlPoints: [],
      color: getRandomColor(),
    },
    {
      endPoint: { x: 123.7, y: 42.791, isDragging: false, heading: 180 },
      controlPoints: [{ x: 54.913, y: 97.266, isDragging: false }],
      color: getRandomColor(),
    },
  ]);

  useEffect(() => {
    if (Number.isNaN(robotWidth)) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = 144 * DPI;
    canvas.height = 144 * DPI;

    const globalCtx = canvas.getContext("2d");
    if (!globalCtx) {
      return;
    }

    const lineCanvas = document.createElement("canvas");
    const pointCanvas = document.createElement("canvas");
    const robotCanvas = document.createElement("canvas");

    robotCanvas.width = robotWidth * DPI;
    robotCanvas.height = robotHeight * DPI;
    [lineCanvas, pointCanvas].forEach((canvas) => {
      canvas.width = 144 * DPI;
      canvas.height = 144 * DPI;
    });

    const lineCtx = lineCanvas.getContext("2d")!;
    const pointCtx = lineCanvas.getContext("2d")!;
    const robotCtx = robotCanvas.getContext("2d")!;

    clearCanvas(globalCtx, lineCtx, pointCtx, robotCtx);

    drawLines(lineCtx, lines, startPoint);

    drawPoint(pointCtx, startPoint, lines[0].color, pointRadius);
    lines.forEach((line) =>
      [line.endPoint, ...line.controlPoints].forEach((point) =>
        drawPoint(pointCtx, point, line.color, pointRadius)
      )
    );

    const { robotXY, robotHeading } = getRobotCoordinates(
      percent,
      lines,
      startPoint
    );

    drawRobot(robotCtx, robotWidth, robotHeight);

    drawImage(
      globalCtx,
      robotCanvas,
      robotXY!.x * DPI - (robotWidth * DPI) / 2,
      robotXY!.y * DPI - (robotHeight * DPI) / 2,
      robotWidth * DPI,
      robotHeight * DPI,
      -robotHeading
    );
    globalCtx.drawImage(pointCanvas, 0, 0, 144 * DPI, 144 * DPI);
    globalCtx.drawImage(lineCanvas, 0, 0, 144 * DPI, 144 * DPI);
  }, [lines, startPoint, percent, pointRadius, robotWidth, robotHeight]);

  const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const { x, y } = getMousePos(event.nativeEvent, canvasRef.current!);
    console.log(x, y / DPI);

    const newLines = lines.map(
      (line) =>
        ({
          ...line,
          endPoint: {
            ...line.endPoint,
            isDragging: isPointInCircle(line.endPoint, x, y, pointRadius),
          },
          controlPoints: line.controlPoints.map((point) => ({
            ...point,
            isDragging: isPointInCircle(point, x, y, pointRadius),
          })),
        } satisfies Line)
    );

    setStartPoint({
      ...startPoint,
      isDragging: isPointInCircle(startPoint, x, y, pointRadius),
    });
    setLines(newLines);
  };

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const { x, y } = getMousePos(event.nativeEvent, canvasRef.current!);

    const newLines = lines.map(
      (line) =>
        ({
          ...line,
          endPoint: {
            ...line.endPoint,
            x: line.endPoint.isDragging ? x / DPI : line.endPoint.x,
            y: line.endPoint.isDragging ? y / DPI : line.endPoint.y,
          },
          controlPoints: line.controlPoints.map((point) => ({
            ...point,
            x: point.isDragging ? x / DPI : point.x,
            y: point.isDragging ? y / DPI : point.y,
          })),
        } satisfies Line)
    );

    if (startPoint.isDragging) {
      setStartPoint({
        ...startPoint,
        x: x / DPI,
        y: y / DPI,
      });
    }
    setLines(newLines);
  };

  function handleMouseUp() {
    const newLines = lines.map(
      (line) =>
        ({
          ...line,
          endPoint: {
            ...line.endPoint,
            isDragging: false,
          },
          controlPoints: line.controlPoints.map((point) => ({
            ...point,
            isDragging: false,
          })),
        } satisfies Line)
    );

    setStartPoint({
      ...startPoint,
      isDragging: false,
    });
    setLines(newLines);
  }

  return (
    <div className="w-full h-full flex flex-col justify-start items-start">
      <div className="w-full flex flex-row justify-between items-center px-6 py-4 border-b-[1px] bg-neutral-50 shadow-md">
        <div className="font-semibold">
          Pedro Path Generator{" "}
          <sub className="font-extralight">by WATT's UP</sub>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center gap-4 p-2 w-full h-full">
        <div className="w-full max-w-4xl aspect-square bg-neutral-50 border-[1px] rounded-lg relative">
          <img
            alt="Field"
            src="/fields/centerstage.webp"
            className="absolute top-0 left-0 w-full h-full rotate-90 pointer-events-none rounded-lg"
          />
          <canvas
            className="absolute top-0 left-0 w-full h-full z-40 rounded-lg"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
        <ControlsTab
          linesState={[lines, setLines]}
          percentState={[percent, setPercent]}
          robotWidthState={[robotWidth, setRobotWidth]}
          robotHeightState={[robotHeight, setRobotHeight]}
          startPointState={[startPoint, setStartPoint]}
          playingState={[playing, setPlaying]}
          togglePlaying={togglePlaying}
        />
      </div>
    </div>
  );
}

export default App;
