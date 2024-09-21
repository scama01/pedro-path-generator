export * from "./draw";
export * from "./math";

export const DPI = 96 / 5;

export const titleCase = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
