/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Box from '../data/Box';
import GameState from '../states/GameState';
import Line from '../data/Line';
import SmartGreedy from './SmartGreedy';

type StartingPoint = {
  row: number,
  col: number,
  value: number,
};

export default class OptimizingGreedy extends SmartGreedy {
  run(gameState: GameState): ?Line {
    const rows = gameState.getRows();
    const cols = gameState.getCols();
    const map = [];
    gameState.forEachBox((box: Box) => {
      const row = box.getRow();
      const col = box.getCol();
      if (!map[row]) {
        map[row] = [];
      }
      map[row][col] = 4 - box.getSelectedLineCount();
    });

    let startingPoints = [];
    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        startingPoints.push({
          row: i,
          col: j,
          value: this.dfs(gameState, map, i, j),
        });
      }
    }

    startingPoints = startingPoints.filter(
      (startingPoint: StartingPoint) => startingPoint.value > 0,
    );

    startingPoints.sort((a: StartingPoint, b: StartingPoint) => {
      if (a.value === b.value) {
        return 0;
      }
      return a.value < b.value ? -1 : 1;
    });

    if (startingPoints.length === 0) {
      return super.run(gameState);
    }

    return gameState.getBox(
      startingPoints[0].row,
      startingPoints[0].col,
    ).getAvailableLines()[0];
  }

  dfs(
    gameState: GameState,
    map: Array<Array<number>>,
    row: number,
    col: number,
  ): number {
    if (
      row < 0 ||
      row >= gameState.getRows() ||
      col < 0 ||
      col >= gameState.getCols()
    ) {
      return 0;
    }
    if (map[row][col] !== 1) {
      return 0;
    }

    // let count = 1;
    // [
    //   Directions.UP,
    //   Directions.RIGHT,
    //   Directions.DOWN,
    //   Directions.LEFT,
    // ].forEach((direction: Direction) {
    //   if (gameState.getLine(row, col, direction).getOwner() !== null)
    // });

    return 0;
  }
}
