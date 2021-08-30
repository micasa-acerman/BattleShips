import { FC } from "react";
import { Position } from "../../types";
import { transformPositionFromCellsToPx } from "../utils/fieldHelper";

interface Props {
  gridSize?: number;
  labels: number[] | string[];
  position: Position;
}

const LabelFields: FC<Props> = ({ position, labels }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: transformPositionFromCellsToPx(position.x),
        left: transformPositionFromCellsToPx(position.y),
      }}
    ></div>
  );
};
export default LabelFields;
