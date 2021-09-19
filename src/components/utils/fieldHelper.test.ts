import "@testing-library/jest-dom";
import {
  getAvailableElementPosition,
  isAvailableElementPosition,
  isCrossAreas,
  isPointLocatedInArea,
  isSquareLocatedInArea,
  transformPositionFromCellsToPx,
} from "./fieldHelper";
describe("fieldHelper", () => {
  test("check function transformPositionFromCellsToPx", async () => {
    expect(transformPositionFromCellsToPx(10)).toBe(250);
    expect(transformPositionFromCellsToPx(0)).toBe(0);
    expect(transformPositionFromCellsToPx(1)).toBe(25);
  });

  test("check function isPointLocatedInArea", async () => {
    expect(
      isPointLocatedInArea(
        {
          position: {
            x: 0,
            y: 0,
          },
          size: {
            width: 10,
            height: 10,
          },
        },
        {
          x: 1,
          y: 1,
        }
      )
    ).toBeTruthy();
    expect(
      isPointLocatedInArea(
        {
          position: {
            x: 1,
            y: 1,
          },
          size: {
            width: 10,
            height: 10,
          },
        },
        {
          x: 1,
          y: 1,
        }
      )
    ).toBeTruthy();
    expect(
      isPointLocatedInArea(
        {
          position: {
            x: 1,
            y: 1,
          },
          size: {
            width: 10,
            height: 10,
          },
        },
        {
          x: -1,
          y: 1,
        }
      )
    ).toBeFalsy();
  });

  test("check function isSquareLocatedInArea", async () => {
    expect(
      isSquareLocatedInArea(
        {
          position: {
            x: 0,
            y: 0,
          },
          size: {
            width: 10,
            height: 10,
          },
        },
        {
          position: {
            x: 0,
            y: 9,
          },
          size: {
            width: 1,
            height: 1,
          },
        }
      )
    ).toBeTruthy();
    expect(
      isSquareLocatedInArea(
        {
          position: {
            x: 0,
            y: 0,
          },
          size: {
            width: 5,
            height: 5,
          },
        },
        {
          position: {
            x: 4,
            y: 4,
          },
          size: {
            width: 5,
            height: 1,
          },
        }
      )
    ).toBeFalsy();
  });
  test("check function isCrossAreas", async () => {
    expect(
      isCrossAreas(
        {
          position: {
            x: 0,
            y: 0,
          },
          size: {
            width: 5,
            height: 5,
          },
        },
        {
          position: {
            x: 4,
            y: 4,
          },
          size: {
            width: 5,
            height: 5,
          },
        }
      )
    ).toBeTruthy();
    expect(
      isCrossAreas(
        {
          position: {
            x: 1,
            y: 1,
          },
          size: {
            width: 6,
            height: 3,
          },
        },
        {
          position: {
            x: 2,
            y: 1,
          },
          size: {
            width: 4,
            height: 4,
          },
        }
      )
    ).toBeTruthy();
  });
  test("check function isAvailableElementPosition", async () => {
    const area = {
      position: {
        x: 1,
        y: 1,
      },
      size: {
        width: 10,
        height: 10,
      },
    };
    const forbidden = [
      {
        position: {
          x: 1,
          y: 1,
        },
        size: {
          height: 3,
          width: 6,
        },
      },
    ];
    expect(
      isAvailableElementPosition(area, forbidden, {
        position: {
          x: 2,
          y: 1,
        },
        size: {
          width: 4,
          height: 4,
        },
      })
    ).toBeFalsy();
  });

  test("check function getAvailableElementPosition", async () => {
    const area = {
      position: {
        x: 1,
        y: 1,
      },
      size: {
        width: 11,
        height: 11,
      },
    };
    const forbidden = [
      {
        position: {
          x: 2,
          y: 2,
        },
        size: {
          height: 1,
          width: 4,
        },
      },
    ];
    expect(
      getAvailableElementPosition(area, forbidden, {
        position: {
          x: 2,
          y: 7,
        },
        size: {
          width: 1,
          height: 3,
        },
      })
    ).toEqual({
      x: 2,
      y: 7,
    });
  });
});
