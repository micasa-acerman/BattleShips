import _ from "lodash";
import { GRID_SEPARATOR_WIDTH, GRID_SIZE } from "../../constants/common";
import { IElement, Position, Size, Square } from "../../types";

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

export const isPointLocatedInArea = (area: IElement, point: Position) => {
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

export const isSquareLocatedInArea = (area: IElement, target: IElement) => {
  const areaSquare: Square = {
    minX: area.position.x,
    minY: area.position.y,
    maxX: area.position.x + area.size.width,
    maxY: area.position.y + area.size.height,
  };
  const targetSquare: Square = {
    minX: target.position.x,
    minY: target.position.y,
    maxX: target.position.x + target.size.width,
    maxY: target.position.y + target.size.height,
  };
  return (
    areaSquare.minX <= targetSquare.minX &&
    areaSquare.minY <= targetSquare.minY &&
    areaSquare.maxX >= targetSquare.maxX &&
    areaSquare.maxY >= targetSquare.maxY
  );
};

export const isCrossAreas = (source: IElement, target: IElement) => {
  const sourceSquare: Square = {
    minX: source.position.x,
    minY: source.position.y,
    maxX: source.position.x + source.size.width,
    maxY: source.position.y + source.size.height,
  };
  const targetSquare: Square = {
    minX: target.position.x,
    minY: target.position.y,
    maxX: target.position.x + target.size.width,
    maxY: target.position.y + target.size.height,
  };
  return !(
    sourceSquare.minX > targetSquare.maxX ||
    sourceSquare.maxX < targetSquare.minX ||
    sourceSquare.minY > targetSquare.maxY ||
    sourceSquare.maxY < targetSquare.minY
  );
};

export const isAvailableElementPosition = (
  accessibleArea: IElement,
  forbiddenSquares: IElement[],
  element: IElement
) => {
  return (
    isSquareLocatedInArea(accessibleArea, element) &&
    forbiddenSquares.filter((f) => {
      return isCrossAreas(f, element);
    }).length === 0
  );
};

const cartesian = (...a: Array<number[]>) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]] as Array<
    number[]
  >);

export const getAvailableElementPosition = (
  accessibleArea: IElement,
  forbiddenSquares: IElement[],
  element: IElement
): Position => {
  for (let i = 0; ; i++) {
    const rangeValidValuesOfX = _.range(
      Math.max(accessibleArea.position.x, element.position.x - i),
      Math.min(
        accessibleArea.position.x + accessibleArea.size.width,
        element.position.x + i + 1
      ),
      1
    );
    const rangeValidValuesOfY = _.range(
      Math.max(accessibleArea.position.y, element.position.y - i),
      Math.min(
        accessibleArea.position.y + accessibleArea.size.height,
        element.position.y + i + 1
      ),
      1
    );
    const availableСombinations = cartesian(
      rangeValidValuesOfX,
      rangeValidValuesOfY
    );
    const availableElement = availableСombinations
      .map(
        ([x, y]) =>
          ({
            ...element,
            position: {
              x,
              y,
            },
          } as IElement)
      )
      .find((element) => {
        return isAvailableElementPosition(
          accessibleArea,
          forbiddenSquares,
          element
        );
      });
    if (availableElement) return availableElement.position;
  }
};
