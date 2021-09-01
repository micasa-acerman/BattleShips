import { MouseEvent, ReactElement, useRef, useState } from "react";
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
  onMove?: (element: IBattleFieldElement[]) => void;
  onClickElement?: (element: IBattleFieldElement) => void;
  onClickEmptyCell?: (
    position: Position,
    event: MouseEvent<HTMLDivElement>
  ) => void;
}

interface IDragElement extends Position {
  elementId: string;
  shiftX: number;
  shiftY: number;
}

export default function BattleFieldManager({
  size,
  elements,
  onMove,
  onClickElement,
  onClickEmptyCell,
}: Props): ReactElement {
  const [dragElement, setDragElement] = useState<IDragElement>();
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={gridRef}
      className="grid"
      style={{
        width: transformPositionFromCellsToPx(size.width),
        height: transformPositionFromCellsToPx(size.height),
      }}
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onClickEmptyCell &&
          onClickEmptyCell(
            {
              x: Math.floor(
                transformPositionFromPxToCells(
                  event.clientX -
                    (gridRef.current?.getBoundingClientRect().left ?? 0)
                )
              ),
              y: Math.floor(
                transformPositionFromPxToCells(
                  event.clientY -
                    (gridRef.current?.getBoundingClientRect().top ?? 0)
                )
              ),
            },
            event
          );
      }}
    >
      {elements.map((el) => (
        <div
          key={el.id}
          onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
            console.log(e.target);
            el.draggable &&
              setDragElement({
                elementId: el.id,
                shiftX:
                  e.clientX - e.currentTarget.getBoundingClientRect().left,
                shiftY: e.clientY - e.currentTarget.getBoundingClientRect().top,
                x:
                  e.clientX -
                  (gridRef.current?.getBoundingClientRect().left ?? 0),
                y:
                  e.clientY -
                  (gridRef.current?.getBoundingClientRect().top ?? 0),
              });
          }}
          onMouseMove={(e: MouseEvent<HTMLDivElement>) => {
            if (dragElement?.elementId === el.id) {
              setDragElement({
                ...dragElement,
                x:
                  e.clientX -
                  (gridRef.current?.getBoundingClientRect().left ?? 0),
                y:
                  e.clientY -
                  (gridRef.current?.getBoundingClientRect().top ?? 0),
              });
            }
          }}
          onMouseUp={() => {
            const newElements = elements.map((el) =>
              el.id === dragElement?.elementId
                ? {
                    ...el,
                    position: {
                      x: Math.round(
                        transformPositionFromPxToCells(
                          dragElement.x - dragElement.shiftX
                        )
                      ),
                      y: Math.round(
                        transformPositionFromPxToCells(
                          dragElement.y - dragElement.shiftY
                        )
                      ),
                    },
                  }
                : el
            );
            onMove && onMove(newElements);
            console.log(newElements[0].position);
            setDragElement(undefined);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClickElement && onClickElement(el);
          }}
          style={{
            position: "absolute",
            width: transformSizeFromCellsToPx(el.size.width),
            height: transformSizeFromCellsToPx(el.size.height),
            top:
              dragElement?.elementId === el.id
                ? dragElement.y - dragElement.shiftY
                : transformPositionFromCellsToPx(el.position.y),
            left:
              dragElement?.elementId === el.id
                ? dragElement.x - dragElement.shiftX
                : transformPositionFromCellsToPx(el.position.x),
          }}
        >
          {el.element}
        </div>
      ))}
    </div>
  );
}
