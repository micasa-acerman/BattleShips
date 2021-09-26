import { GRID_SIZE } from "../../../constants/common";

export default function HitPoint() {
  return (
    <div
      style={{
        width: GRID_SIZE,
        height: GRID_SIZE,
        fontSize: GRID_SIZE,
        lineHeight: "1em",
        textAlign: "center",
        color: "#d12e6f",
      }}
    >
      x
    </div>
  );
}
