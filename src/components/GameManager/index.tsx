import {
  Alert,
  Button,
  Col,
  Row,
  Space,
  Statistic,
} from "antd";
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
import { RadarChartOutlined } from "@ant-design/icons";

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
      setTimeout(()=>{
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
      },Math.floor(Math.random()*900+100))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStage]);

  return (
    <Row>
      <Col md={8}>
        <BattleField
          elements={playerItems}
          size={{ width: 11, height: 11 }}
          onMove={handleMovePlayerElements}
        />
      </Col>
      <Col md={8}>
        <BattleField
          elements={enemyItems}
          size={{ width: 11, height: 11 }}
          onClickEmptyCell={handleClickEmptyEnemyCell}
        />
      </Col>
      <Col md={8}>
        <Row>
          <Col md={12}>
            <Statistic
              title="Вы"
              value={`${getCountElementsByTags(playerItems, [
                TagTypeEnum.HIT,
              ])}/${getCountPlayerFieldsCells(playerItems)}`}
              prefix={<RadarChartOutlined />}
            />
          </Col>
          <Col md={12}>
            <Statistic
              title="Противник"
              value={`${getCountElementsByTags(enemyItems, [
                TagTypeEnum.HIT,
              ])}/${getCountPlayerShips(enemy)}`}
              prefix={<RadarChartOutlined />}
            />
          </Col>
        </Row>
        <Space style={{ marginTop: 20, width: "100%" }} direction="vertical">
          {gameStage === GameStageEnum.PLAYER_WIN && (
            <Alert message="Ты выиграл!" type="success" />
          )}
          {gameStage === GameStageEnum.PLAYER_LOSE && (
            <Alert message="Лузер :D" type="error" />
          )}
          {[GameStageEnum.PLAYER_WIN, GameStageEnum.PLAYER_LOSE].includes(
            gameStage
          ) && (
            <Button type="primary" onClick={handleClickReset}>
              Сбросить
            </Button>
          )}
          {gameStage === GameStageEnum.START && (
            <Button type="primary" onClick={handleClickStart}>
              Начать
            </Button>
          )}
          {gameStage === GameStageEnum.TURN_PLAYER && (
            <Alert message="Твой ход" type="info" />
          )}
          {gameStage === GameStageEnum.TURN_ENEMY && (
            <Alert message="Ход противника" type="info" />
          )}
        </Space>
      </Col>
    </Row>
  );

  function handleClickEmptyEnemyCell(pos: Position) {
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
  }
  function handleMovePlayerElements(items: IBattleFieldElement[]): void {
    if (gameStage === GameStageEnum.START) setPlayerItems(items);
  }
  function handleClickReset() {
    setPlayerItems(defaultElements);
    setEnemyItems(createLabels());
    setGameStage(GameStageEnum.START);
  }
  function handleClickStart() {
    setGameStage(GameStageEnum.TURN_PLAYER);
  }
}

export default GameManager;
