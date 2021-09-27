import {
  action,
  observable,
  makeAutoObservable,
  computed,
  configure,
} from "mobx";
import {
  isAvailableElementPosition,
  isPointLocatedInArea,
  randomInteger,
} from "../components/utils/fieldHelper";
import {
  createLabels,
  createShip,
  createTargetHit,
  createTargetMiss,
  getCountElementsByTags,
  getCountPlayerFieldsCells,
  getCountPlayerShips,
} from "../components/utils/shipHelper";
import { OPTIONS_SAMPLES_OF_SHIPS } from "../constants/common";
import {
  GameStageEnum,
  IBattleFieldElement,
  IElement,
  OrientationEnum,
  Position,
  Size,
  TagTypeEnum,
} from "../types/types";

configure({
  enforceActions: "observed",
});

class Store {
  @observable.deep playerElements: IBattleFieldElement[] = [];
  @observable.deep enemyElements: IBattleFieldElement[] = [];
  @observable gameStage: GameStageEnum = GameStageEnum.START;
  @observable.deep enemyShips: IElement[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @computed
  get playerStatistic() {
    return {
      hits: getCountElementsByTags(this.playerElements, [TagTypeEnum.HIT]),
      total: getCountPlayerFieldsCells(this.playerElements),
    };
  }
  @computed
  get enemyStatistic() {
    return {
      hits: getCountElementsByTags(this.enemyElements, [TagTypeEnum.HIT]),
      total: getCountPlayerShips(this.enemyShips),
    };
  }

  @action flipShip(elementId: string) {
    const shape = this.playerElements.find((el) => el.id === elementId);
    if (shape) {
      shape.size = {
        width: shape.size.height,
        height: shape.size.width,
      };
    }
  }

  @action playerMove(pos: Position) {
    const shipInPoint = !!this.enemyShips.find((s) =>
      isPointLocatedInArea(s, pos)
    );
    const objectInPoint = !!this.enemyElements.find((s) =>
      isPointLocatedInArea(s, pos)
    );
    if (!objectInPoint) {
      this.enemyElements.push(
        shipInPoint ? createTargetHit(pos) : createTargetMiss(pos)
      );
      const isPlayerWin =
        this.enemyElements.filter((s) => s.tag === TagTypeEnum.HIT).length +
          +shipInPoint ===
        getCountPlayerShips(this.enemyShips);
      this.gameStage = isPlayerWin
        ? GameStageEnum.PLAYER_WIN
        : GameStageEnum.TURN_ENEMY;
    }
  }

  @action enemyMove() {
    while (true) {
      const hitCell: Position = {
        x: Math.floor(Math.random() * 10) + 1,
        y: Math.floor(Math.random() * 10) + 1,
      };
      const markInPoint = !!this.playerElements.find(
        (s) =>
          isPointLocatedInArea(s, hitCell) &&
          [TagTypeEnum.HIT, TagTypeEnum.MISS].includes(s.tag)
      );
      const shipInPoint = !!this.playerElements.find(
        (s) => isPointLocatedInArea(s, hitCell) && s.tag === TagTypeEnum.SHIP
      );

      if (!markInPoint) {
        this.playerElements.push(
          shipInPoint ? createTargetHit(hitCell) : createTargetMiss(hitCell)
        );
        const isEnemyWin =
          this.playerElements.filter((s) => s.tag === TagTypeEnum.HIT).length +
            +!!shipInPoint ===
          getCountPlayerFieldsCells(this.playerElements);
        this.gameStage = isEnemyWin
          ? GameStageEnum.PLAYER_LOSE
          : GameStageEnum.TURN_PLAYER;
        break;
      }
    }
  }

  @action start() {
    this.gameStage = GameStageEnum.TURN_PLAYER;
  }

  @action restart() {
    this.shuffleEnemyShips();
    this.shufflePlayerShips();
    this.gameStage = GameStageEnum.START;
  }

  @action shuffleEnemyShips() {
    this.enemyElements = createLabels();
    this.enemyShips = [];
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

    OPTIONS_SAMPLES_OF_SHIPS.forEach((option) => {
      let orientation: OrientationEnum;
      let size: Size;
      let position: Position;
      let counter = 0;

      do {
        orientation =
          Math.ceil(Math.random() * 2) % 2 === 0
            ? OrientationEnum.HORIZONTAL
            : OrientationEnum.VERTICAL;
        size = {
          width: orientation === OrientationEnum.HORIZONTAL ? option : 1,
          height: orientation === OrientationEnum.VERTICAL ? option : 1,
        };
        position = {
          x: randomInteger(availableArea.position.x, availableArea.size.width),
          y: randomInteger(availableArea.position.y, availableArea.size.height),
        };
        if (++counter === 100) return;
      } while (
        !isAvailableElementPosition(availableArea, this.enemyShips, {
          position,
          size,
        })
      );
      this.enemyShips.push({
        size,
        position,
      });
    });
  }

  @action shufflePlayerShips() {
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
    this.playerElements = [];
    OPTIONS_SAMPLES_OF_SHIPS.forEach((option) => {
      let orientation: OrientationEnum =
        Math.ceil(Math.random() * 2) % 2 === 0
          ? OrientationEnum.HORIZONTAL
          : OrientationEnum.VERTICAL;
      let size: Size = {
        width: orientation === OrientationEnum.HORIZONTAL ? option : 1,
        height: orientation === OrientationEnum.VERTICAL ? option : 1,
      };
      let position: Position;
      let counter = 0;
      do {
        orientation =
          Math.ceil(Math.random() * 2) % 2 === 0
            ? OrientationEnum.HORIZONTAL
            : OrientationEnum.VERTICAL;
        size = {
          width: orientation === OrientationEnum.HORIZONTAL ? option : 1,
          height: orientation === OrientationEnum.VERTICAL ? option : 1,
        };
        position = {
          x: randomInteger(availableArea.position.x, availableArea.size.width),
          y: randomInteger(availableArea.position.y, availableArea.size.height),
        };
        if (++counter === 100) return;
      } while (
        !isAvailableElementPosition(availableArea, this.playerElements, {
          position,
          size,
        })
      );
      this.playerElements.push(createShip(option, orientation, position));
    });
    this.playerElements.push(...createLabels());
  }
}

export default Store;
