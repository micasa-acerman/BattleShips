import { MouseEvent, ReactElement, useEffect, useRef, useState } from "react";
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
  const gridRef = useRef<HTMLDivElement>(null);
  const mouseMoveCallbackRef = useRef(handleElementMouseMove);
  const mouseUpCallbackRef = useRef(handleElementMouseUp);
  const [dragElement, setDragElement] = useState<IDragElement>();
  useEffect(()=>{
    mouseMoveCallbackRef.current = handleElementMouseMove
    mouseUpCallbackRef.current = handleElementMouseUp
  })

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent<HTMLDivElement>) =>
      mouseUpCallbackRef.current();
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>):void =>
      mouseMoveCallbackRef.current(e);
    document.addEventListener('mousemove',handleMouseMove as any);
    document.addEventListener('mouseup',handleMouseUp as any);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any)
      document.removeEventListener('mouseup', handleMouseUp as any)
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
          onClick={handleElementClick(el)}
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

  function handleElementMouseUp() {
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

  function handleElementClick(el: IBattleFieldElement) {
    return (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onClickElement && onClickElement(el);
    };
  }

  function handleElementMouseMove(e: MouseEvent<HTMLDivElement>) {
    console.log(dragElement)
    if (dragElement)
      setDragElement({
        ...dragElement,
        x: e.clientX - (gridRef.current?.getBoundingClientRect().left ?? 0),
        y: e.clientY - (gridRef.current?.getBoundingClientRect().top ?? 0),
      });
  }

  function handleElementMouseDown(el: IBattleFieldElement) {
    return (e: MouseEvent<HTMLDivElement>) => {
      el.draggable &&
        setDragElement({
          elementId: el.id,
          shiftX: e.clientX - e.currentTarget.getBoundingClientRect().left,
          shiftY: e.clientY - e.currentTarget.getBoundingClientRect().top,
          x: e.clientX - (gridRef.current?.getBoundingClientRect().left ?? 0),
          y: e.clientY - (gridRef.current?.getBoundingClientRect().top ?? 0),
        });
    };
  }
}
