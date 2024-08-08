import _ from "lodash";
import { getRandomColor } from "../utils";

function ControlsTab({
  robotWidthState: [robotWidth, setRobotWidth],
  startPointState: [startPoint, setStartPoint],
  linesState: [lines, setLines],
  percentState: [percent, setPercent],
  playingState: [playing],
  togglePlaying,
}: {
  robotWidthState: [number, React.Dispatch<React.SetStateAction<number>>];
  startPointState: [Point, React.Dispatch<React.SetStateAction<Point>>];
  linesState: [Line[], React.Dispatch<React.SetStateAction<Line[]>>];
  percentState: [number, React.Dispatch<React.SetStateAction<number>>];
  playingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  togglePlaying: () => any;
}) {
  return (
    <div className="h-full w-full flex-1 flex flex-col gap-2 justify-center items-center">
      <div className="max-h-[calc(80vh)] w-full bg-neutral-50 border-[1px] rounded-lg flex flex-col justify-start items-start p-4 gap-6 shadow-lg overflow-y-scroll">
        <div className="flex flex-col w-full justify-start items-start gap-0.5 text-sm">
          <div className="font-semibold ">Canvas Options</div>
          <div className="flex flex-row justify-start items-center gap-2">
            <div className="font-extralight">Robot Width:</div>
            <input
              type="number"
              className="pl-1.5 rounded-md bg-neutral-100 border-[0.5px] focus:outline-none w-16"
              step="1"
              value={robotWidth}
              onChange={(e) => {
                setRobotWidth(parseFloat(e.target.value));
              }}
            />
          </div>
        </div>

        <div className="flex flex-col w-full justify-start items-start gap-0.5">
          <div className="font-semibold">Start Point</div>
          <div className="flex flex-row justify-start items-center gap-2">
            <div className="font-extralight">X:</div>
            <input
              type="number"
              className="pl-1.5 rounded-md bg-neutral-100 border-[0.5px] focus:outline-none w-28"
              step="0.1"
              value={startPoint.x}
              onChange={(e) => {
                setStartPoint((_startPoint) => ({
                  ..._startPoint,
                  x: parseFloat(e.target.value),
                }));
              }}
            />
            <div className="font-extralight">Y:</div>
            <input
              type="number"
              className="pl-1.5 rounded-md bg-neutral-100 border-[0.5px] focus:outline-none w-28"
              step="0.1"
              value={startPoint.y}
              onChange={(e) => {
                setStartPoint((_startPoint) => ({
                  ..._startPoint,
                  y: parseFloat(e.target.value),
                }));
              }}
            />
          </div>
        </div>

        {lines.map((line, idx) => (
          <div className="flex flex-col w-full justify-start items-start gap-1">
            <div className="flex flex-row w-full justify-between">
              <div className="font-semibold flex flex-row justify-start items-center gap-2">
                <p>Line {idx + 1}</p>
                <div
                  className="size-2.5 rounded-full shadow-md"
                  style={{ background: line.color }}
                />
              </div>
              <div className="flex flex-row justify-end items-center gap-1">
                {line.controlPoints.length < 2 ? (
                  <button
                    title="Add Control Point"
                    onClick={() => {
                      let _lines = [...lines];
                      _lines[idx].controlPoints.push({
                        isDragging: false,
                        x: _.random(0, 144),
                        y: _.random(0, 144),
                      });
                      setLines(_lines);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      className="size-5 stroke-green-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                ) : (
                  <></>
                )}
                {lines.length > 1 ? (
                  <button
                    title="Remove Line"
                    onClick={() => {
                      let _lines = [...lines];
                      _lines.splice(idx, 1);
                      setLines(_lines);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      className="size-5 stroke-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div
              className={`h-[0.75px] w-full`}
              style={{ background: line.color }}
            />
            <div className="flex flex-col justify-start items-start">
              <div className="font-light">End Point: </div>
              <div className="flex flex-row justify-start items-center gap-2">
                <div className="font-extralight">X:</div>
                <input
                  className="pl-1.5 rounded-md bg-neutral-100 border-[0.5px] focus:outline-none w-28"
                  step="0.1"
                  type="number"
                  value={line.endPoint.x}
                  onChange={(e) => {
                    let _lines = [...lines];
                    _lines[idx].endPoint.x = parseFloat(e.target.value);
                    setLines(_lines);
                  }}
                />
                <div className="font-extralight">Y:</div>
                <input
                  className="pl-1.5 rounded-md bg-neutral-100 border-[0.5px] focus:outline-none w-28"
                  step="0.1"
                  type="number"
                  value={line.endPoint.y}
                  onChange={(e) => {
                    let _lines = [...lines];
                    _lines[idx].endPoint.y = parseFloat(e.target.value);
                    setLines(_lines);
                  }}
                />
                <div className="font-extralight">Heading:</div>
                <input
                  className="pl-1.5 rounded-md bg-neutral-100 border-[0.5px] focus:outline-none w-14"
                  step="1"
                  type="number"
                  value={line.endPoint.heading}
                  onChange={(e) => {
                    let _lines = [...lines];
                    _lines[idx].endPoint.heading = parseFloat(e.target.value);
                    setLines(_lines);
                  }}
                />
              </div>
            </div>
            {line.controlPoints.map((_, idx1) => (
              <div className="flex flex-col justify-start items-start">
                <div className="font-light">Control Point {idx1 + 1}: </div>
                <div className="flex flex-row justify-start items-center gap-2">
                  <div className="font-extralight">X:</div>
                  <input
                    className="pl-1.5 rounded-md bg-neutral-100 border-[0.5px] focus:outline-none w-28"
                    step="0.1"
                    type="number"
                    value={line.controlPoints[idx1].x}
                    onChange={(e) => {
                      let _lines = [...lines];
                      _lines[idx].controlPoints[idx1].x = parseFloat(
                        e.target.value
                      );
                      setLines(_lines);
                    }}
                  />
                  <div className="font-extralight">Y:</div>
                  <input
                    className="pl-1.5 rounded-md bg-neutral-100 border-[0.5px] focus:outline-none w-28"
                    step="0.1"
                    type="number"
                    value={line.controlPoints[idx1].y}
                    onChange={(e) => {
                      let _lines = [...lines];
                      _lines[idx].controlPoints[idx1].y = parseFloat(
                        e.target.value
                      );
                      setLines(_lines);
                    }}
                  />
                  <button
                    title="Remove Control Point"
                    onClick={() => {
                      let _lines = [...lines];
                      _lines[idx].controlPoints.splice(idx1, 1);
                      setLines(_lines);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      className="size-5 stroke-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        <button
          className="font-semibold text-green-500 text-sm flex flex-row justify-start items-center gap-1"
          onClick={() => {
            let _lines = [...lines];
            _lines.push({
              endPoint: {
                isDragging: false,
                x: _.random(0, 144),
                y: _.random(0, 144),
                heading: _lines[_lines.length - 1].endPoint.heading,
              },
              controlPoints: [],
              color: getRandomColor(),
            });
            setLines(_lines);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <p>Add Line</p>
        </button>
      </div>
      <div className="w-full bg-neutral-50 border-[1px] rounded-lg p-3 flex flex-row justify-start items-center gap-3 shadow-lg">
        <button
          title="Play/Pause"
          onClick={() => {
            togglePlaying();
          }}
        >
          {playing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-6 stroke-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              className="size-6 stroke-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          )}
        </button>
        <input
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          type="range"
          min="0"
          max="1000"
          className="w-full appearance-none slider focus:outline-none"
        />
      </div>
    </div>
  );
}

export default ControlsTab;
