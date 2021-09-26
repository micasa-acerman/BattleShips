import { GRID_SIZE } from "../../../constants/common";

export default function MissPoint() {
  return (
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
  );
}
