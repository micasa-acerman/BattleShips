import { Alert, Button, Col, Row, Space, Statistic } from "antd";
import { useEffect, useState } from "react";
import {
  IBattleFieldElement,
  IElement,
  OrientationEnum,
  GameStageEnum,
  Position,
  TagTypeEnum,
  Size,
} from "../../types";
import BattleField from "../BattleField";
import {
  isAvailableElementPosition,
  isPointLocatedInArea,
} from "../utils/fieldHelper";
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
import { OPTIONS_SAMPLES_OF_SHIPS } from "../../constants/common";

const defaultElements: IBattleFieldElement[] = [
  createShip(4, OrientationEnum.HORIZONTAL, { x: 2, y: 2 }),
  createShip(3, OrientationEnum.VERTICAL, { x: 6, y: 2 }),
  ...createLabels(),
];

function GameManager() {
  const [playerElements, setPlayerElements] =
    useState<IBattleFieldElement[]>(defaultElements);
  const [enemyElements, setEnemyElements] = useState<IBattleFieldElement[]>(
    createLabels()
  );
  const [gameStage, setGameStage] = useState<GameStageEnum>(
    GameStageEnum.START
  );
  const [enemyShips, setEnemyShips] = useState<IElement[]>([]);

  useEffect(() => {
    shuffleEnemyShips();
    shufflePlayerShips();
  }, []);

  useEffect(() => {
    if (gameStage === GameStageEnum.TURN_ENEMY) {
      setTimeout(() => {
        while (true) {
          const hitCell: Position = {
            x: Math.floor(Math.random() * 10) + 1,
            y: Math.floor(Math.random() * 10) + 1,
          };
          const markInPoint = !!playerElements.find(
            (s) =>
              isPointLocatedInArea(s, hitCell) &&
              [TagTypeEnum.HIT, TagTypeEnum.MISS].includes(s.tag)
          );
          const shipInPoint = !!playerElements.find(
            (s) =>
              isPointLocatedInArea(s, hitCell) && s.tag === TagTypeEnum.SHIP
          );

          if (!markInPoint) {
            setPlayerElements([
              ...playerElements,
              shipInPoint
                ? createTargetHit(hitCell)
                : createTargetMiss(hitCell),
            ]);
            if (
              playerElements.filter((s) => s.tag === TagTypeEnum.HIT).length +
                +!!shipInPoint ===
              getCountPlayerFieldsCells(playerElements)
            )
              setGameStage(GameStageEnum.PLAYER_LOSE);
            else setGameStage(GameStageEnum.TURN_PLAYER);
            break;
          }
        }
      }, Math.floor(Math.random() * 900 + 100));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStage]);

  return (
    <Row>
      <Col md={8}>
        <BattleField
          elements={playerElements}
          size={{ width: 11, height: 11 }}
          onMove={handleMovePlayerElements}
          onDoubleClickElement={(el: IBattleFieldElement) => {
            setPlayerElements(
              playerElements.map((item) =>
                item.id === el.id
                  ? {
                      ...item,
                      size: {
                        width: item.size.height,
                        height: item.size.width,
                      },
                    }
                  : item
              )
            );
          }}
        />
      </Col>
      <Col md={8}>
        <BattleField
          elements={enemyElements}
          size={{ width: 11, height: 11 }}
          onClickEmptyCell={handleClickEmptyEnemyCell}
        />
      </Col>
      <Col md={8}>
        <Row>
          <Col md={12}>
            <Statistic
              title="Вы"
              value={`${getCountElementsByTags(playerElements, [
                TagTypeEnum.HIT,
              ])}/${getCountPlayerFieldsCells(playerElements)}`}
              prefix={<RadarChartOutlined />}
            />
          </Col>
          <Col md={12}>
            <Statistic
              title="Противник"
              value={`${getCountElementsByTags(enemyElements, [
                TagTypeEnum.HIT,
              ])}/${getCountPlayerShips(enemyShips)}`}
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
            <>
              <Button type="primary" onClick={handleClickStart}>
                Начать
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  shuffleEnemyShips();
                  shufflePlayerShips();
                }}
              >
                Переставить
              </Button>
            </>
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
      const shipInPoint = !!enemyShips.find((s) =>
        isPointLocatedInArea(s, pos)
      );
      const objectInPoint = !!enemyElements.find((s) =>
        isPointLocatedInArea(s, pos)
      );
      if (!objectInPoint) {
        setEnemyElements([
          ...enemyElements,
          shipInPoint ? createTargetHit(pos) : createTargetMiss(pos),
        ]);
        if (
          enemyElements.filter((s) => s.tag === TagTypeEnum.HIT).length +
            +shipInPoint ===
          getCountPlayerShips(enemyShips)
        )
          setGameStage(GameStageEnum.PLAYER_WIN);
        else setGameStage(GameStageEnum.TURN_ENEMY);
      }
    }
  }
  function handleMovePlayerElements(items: IBattleFieldElement[]): void {
    if (gameStage === GameStageEnum.START) setPlayerElements(items);
  }
  function handleClickReset() {
    setPlayerElements(defaultElements);
    setEnemyElements(createLabels());
    setGameStage(GameStageEnum.START);
  }
  function handleClickStart() {
    setGameStage(GameStageEnum.TURN_PLAYER);
  }

  function shuffleEnemyShips() {
    const availableArea: IElement = {
      position: {
        x: 1,
        y: 1,
      },
      size: {
        width: 10,
        height: 10,
      },
    };
    const enemyShips: IElement[] = [];
    OPTIONS_SAMPLES_OF_SHIPS.forEach((option) => {
      const orientation: OrientationEnum =
        Math.ceil(Math.random() * 2) % 2 === 0
          ? OrientationEnum.HORIZONTAL
          : OrientationEnum.VERTICAL;
      const size: Size = {
        width: orientation === OrientationEnum.HORIZONTAL ? option : 1,
        height: orientation === OrientationEnum.VERTICAL ? option : 1,
      };
      let position: Position;
      let counter = 0;
      do {
        position = {
          x: Math.ceil(
            Math.random() *
              (availableArea.size.width -
                size.width -
                availableArea.position.x) +
              availableArea.position.x
          ),
          y: Math.ceil(
            Math.random() *
              (availableArea.size.height -
                size.height -
                availableArea.position.y) +
              availableArea.position.y
          ),
        };
        if (++counter === 100) return;
      } while (
        !isAvailableElementPosition(availableArea, enemyShips, {
          position,
          size,
        })
      );
      enemyShips.push({
        size,
        position,
      });
    });
    setEnemyShips(enemyShips);
  }
  function shufflePlayerShips() {
    const availableArea: IElement = {
      position: {
        x: 1,
        y: 1,
      },
      size: {
        width: 10,
        height: 10,
      },
    };
    const ships: {
      position: Position;
      size: Size;
      orientation: OrientationEnum;
      option: number;
    }[] = [];
    OPTIONS_SAMPLES_OF_SHIPS.forEach((option) => {
      const orientation: OrientationEnum =
        Math.ceil(Math.random() * 2) % 2 === 0
          ? OrientationEnum.HORIZONTAL
          : OrientationEnum.VERTICAL;
      const size: Size = {
        width: orientation === OrientationEnum.HORIZONTAL ? option : 1,
        height: orientation === OrientationEnum.VERTICAL ? option : 1,
      };
      let position: Position;
      let counter = 0;
      do {
        position = {
          x: Math.ceil(
            Math.random() *
              (availableArea.size.width -
                size.width -
                availableArea.position.x) +
              availableArea.position.x
          ),
          y: Math.ceil(
            Math.random() *
              (availableArea.size.height -
                size.height -
                availableArea.position.y) +
              availableArea.position.y
          ),
        };
        if (++counter === 100) return;
      } while (
        !isAvailableElementPosition(availableArea, ships, {
          position,
          size,
        })
      );
      ships.push({
        size,
        position,
        option,
        orientation,
      });
    });
    setPlayerElements([
      ...playerElements.filter((element) => element.tag !== TagTypeEnum.SHIP),
      ...ships.map((ship) =>
        createShip(ship.option, ship.orientation, ship.position)
      ),
    ]);
  }
}

export default GameManager;
