import { Alert, Button, Col, Row, Space, Statistic } from "antd";
import { FC, useEffect } from "react";
import { IBattleFieldElement, GameStageEnum, Position } from "../../types/types";
import BattleField from "../BattleField";
import { observer } from "mobx-react-lite";
import Store from "../../store/store";
import { RadarChartOutlined } from "@ant-design/icons";
interface Props {
  store: Store;
}
const GameManager: FC<Props> = ({ store }) => {
  useEffect(() => {
    store.shuffleEnemyShips();
    store.shufflePlayerShips();
  }, [store]);

  useEffect(() => {
    if (store.gameStage === GameStageEnum.TURN_ENEMY) {
      setTimeout(() => {
        store.enemyMove();
      }, Math.floor(Math.random() * 900 + 100));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.gameStage]);

  return (
    <Row>
      <Col md={8}>
        <BattleField
          elements={store.playerElements}
          size={{ width: 11, height: 11 }}
          onMove={handlePlayerMove}
          onDoubleClickElement={(el: IBattleFieldElement) => {
            store.flipShip(el.id);
          }}
        />
      </Col>
      <Col md={8}>
        <BattleField
          elements={store.enemyElements}
          size={{ width: 11, height: 11 }}
          onClickEmptyCell={handleClickEmptyEnemyCell}
        />
      </Col>
      <Col md={8}>
        <Row>
          <Col md={12}>
            <Statistic
              title="Вы"
              value={`${store.playerStatistic.hits}/${store.playerStatistic.total}`}
              prefix={<RadarChartOutlined />}
            />
          </Col>
          <Col md={12}>
            <Statistic
              title="Противник"
              value={`${store.enemyStatistic.hits}/${store.enemyStatistic.total}`}
              prefix={<RadarChartOutlined />}
            />
          </Col>
        </Row>
        <Space style={{ marginTop: 20, width: "100%" }} direction="vertical">
          {store.gameStage === GameStageEnum.PLAYER_WIN && (
            <>
              <Alert message="Ты выиграл!" type="success" />
              <Button type="primary" onClick={handleClickReset}>
                Сбросить
              </Button>
            </>
          )}
          {store.gameStage === GameStageEnum.PLAYER_LOSE && (
            <>
              <Alert message="Лузер :D" type="error" />
              <Button type="primary" onClick={handleClickReset}>
                Сбросить
              </Button>
            </>
          )}
          {store.gameStage === GameStageEnum.START && (
            <>
              <Button type="primary" onClick={handleClickStart}>
                Начать
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  store.shuffleEnemyShips();
                  store.shufflePlayerShips();
                }}
              >
                Переставить
              </Button>
            </>
          )}
          {store.gameStage === GameStageEnum.TURN_PLAYER && (
            <Alert message="Твой ход" type="info" />
          )}
          {store.gameStage === GameStageEnum.TURN_ENEMY && (
            <Alert message="Ход противника" type="info" />
          )}
        </Space>
      </Col>
    </Row>
  );

  function handleClickEmptyEnemyCell(pos: Position) {
    if (store.gameStage === GameStageEnum.TURN_PLAYER) {
      store.playerMove(pos);
    }
  }
  function handlePlayerMove(
    element: IBattleFieldElement,
    position: Position
  ): void {
    if (store.gameStage === GameStageEnum.START) {
      element.position = position;
    }
  }
  function handleClickReset() {
    store.restart();
  }
  function handleClickStart() {
    store.start();
  }
};

export default observer(GameManager);
