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
export interface IBattleFieldElement {
  id: string;
  position: Position;
  size: Size;
  element: React.ReactNode;
}
interface IShadow {
  
}
