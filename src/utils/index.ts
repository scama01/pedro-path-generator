export * from "./draw";
export * from "./math";

export function getMousePos(evt: MouseEvent, canvas: HTMLCanvasElement) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
}
