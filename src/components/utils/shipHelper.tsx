import {
  IBattleFieldElement,
  IElement,
  OrientationEnum,
  Position,
  TagTypeEnum,
} from "../../types";
import { v4 as uuid } from "uuid";
import { CSSProperties } from "react";
import LabelFields from "../LabelFields";
import * as R from "ramda";
import { GRID_SIZE } from "../../constants/common";

export const createShip = (
  width: number,
  orientation: OrientationEnum,
  position: Position,
  options?: { styles?: CSSProperties }
): IBattleFieldElement => {
  return {
    id: `ship-${width}-${uuid()}`,
    tag: TagTypeEnum.SHIP,
    position,
    size:
      orientation === OrientationEnum.HORIZONTAL
        ? { width, height: 1 }
        : { width: 1, height: width },
    draggable: true,

    element: (
      <div
        style={{
          background: "rgba(0,0,0,.25)",
          width: "100%",
          height: "100%",
          ...options?.styles,
        }}
      ></div>
    ),
  };
};

export const createLabels = (): IBattleFieldElement[] => {
  return [
    {
      id: "labelsH",
      tag: TagTypeEnum.HUD,
      position: { x: 1, y: 0 },
      size: { width: 10, height: 1 },
      element: (
        <LabelFields
          labels={R.times(
            (i) => String.fromCharCode("А".charCodeAt(0) + i),
            10
          )}
          orientation={OrientationEnum.HORIZONTAL}
        />
      ),
    },
    {
      id: "labelsV",
      tag: TagTypeEnum.HUD,
      position: { x: 0, y: 1 },
      size: { width: 1, height: 10 },
      element: (
        <LabelFields
          labels={R.times((i) => i + 1, 10)}
          orientation={OrientationEnum.VERTICAL}
        />
      ),
    },
  ];
};

export const createTargetHit = (position: Position): IBattleFieldElement => {
  return {
    id: `ship-hit-${uuid()}`,
    tag: TagTypeEnum.HIT,
    position,
    size: { width: 1, height: 1 },
    element: (
      <div
        style={{
          width: GRID_SIZE,
          height: GRID_SIZE,
          fontSize: GRID_SIZE,
          lineHeight: "1em",
          textAlign: "center",
          color: '#d12e6f'
        }}
      >
        x
      </div>
    ),
  };
};

export const createTargetMiss = (position: Position): IBattleFieldElement => {
  return {
    id: `ship-miss-${uuid()}`,
    tag: TagTypeEnum.MISS,
    position,
    size: { width: 1, height: 1 },
    element: (
      <div
        style={{
          width: GRID_SIZE,
          height: GRID_SIZE,
          fontSize: GRID_SIZE,
          lineHeight: "1em",
          textAlign: "center",
        }}
      >
        •
      </div>
    ),
  };
};

export const getCountElementsByTags = (
  elements: IBattleFieldElement[],
  tags: TagTypeEnum[]
): number => {
  return elements.filter((e) => tags.includes(e.tag)).length;
};

export const getCountPlayerFieldsCells = (elements: IBattleFieldElement[]) => {
  return getCountPlayerShips(
    elements.filter((e) => e.tag === TagTypeEnum.SHIP)
  );
};
export const getCountPlayerShips = (elements: IElement[]) => {
  return elements
    .map((e) => e.size.width * e.size.height)
    .reduce((p, c) => p + c, 0);
};
