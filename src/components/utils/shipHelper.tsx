import {
  IBattleFieldElement,
  IElement,
  OrientationEnum,
  Position,
  TagTypeEnum,
} from "../../types/types";
import { v4 as uuid } from "uuid";
import { CSSProperties } from "react";
import LabelFields from "../LabelFields";
import * as R from "ramda";
import Hit from "../BattleField/HitPoint/HitPoint";
import MissPoint from "../BattleField/MissPoint/MissPoint";

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

    element: <div key={`${width}-${uuid()}`} className="ship"></div>,
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
    element: <Hit />,
  };
};

export const createTargetMiss = (position: Position): IBattleFieldElement => {
  return {
    id: `ship-miss-${uuid()}`,
    tag: TagTypeEnum.MISS,
    position,
    size: { width: 1, height: 1 },
    element: <MissPoint />,
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
