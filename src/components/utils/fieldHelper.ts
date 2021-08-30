import { GRID_SEPARATOR_WIDTH, GRID_SIZE } from "../../constants/common";

export const transformPositionFromCellsToPx = (cells: number): number =>
  cells * (GRID_SIZE + GRID_SEPARATOR_WIDTH);

export const transformSizeFromCellsToPx = (cells: number): number =>
  cells * GRID_SIZE + GRID_SEPARATOR_WIDTH * (cells - 1);

export const transformPositionFromPxToCells = (ps: number): number =>
  ps / (GRID_SIZE + GRID_SEPARATOR_WIDTH);
