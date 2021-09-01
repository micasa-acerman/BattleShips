import * as R from "ramda";
import { useEffect, useState } from "react";
import {
  IBattleFieldElement,
  IShip,
  OrientationEnum,
  GameStageEnum,
  Position,
  TagTypeEnum,
} from "../../types";
import BattleField from "../BattleField";
import { isLocatedInArea } from "../utils/fieldHelper";
import {
  createLabels,
  createShip,
  createTargetHit,
  createTargetMiss,
  getCountElementsByTags,
  getCountPlayerFieldsCells,
  getCountPlayerShips,
} from "../utils/shipHelper";

const defaultElements: IBattleFieldElement[] = [
  createShip(4, OrientationEnum.HORIZONTAL, { x: 2, y: 2 }),
  createShip(3, OrientationEnum.VERTICAL, { x: 6, y: 2 }),
  ...createLabels(),
];

function GameManager() {
  const [playerItems, setPlayerItems] =
    useState<IBattleFieldElement[]>(defaultElements);
  const [enemyItems, setEnemyItems] = useState<IBattleFieldElement[]>(
    createLabels()
  );
  const [gameStage, setGameStage] = useState<GameStageEnum>(
    GameStageEnum.START
  );
  const [enemy, setEnemy] = useState<IShip[]>([
    {
      position: { x: 1, y: 1 },
      size: { width: 4, height: 1 },
    },
  ]);
  useEffect(() => {
    if (gameStage === GameStageEnum.TURN_ENEMY) {
      while (true) {
        const hitCell: Position = {
          x: Math.floor(Math.random() * 10) + 1,
          y: Math.floor(Math.random() * 10) + 1,
        };
        const markInPoint = !!playerItems.find(
          (s) =>
            isLocatedInArea(s, hitCell) &&
            [TagTypeEnum.HIT, TagTypeEnum.MISS].includes(s.tag)
        );
        const shipInPoint = !!playerItems.find(
          (s) => isLocatedInArea(s, hitCell) && s.tag === TagTypeEnum.SHIP
        );

        if (!markInPoint) {
          setPlayerItems([
            ...playerItems,
            shipInPoint ? createTargetHit(hitCell) : createTargetMiss(hitCell),
          ]);
          if (
            playerItems.filter((s) => s.tag === TagTypeEnum.HIT).length +
              +!!shipInPoint ===
            getCountPlayerFieldsCells(playerItems)
          )
            setGameStage(GameStageEnum.PLAYER_LOSE);
          else setGameStage(GameStageEnum.TURN_PLAYER);
          break;
        }
      }
    }
  }, [gameStage]);

  const handleClickEmptyEnemyCell = (pos: Position) => {
    if (gameStage === GameStageEnum.TURN_PLAYER) {
      const shipInPoint = !!enemy.find((s) => isLocatedInArea(s, pos));
      const objectInPoint = !!enemyItems.find((s) => isLocatedInArea(s, pos));
      if (!objectInPoint) {
        setEnemyItems([
          ...enemyItems,
          shipInPoint ? createTargetHit(pos) : createTargetMiss(pos),
        ]);
        if (
          enemyItems.filter((s) => s.tag === TagTypeEnum.HIT).length +
            +shipInPoint ===
          4
        )
          setGameStage(GameStageEnum.PLAYER_WIN);
        else setGameStage(GameStageEnum.TURN_ENEMY);
      }
    }
  };
  const handleMovePlayerElements = (items: IBattleFieldElement[]): void => {
    if (gameStage === GameStageEnum.START) setPlayerItems(items);
  };
  const handleClickReset = () => {
    setPlayerItems(defaultElements);
    setEnemyItems(createLabels());
    setGameStage(GameStageEnum.START);
  };
  const handleClickStart = () => {
    setGameStage(GameStageEnum.TURN_PLAYER);
  };
  return (
    <div style={{ marginTop: 20, marginLeft: 20 }}>
      <BattleField
        elements={playerItems}
        size={{ width: 11, height: 11 }}
        onMove={handleMovePlayerElements}
      />
      <BattleField
        elements={enemyItems}
        size={{ width: 11, height: 11 }}
        onClickEmptyCell={handleClickEmptyEnemyCell}
      />
      <div>
        {getCountElementsByTags(playerItems, [TagTypeEnum.HIT])}/
        {getCountPlayerFieldsCells(playerItems)}
      </div>
      <div>
        {getCountElementsByTags(enemyItems, [TagTypeEnum.HIT])}/
        {getCountPlayerShips(enemy)}
      </div>
      {gameStage === GameStageEnum.PLAYER_WIN && <div>You are win!</div>}
      {gameStage === GameStageEnum.PLAYER_LOSE && <div>You are lose :(</div>}
      {[GameStageEnum.PLAYER_WIN, GameStageEnum.PLAYER_LOSE].includes(
        gameStage
      ) && <button onClick={handleClickReset}>Reset</button>}
      {gameStage === GameStageEnum.START && (
        <button onClick={handleClickStart}>Start</button>
      )}
    </div>
  );
}

export default GameManager;
