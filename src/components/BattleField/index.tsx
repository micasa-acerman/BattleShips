import { MouseEvent, ReactElement, useEffect, useRef, useState } from "react";
import {
  IBattleFieldElement,
  IElement,
  Position,
  Size,
  TagTypeEnum,
} from "../../types";
import {
  getAvailableElementPosition,
  transformPositionFromCellsToPx,
  transformPositionFromPxToCells,
  transformSizeFromCellsToPx,
} from "../utils/fieldHelper";
import "./BattleField.css";

interface Props {
  size: Size;
  elements: IBattleFieldElement[];
  onMove?: (element: IBattleFieldElement, position: Position) => void;
  onDoubleClickElement?: (element: IBattleFieldElement) => void;
  onClickEmptyCell?: (
    position: Position,
    event: MouseEvent<HTMLDivElement>
  ) => void;
}

interface IDragElement extends IElement {
  elementId: string;
  shiftX: number;
  shiftY: number;
}

export default function BattleFieldManager({
  size,
  elements,
  onMove,
  onDoubleClickElement,
  onClickEmptyCell,
}: Props): ReactElement {
  const gridRef = useRef<HTMLDivElement>(null);
  const mouseMoveCallbackRef = useRef(handleElementMouseMove);
  const mouseUpCallbackRef = useRef(handleElementMouseUp);
  const [dragElement, setDragElement] = useState<IDragElement>();
  const availableArea: IElement = {
    position: {
      x: 1,
      y: 1,
    },
    size: {
      width: size.width - 1,
      height: size.height - 1,
    },
  };

  useEffect(() => {
    mouseMoveCallbackRef.current = handleElementMouseMove;
    mouseUpCallbackRef.current = handleElementMouseUp;
  });

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent<HTMLDivElement>) =>
      mouseUpCallbackRef.current();
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void =>
      mouseMoveCallbackRef.current(e);
    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("mouseup", handleMouseUp as any);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("mouseup", handleMouseUp as any);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid"
      style={{
        width: transformPositionFromCellsToPx(size.width),
        height: transformPositionFromCellsToPx(size.height),
      }}
      onClick={handleClickGrid}
    >
      {elements.map((el) => (
        <div
          key={el.id}
          onMouseDown={handleElementMouseDown(el)}
          onDoubleClick={handleElementDblClick(el)}
          style={{
            position: "absolute",
            width: transformSizeFromCellsToPx(el.size.width),
            height: transformSizeFromCellsToPx(el.size.height),
            top:
              dragElement?.elementId === el.id
                ? dragElement.position.y
                : transformPositionFromCellsToPx(el.position.y),
            left:
              dragElement?.elementId === el.id
                ? dragElement.position.x
                : transformPositionFromCellsToPx(el.position.x),
          }}
        >
          {el.element}
        </div>
      ))}
    </div>
  );

  function handleElementMouseUp() {
    const draggableElement = elements.find(
      (el) => el.id === dragElement?.elementId
    );
    if (draggableElement && dragElement) {
      onMove &&
        onMove(draggableElement, {
          x: Math.floor(transformPositionFromPxToCells(dragElement.position.x)),
          y: Math.floor(transformPositionFromPxToCells(dragElement.position.y)),
        });
    }
    setDragElement(undefined);
  }

  function handleClickGrid(event: MouseEvent<HTMLDivElement>) {
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
  }

  function handleElementDblClick(el: IBattleFieldElement) {
    return (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onDoubleClickElement && onDoubleClickElement(el);
    };
  }

  function handleElementMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (dragElement) {
      const newPosition = getAvailableElementPosition(
        availableArea,
        elements.filter(
          (e) => e.id !== dragElement.elementId && e.tag === TagTypeEnum.SHIP
        ),
        {
          ...dragElement,
          position: {
            x: Math.floor(
              transformPositionFromPxToCells(
                e.clientX -
                  dragElement.shiftX -
                  (gridRef.current?.getBoundingClientRect().left ?? 0)
              )
            ),
            y: Math.floor(
              transformPositionFromPxToCells(
                e.clientY -
                  dragElement.shiftY -
                  (gridRef.current?.getBoundingClientRect().top ?? 0)
              )
            ),
          },
        }
      );
      setDragElement({
        ...dragElement,
        position: {
          x: transformPositionFromCellsToPx(newPosition.x),
          y: transformPositionFromCellsToPx(newPosition.y),
        },
      });
    }
  }

  function handleElementMouseDown(el: IBattleFieldElement) {
    return (e: MouseEvent<HTMLDivElement>) => {
      if (el.draggable) {
        const shiftX = transformPositionFromCellsToPx(
          Math.floor(transformPositionFromPxToCells(
            e.clientX - e.currentTarget.getBoundingClientRect().left
          ))
        );
        const shiftY = transformPositionFromCellsToPx(
          Math.floor(transformPositionFromPxToCells(
            e.clientY - e.currentTarget.getBoundingClientRect().top
          ))
        );

        const newPosition = getAvailableElementPosition(
          availableArea,
          elements.filter((e) => e.id !== el.id && e.tag === TagTypeEnum.SHIP),
          {
            ...el,
            position: {
              x: Math.floor(
                transformPositionFromPxToCells(
                  e.clientX -
                    shiftX -
                    (gridRef.current?.getBoundingClientRect().left ?? 0)
                )
              ),
              y: Math.floor(
                transformPositionFromPxToCells(
                  e.clientY -
                    shiftY -
                    (gridRef.current?.getBoundingClientRect().top ?? 0)
                )
              ),
            },
          }
        );
        setDragElement({
          elementId: el.id,
          shiftX,
          shiftY,
          size: el.size,
          position: {
            x: transformPositionFromCellsToPx(newPosition.x),
            y: transformPositionFromCellsToPx(newPosition.y),
          },
        });
      }
    };
  }
}
