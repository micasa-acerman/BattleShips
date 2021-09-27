# Морской бой 

## Инструкция по запуску

В корневой директории необходимо выполнить:

`yarn start`

Эта команда запускает сайт в режиме разработчика.\
Откройте [http://localhost:3000](http://localhost:3000) для просмотра в браузере.

Страничка автоматически обновиться после изменения кодовой базы.\
Так же, в случае возникновения ошибки, в консоле вы увидите сводку.

Если вы хотите собрать продуктивную сборку, то выполните:  

`yarn build`

Собранный бандл вы сможете найти в папке `build`.

Продуктивная версия будет минифицированна и в бандлах будут использоваться хеши.
Далее вы можете разместить разместить на подготовленной среде либо в [docker](https://hub.docker.com/_/httpd) контейнере.

## Взаимосвязь компонентов

![file structure](doc/component-structure.png)

Скрипт | Описание
------------ | -------------
App.tsx | Определяет структуру сайта (header, body, footer)
GameMananger.tsx | Содержит в себе состояния кораблей, так же содержит в себе основную игровую логику.
LabelsFields.tsx | Является префабом. Используется для отрисовки горизонтальный и вертикальных отметок осей.
BattleField.tsx | Отрисовывает основные игровые элементы. Так же передает основные игровые события (клик по неотмеченной клетке и т.п.)
shipHelper.tsx | Содержит вспомогательные функции используемые для описания объектов BattleField.
fieldHelper.tsx | Содержит функции реализующие основные методы для для работы с BattleField (К примеру, проверка позиции, результат игры, расположением элементов при d&d)
store.tsx | содержит хранилище состояний приложения и action'ов MobX

### Описание хранилища (store)

Свойство | Тип | Описание
------------ | ------------ | -------------
playerElements | *observable.deep* | Хранит объекты предназначенные для отображения элементов игрока в BattleField
enemyElements | *observable.deep* | Хранит объекты предназначенные для отображения элементов противника в BattleField
gameStage | *observable* | Хранит текущее состояние игры (START,TURN_PLAYER,TURN_ENEMY,PLAYER_WIN,PLAYER_LOSE)
enemyShips | *observalbe.deep* | Хранит размеры и позицию кораблей противника 
playerStatistic | *computed* | Расчитывает количество попадений по кораблям игрока и количество попадений для проигрыша
enemyStatistic | *computed* | Расчитывает количество попадений по кораблям противника и количество попадений для победы
flipShip | *action* | Поворачивает корабль игрока
playerMove | *action* | Обрабатывает события выстрела игрока
enemyMove | *action* | Обрабатывает ход для ИИ противника 
start | *action* | Старт игры
restart | *action* | Рестарт игры
shuffleEnemyShips | *action* | Перестановка кораблей противника
shufflePlayerShips | *action* | Перестановка кораблей игрока
## Алгоритм
![alghorithm](doc/alghorithm.png)
