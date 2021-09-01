import { GRID_SEPARATOR_WIDTH, GRID_SIZE } from "../../constants/common";
import { Position, Size, Square } from "../../types";

export const transformPositionFromCellsToPx = (cells: number): number =>
  cells * (GRID_SIZE + GRID_SEPARATOR_WIDTH);

export const transformSizeFromCellsToPx = (cells: number): number =>
  cells * GRID_SIZE + GRID_SEPARATOR_WIDTH * (cells - 1);

export const transformPositionFromPxToCells = (ps: number): number =>
  ps / (GRID_SIZE + GRID_SEPARATOR_WIDTH);

export const getCoords = (elem: HTMLDivElement, pageOffset: Position) => {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageOffset.y,
    left: box.left + pageOffset.x,
  };
};

export const isLocatedInArea = (
  area: {
    position: Position;
    size: Size;
  },
  point: Position
) => {
  const square: Square = {
    minX: area.position.x,
    minY: area.position.y,
    maxX: area.position.x + area.size.width,
    maxY: area.position.y + area.size.height,
  };
  return (
    point.x >= square.minX &&
    point.x < square.maxX &&
    point.y >= square.minY &&
    point.y < square.maxY
  );
};
