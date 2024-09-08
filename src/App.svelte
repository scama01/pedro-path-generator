<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import Two from "two.js";
  import type { Path } from "two.js/src/path";
  import type { Line as PathLine } from "two.js/src/shapes/line";
  import ControlTab from "./lib/ControlTab.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import {
    easeInOutQuad,
    getMousePos,
    getRandomColor,
    quadraticToCubic,
    radiansToDegrees,
    shortestRotation,
  } from "./utils";

  let two: Two;
  let twoElement: HTMLDivElement;

  let pointRadius = 1.15;
  let lineWidth = 0.57;
  let robotWidth = 19;
  let robotHeight = 18;

  let percent: number = 0;

  /**
   * Converter for X axis from inches to pixels.
   */
  $: x = d3
    .scaleLinear()
    .domain([0, 144])
    .range([0, twoElement?.clientWidth ?? 144]);

  /**
   * Converter for Y axis from inches to pixels.
   */
  $: y = d3
    .scaleLinear()
    .domain([0, 144])
    .range([twoElement?.clientHeight ?? 144, 0]);

  let lineGroup = new Two.Group();
  lineGroup.id = "line-group";
  let pointGroup = new Two.Group();
  pointGroup.id = "point-group";

  let startPoint: Point = {
    x: 9.757,
    y: 84.983,
    heading: "constant",
    degrees: 0,
  };
  let lines: Line[] = [
    {
      endPoint: { x: 36.668, y: 84.983, heading: "tangential", reverse: false },
      controlPoints: [],
      color: getRandomColor(),
    },
  ];

  $: points = (() => {
    let _points = [];
    let startPointElem = new Two.Circle(
      x(startPoint.x),
      y(startPoint.y),
      x(pointRadius)
    );
    startPointElem.id = `point-0-0`;
    startPointElem.fill = lines[0].color;
    startPointElem.noStroke();

    _points.push(startPointElem);

    lines.forEach((line, idx) => {
      [line.endPoint, ...line.controlPoints].forEach((point, idx1) => {
        let pointElem = new Two.Circle(x(point.x), y(point.y), x(pointRadius));
        pointElem.id = `point-${idx + 1}-${idx1}`;
        pointElem.fill = line.color;
        pointElem.noStroke();

        _points.push(pointElem);
      });
    });

    return _points;
  })();

  $: path = (() => {
    let _path: (Path | PathLine)[] = [];

    lines.forEach((line, idx) => {
      let _startPoint = idx === 0 ? startPoint : lines[idx - 1].endPoint;

      if (line.controlPoints.length > 0) {
        let cp1 = line.controlPoints[1]
          ? line.controlPoints[0]
          : quadraticToCubic(_startPoint, line.controlPoints[0], line.endPoint)
              .Q1;
        let cp2 =
          line.controlPoints[1] ??
          quadraticToCubic(_startPoint, line.controlPoints[0], line.endPoint)
            .Q2;

        let points = [
          new Two.Anchor(
            x(_startPoint.x),
            y(_startPoint.y),
            x(_startPoint.x),
            y(_startPoint.y),
            x(cp1.x),
            y(cp1.y),
            Two.Commands.move
          ),
          new Two.Anchor(
            x(line.endPoint.x),
            y(line.endPoint.y),
            x(cp2.x),
            y(cp2.y),
            x(line.endPoint.x),
            y(line.endPoint.y),
            Two.Commands.curve
          ),
        ];
        points.forEach((point) => (point.relative = false));

        let curveElem = new Two.Path(points);
        curveElem.id = `line-${idx + 1}`;
        curveElem.automatic = false;
        curveElem.stroke = line.color;
        curveElem.linewidth = x(lineWidth);
        curveElem.noFill();

        _path.push(curveElem);
      } else {
        let lineElem = new Two.Line(
          x(_startPoint.x),
          y(_startPoint.y),
          x(line.endPoint.x),
          y(line.endPoint.y)
        );
        lineElem.id = `line-${idx + 1}`;
        lineElem.stroke = line.color;
        lineElem.linewidth = x(lineWidth);
        lineElem.noFill();

        _path.push(lineElem);
      }
    });

    return _path;
  })();

  let robotXY: BasePoint = { x: 0, y: 0 };
  let robotHeading: number = 0;

  $: {
    let currentLineIdx = (lines.length * Math.min(percent, 99.999999999)) / 100;
    let currentLinePath =
      path[Math.min(Math.trunc(currentLineIdx), path.length - 1)];
    let currentLine =
      lines[Math.min(Math.trunc(currentLineIdx), lines.length - 1)];

    let linePercent = easeInOutQuad(
      currentLineIdx - Math.floor(currentLineIdx)
    );
    robotXY = currentLinePath.getPointAt(linePercent) as BasePoint;

    switch (currentLine.endPoint.heading) {
      case "linear":
        robotHeading = -shortestRotation(
          currentLine.endPoint.startDeg,
          currentLine.endPoint.endDeg,
          linePercent
        );
        break;
      case "constant":
        robotHeading = -currentLine.endPoint.degrees;
        break;
      case "tangential":
        const nextPoint = currentLinePath.getPointAt(
          linePercent + (currentLine.endPoint.reverse ? -0.01 : 0.01)
        );

        const dx = nextPoint.x - robotXY.x;
        const dy = nextPoint.y - robotXY.y;

        if (dx !== 0 || dy !== 0) {
          const angle = Math.atan2(dy, dx);

          robotHeading = radiansToDegrees(angle);
        }

        break;
    }
  }

  $: (() => {
    if (!two) {
      return;
    }

    two.renderer.domElement.style["z-index"] = "30";
    two.renderer.domElement.style["position"] = "absolute";
    two.renderer.domElement.style["top"] = "0px";
    two.renderer.domElement.style["left"] = "0px";
    two.renderer.domElement.style["width"] = "100%";
    two.renderer.domElement.style["height"] = "100%";

    two.clear();

    two.add(...path);
    two.add(...points);

    two.update();
  })();

  let playing = false;

  let animationFrame: number;
  let startTime: number | null = null;
  let previousTime: number | null = null;

  function animate(timestamp: number) {
    if (!startTime) {
      startTime = timestamp;
    }

    if (previousTime !== null) {
      const deltaTime = timestamp - previousTime;

      if (percent >= 100) {
        percent = 0;
      } else {
        percent += (0.65 / lines.length) * (deltaTime * 0.1);
      }
    }

    previousTime = timestamp;

    if (playing) {
      requestAnimationFrame(animate);
    }
  }

  function play() {
    if (!playing) {
      playing = true;
      startTime = null;
      previousTime = null;
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function pause() {
    console.log("pause");
    playing = false;
    cancelAnimationFrame(animationFrame);
  }

  onMount(() => {
    two = new Two({
      fitted: true,
      type: Two.Types.svg,
    }).appendTo(twoElement);

    let currentElem: string | null = null;
    let isDown = false;

    two.renderer.domElement.addEventListener("mousemove", (evt: MouseEvent) => {
      const elem = document.elementFromPoint(evt.clientX, evt.clientY);
      if (isDown && currentElem) {
        const line = Number(currentElem.split("-")[1]) - 1;
        const point = Number(currentElem.split("-")[2]);

        const { x: xPos, y: yPos } = getMousePos(evt, two.renderer.domElement);

        if (line === -1) {
          startPoint.x = x.invert(xPos);
          startPoint.y = y.invert(yPos);
        } else {
          if (point === 0) {
            lines[line].endPoint.x = x.invert(xPos);
            lines[line].endPoint.y = y.invert(yPos);
          } else {
            lines[line].controlPoints[point - 1].x = x.invert(xPos);
            lines[line].controlPoints[point - 1].y = y.invert(yPos);
          }
        }
      } else {
        if (elem?.id.startsWith("point")) {
          two.renderer.domElement.style.cursor = "pointer";
          currentElem = elem.id;
        } else {
          two.renderer.domElement.style.cursor = "auto";
          currentElem = null;
        }
      }
    });
    two.renderer.domElement.addEventListener("mousedown", () => {
      isDown = true;
    });
    two.renderer.domElement.addEventListener("mouseup", () => {
      isDown = false;
    });
  });

  document.addEventListener("keydown", function (evt) {
    if (evt.code === "Space" && document.activeElement === document.body) {
      if (playing) {
        pause();
      } else {
        play();
      }
    }
  });
</script>

<Navbar />
<div
  class="w-screen h-screen pt-20 p-2 flex flex-row justify-center items-center gap-2"
>
  <div class="flex h-full justify-center items-center">
    <div
      bind:this={twoElement}
      class="h-full aspect-square rounded-lg shadow-md bg-neutral-50 dark:bg-neutral-900 relative overflow-clip"
    >
      <img
        src="/fields/intothedeeprotated.webp"
        alt="Field"
        class="absolute top-0 left-0 w-full h-full rounded-lg z-10 pointer-events-none"
      />
      <img
        src={"/robot.png"}
        width={x(robotWidth)}
        height={x(robotHeight)}
        alt="Robot"
        style={`position: absolute; top: ${robotXY.y}px; left: ${robotXY.x}px; transform: translate(-50%, -50%) rotate(${robotHeading}deg); z-index: 20; width: ${x(robotWidth)}px; height: ${x(robotHeight)}px;`}
      />
    </div>
  </div>
  <ControlTab
    bind:playing
    {play}
    {pause}
    bind:startPoint
    bind:lines
    bind:robotWidth
    bind:robotHeight
    bind:percent
    bind:robotXY
    bind:robotHeading
    {x}
    {y}
  />
</div>
