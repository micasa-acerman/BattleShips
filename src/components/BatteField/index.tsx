import { ReactElement } from "react";
import { IBattleFieldElement, Position, Size } from "../../types";
import {
  transformPositionFromCellsToPx,
  transformPositionFromPxToCells,
  transformSizeFromCellsToPx,
} from "../utils/fieldHelper";
import "./BattleField.css";

interface Props {
  size: Size;
  elements: IBattleFieldElement[];
  handleDrag(element: IBattleFieldElement, position: Position): void;
  handleDragEnd(element: IBattleFieldElement, position: Position): void;
  handleDragStart(element: IBattleFieldElement, position: Position): void;
}

export default function BattleField({
  size,
  elements,
  handleDrag,
  handleDragStart,
  handleDragEnd,
}: Props): ReactElement {
  return (
    <div
      className="grid"
      style={{
        width: transformPositionFromCellsToPx(size.width),
        height: transformPositionFromCellsToPx(size.height),
      }}
    >
      {elements.map((el) => (
        <div
          key={el.id}
          draggable
          onDragStart={(ev) => {
            handleDragStart(el, {
              x: Math.floor(transformPositionFromPxToCells(ev.pageX)),
              y: Math.floor(transformPositionFromPxToCells(ev.pageY)),
            });
          }}
          onDrag={(ev) => {
            handleDrag(el, {
              x: Math.floor(transformPositionFromPxToCells(ev.pageX)),
              y: Math.floor(transformPositionFromPxToCells(ev.pageY)),
            });
          }}
          onDragEnd={(ev) => {
            handleDragEnd(el, {
              x: Math.floor(transformPositionFromPxToCells(ev.pageX)),
              y: Math.floor(transformPositionFromPxToCells(ev.pageY)),
            });
          }}
          style={{
            position: "absolute",
            width: transformSizeFromCellsToPx(el.size.width),
            height: transformSizeFromCellsToPx(el.size.height),
            top: transformPositionFromCellsToPx(el.position.y),
            left: transformPositionFromCellsToPx(el.position.x),
          }}
        >
          {el.element}
        </div>
      ))}
    </div>
  );
}
