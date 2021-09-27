import React from "react";

export type Size = {
  width: number;
  height: number;
};
export type Square = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};
export type Position = {
  x: number;
  y: number;
};
export interface IElement {
  position: Position;
  size: Size;
}
export interface IBattleFieldElement extends IElement {
  id: string;
  element: React.ReactNode;
  draggable?: Boolean;
  tag: TagTypeEnum;
}
export enum OrientationEnum {
  HORIZONTAL = "row",
  VERTICAL = "column",
}

export enum GameStageEnum {
  START,
  TURN_PLAYER,
  TURN_ENEMY,
  PLAYER_WIN,
  PLAYER_LOSE,
}
export enum TagTypeEnum {
  SHIP = "ship",
  HIT = "hit",
  MISS = "miss",
  HUD = "hud",
}
