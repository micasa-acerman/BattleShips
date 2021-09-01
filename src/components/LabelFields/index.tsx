import { FC } from "react";
import { GRID_SIZE } from "../../constants/common";
import { OrientationEnum } from "../../types";

interface Props {
  labels: number[] | string[];
  orientation: OrientationEnum;
}

const LabelFields: FC<Props> = ({ labels, orientation }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: orientation,
        justifyContent: "space-evenly",
        width: "100%",
        height: "100%",
      }}
    >
      {labels.map((label) => (
        <div
          key={label}
          style={{
            width: GRID_SIZE,
            height: GRID_SIZE,
            textAlign: "center",
            lineHeight: '1em',
            fontSize: GRID_SIZE
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};
export default LabelFields;
