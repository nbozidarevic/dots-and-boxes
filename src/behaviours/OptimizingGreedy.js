/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Box from '../data/Box';
import Directions, {type Direction} from '../constants/Directions';
import GameState from '../states/GameState';
import Line from '../data/Line';
import SmartGreedy from './SmartGreedy';

type SelectedLines = Array<boolean>;
type Map = Array<Array<SelectedLines>>;

type StartingPoint = {
  row: number,
  col: number,
  value: number,
};

const DIR = [
  {row: -1, col: 0}, // Directions.UP
  {row: 0, col: 1}, // Directions.RIGHT
  {row: 1, col: 0}, // Directions.DOWN
  {row: 0, col: -1}, // Directions.LEFT
];

/**
 * Algorithm Flow:
 * - Find all the chains that can be completed, along with their length and
 *   whether they are closed or half-open
 * - [done] If there are boxes with 3 or 4 unused lines, choose any line which
 *   completes a box, regardless of the chain properties.
 * - [done] If there are no chains, select any line which doesn't complete a box.
 * - At this point, all the boxes are missing either 1 or 2 lines.
 * - If there is any chain longer than 4, select a line at its beginning.
 * - If there is any open chain longer than 2, select a line at its beginning.
 * - If there is any closed chain shorter than 4, complete it.
 * - If there is any chain shorter than 1, complete it.
 * - If there are multiple chains, select a line in the longest one.
 * - At this point, we only have either a closed chain of length 4, or a
 *   half-open chain of length 2, and all other lines start new chains.
 * - Do alpha-beta pruning with one option being leaving the chain to the
 *   opponent, and the other being getting the chain and
 */
export default class OptimizingGreedy extends SmartGreedy {
  _getMapFromGameState(gameState: GameState): Map {
    const rows = gameState.getRows();
    const cols = gameState.getCols();
    const map: Map = [];
    gameState.forEachBox((box: Box) => {
      const row = box.getRow();
      const col = box.getCol();
      if (!map[row]) {
        map[row] = [];
      }
      map[row][col] = [];
      for (let dir = Directions.UP; dir <= Directions.LEFT; ++dir) {
        map[row][col][dir] = box.getLine(dir).getOwner() !== null;
      }
    });
    return map;
  }

  _cloneMap(map: Map): Map {
    return map.map(row => row.map(box => box.slice(0)));
  }

  _getBoxesGroupedByAvailableLineCount(
    map: Map,
  ): Array<Array<{row: number, col: number}>> {
    const counts = [[], [], [], [], []];
    map.forEach(
      (boxes, row) => {
        boxes.forEach(
          (box, col) => {
            counts[
              box.filter(selectedLine => !selectedLine).length
            ].push({row, col});
          },
        );
      },
    );
    return counts;
  }

  _getAvailableLineForBox(map: Map, row: number, col: number): ?Direction {
    const box = map[row][col];
    for (let dir = Directions.UP; dir <= Directions.LEFT; ++dir) {
      if (!box[dir]) {
        return dir;
      }
    }
    return null;
  }

  run(gameState: GameState): ?Line {
    const rows = gameState.getRows();
    const cols = gameState.getCols();
    const map = this._getMapFromGameState(gameState);

    const boxesByLineCount =
      this._getBoxesGroupedByAvailableLineCount(map);
    console.log(boxesByLineCount);

    /**
     * If there are boxes with 3 or 4 unused lines, choose any line which
     * completes a box. If there is no such line, select any line which doesn't
     * complete a box.
     */
    if (boxesByLineCount[3].length + boxesByLineCount[4].length > 0) {
      let box;
      if (boxesByLineCount[1].length > 0) {
        box = boxesByLineCount[1][0];
      } else {
        box = [
          ...boxesByLineCount[3],
          ...boxesByLineCount[4],
        ][0];
      }
      const dir = this._getAvailableLineForBox(map, box.row, box.col);
      if (dir === null || dir == undefined) {
        throw Error('Expected to find an available line');
      }
      return gameState.getLine(box.row, box.col, dir);
    }

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
    map: Array<Array<SelectedLines>>,
    row: number,
    col: number,
    originDirection?: Direction,
  ): number {
    if (
      row < 0 ||
      row >= gameState.getRows() ||
      col < 0 ||
      col >= gameState.getCols()
    ) {
      return 0;
    }

    if (originDirection !== undefined) {
      map[row][col][(originDirection + 2) % 4] = true;
    }

    let availableLines = 0;
    map[row][col].forEach((isSelected: boolean) => {
      if (!isSelected) {
        ++availableLines;
      }
    });
    if (availableLines !== 1) {
      return 0;
    }

    let count = 1;
    map[row][col].forEach((isSelected: boolean, dir: Direction) => {
      if (!isSelected) {
        map[row][col][dir] = true;
        count += this.dfs(
          gameState,
          map,
          row + DIR[dir].row,
          col + DIR[dir].col,
          dir,
        );
      }
    });

    return count;
  }
}
