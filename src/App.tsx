import { useState } from "react";
import BattleField from "./components/BatteField";
import Shadow from "./components/Shadow";
import { IBattleFieldElement } from "./types";

const defaultElements = [
  {
    id: "test",
    position: { x: 1, y: 1 },
    size: { width: 5, height: 1 },
    element: (
      <div
        style={{
          background: "rgba(0,0,0,.25)",
          width: "100%",
          height: "100%",
        }}
      ></div>
    ),
  },
];

function App() {
  const [elements, setElements] =
    useState<IBattleFieldElement[]>(defaultElements);
  const [shadow, setShadow] = useState<IBattleFieldElement>();

  return (
    <BattleField
      elements={shadow ? [...elements, shadow] : elements}
      size={{ width: 10, height: 10 }}
      handleDragStart={(el, position) => {
        setShadow({
          ...el,
          position,
          element: <Shadow />,
        });
      }}
      handleDrag={(el, position) => {
        setShadow({
          ...el,
          position,
          element: <Shadow />,
        });
      }}
      handleDragEnd={(el, position) => {
        setShadow(undefined);
        setElements(
          elements.map((item) =>
            item.id === el.id
              ? {
                  ...item,
                  position,
                }
              : item
          )
        );
      }}
    />
  );
}

export default App;
