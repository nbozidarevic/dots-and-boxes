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

type Chain = {
  row: number,
  col: number,
  length: number,
}
type Chains = {
  closed: Array<Chain>,
  open: Array<Chain>,
};

const DIR = [
  {row: -1, col: 0}, // Directions.UP
  {row: 0, col: 1}, // Directions.RIGHT
  {row: 1, col: 0}, // Directions.DOWN
  {row: 0, col: -1}, // Directions.LEFT
];

const MAX_RECURSION_DEPTH = 5;

/**
 * Algorithm Flow:
 * - Find all the chains that can be completed, along with their length and
 *   whether they are closed or half-open
 * - [done] If there are boxes with 3 or 4 unused lines, choose any line which
 *   completes a box, regardless of the chain properties.
 * - [done] If there are no chains, select any line which doesn't complete a box.
 * - At this point, all the boxes are missing either 1 or 2 lines.
 * - [done] If there is any chain longer than 4, select a line at its beginning.
 * - [done] If there is any open chain longer than 2, select a line at its beginning.
 * - [done] If there is any closed chain shorter than 4, complete it.
 * - [done] If there is any chain shorter than 2, complete it.
 * - [done] If there are multiple chains, select a line in the longest one.
 * - At this point, we only have either a closed chain of length 4, or a
 *   half-open chain of length 2, and all other lines start new chains.
 * - Do alpha-beta pruning with one option being leaving the chain to the
 *   opponent, and the other being getting the chain and
 */
export default class OptimizingGreedy extends SmartGreedy {
  static getName(): string {
    return 'Računar: Minimaks';
  }

  static getDescription(): string {
    return `Računar će uvek pokušati da zatvori što više kutije za redom, ali će
      koristiti minimaks pristup sa alfa-beta odsecanjem ne bi li odlučio da li
      je isplativije "žrtvovati" određenu kutiju radi više poena kasnije.
      Ukoliko ne postoje linije koje zatvaraju kutije, odabraće neku drugu
      liniju koja ne omogućava protivniku da zatvori kutiju. Ukoliko ne postoji
      ni takva linija, odabraće neku drugu liniju nasumično.`
  }

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

  _getLinesGroupedByBoxAvailableLineCount(
    map: Map,
    rows: number,
    cols: number,
  ): Array<Array<{row: number, col: number, direction: Direction}>> {
    const counts = [[], [], [], [], []];

    const getBoxAvailableLineCount = (row: number, col: number) => {
      let count = 0;
      map[row][col].forEach(selectedLine => {
        if (!selectedLine) {
          ++count;
        }
      });
      return count;
    };

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        const currentBoxCount = getBoxAvailableLineCount(i, j);
        const upBoxCount = i > 0 ? getBoxAvailableLineCount(i - 1, j) : 4;
        const leftBoxCount = j > 0 ? getBoxAvailableLineCount(i, j - 1) : 4;

        if (!map[i][j][Directions.UP]) {
          counts[Math.min(currentBoxCount, upBoxCount)].push({
            row: i,
            col: j,
            direction: Directions.UP,
          });
        }
        if (!map[i][j][Directions.LEFT]) {
          counts[Math.min(currentBoxCount, leftBoxCount)].push({
            row: i,
            col: j,
            direction: Directions.LEFT,
          });
        }

        if (i === rows - 1 && !map[i][j][Directions.DOWN]) {
          counts[currentBoxCount].push({
            row: i,
            col: j,
            direction: Directions.DOWN,
          });
        }
        if (j === cols - 1 && !map[i][j][Directions.RIGHT]) {
          counts[currentBoxCount].push({
            row: i,
            col: j,
            direction: Directions.RIGHT,
          });
        }
      }
    }

    return counts;
  }

  // _getBoxesGroupedByAvailableLineCount(
  //   map: Map,
  // ): Array<Array<{row: number, col: number}>> {
  //   const counts = [[], [], [], [], []];
  //   map.forEach(
  //     (boxes, row) => {
  //       boxes.forEach(
  //         (box, col) => {
  //           counts[
  //             box.filter(selectedLine => !selectedLine).length
  //           ].push({row, col});
  //         },
  //       );
  //     },
  //   );
  //   return counts;
  // }

  _getLineForBox(
    gameState: GameState,
    row: number,
    col: number,
  ): Line {
    return gameState.getBox(row, col).getAvailableLines()[0];
  }

  _getAllChains(map: Map, rows: number, cols: number): Chains {
    const chains = {
      closed: [],
      open: [],
    };

    const availableLineCount = (i: number, j: number) => {
      let availableLines = 0;
      map[i][j].forEach((isSelected: boolean) => {
        if (!isSelected) {
          ++availableLines;
        }
      });
      return availableLines;
    }

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        let chain: Chain = {
          row,
          col,
          length: 0,
        };

        let prevDirection = null;
        let bfsRow = row;
        let bfsCol = col;

        while (true) {
          if (bfsRow < 0 || bfsRow >= rows || bfsCol < 0 || bfsCol >= cols) {
            // We have exited the map, which means this is an open chain
            chains.open.push(chain);
            break;
          }

          if (prevDirection !== null) {
            map[bfsRow][bfsCol][(prevDirection + 2) % 4] = true;
          }

          const availableLines = availableLineCount(bfsRow, bfsCol);

          if (availableLines === 1) {
            ++chain.length;
            let direction = null;
            map[bfsRow][bfsCol].forEach(
              (isSelected: boolean, dir: Direction) => {
                if (!isSelected) {
                  direction = dir;
                }
              },
            );

            if (direction === null) {
              throw new Error('direction should never be null');
            }

            map[bfsRow][bfsCol][direction] = true;
            bfsRow = bfsRow + DIR[direction].row;
            bfsCol = bfsCol + DIR[direction].col;
            prevDirection = direction;

            continue;
          }

          if (availableLines === 0) {
            // We have reached a completely closed box, which means this is a
            // closed chain
            if (prevDirection !== null) {
              ++chain.length;
            }
            chains.closed.push(chain);
          } else {
            // We have reached a non-closable box, which means this is an
            // open chain
            chains.open.push(chain);
          }
          break;
        }
      }
    }

    return {
      closed: chains.closed
        .filter((chain: Chain) => chain.length > 0)
        .sort(this._chainComparator),
      open: chains.open
        .filter((chain: Chain) => chain.length > 0)
        .sort(this._chainComparator),
    }
  }

  _chainComparator(a: Chain, b: Chain) {
    if (a.length > b.length) {
      return -1;
    } else if (a.length < b.length) {
      return 1;
    }
    return 0;
  }

  /**
   * This function performs various checks in order to pick the optimal line to
   * select. In case there is a single optimal line, the function will continue
   * executing recursively in order to count the score the player can get. If
   * there are multiple options, the recursive minimax algorithm will be applied
   * instead.
   */
  _runMinimax(originalGameState: GameState, currentMap: Map, depth: number = 1): {
    line: ?Line,
    maxScore: number,
  } {
    if (depth >= MAX_RECURSION_DEPTH) {
      return {
        line: null,
        maxScore: 0,
      };
    }

    const rows = originalGameState.getRows();
    const cols = originalGameState.getCols();

    /**
     * If there are adjacent boxes with 3 or 4 unused lines, choose the line
     * which completes a box. If there is no such line, select any line which
     * is in between the two boxes from the condition. This way, we are not
     * providing any opportunities for the oponent to complete a box.
     */
    const linesByBoxAvailableLineCount =
      this._getLinesGroupedByBoxAvailableLineCount(currentMap, rows, cols);
    if (
      linesByBoxAvailableLineCount[3].length +
        linesByBoxAvailableLineCount[4].length > 0
    ) {
      let line;
      if (linesByBoxAvailableLineCount[1].length > 0) {
        line = linesByBoxAvailableLineCount[1][0];
        if (currentMap[line.row] && currentMap[line.row][line.col]) {
          currentMap[line.row][line.col][line.direction] = true;
        }
        if (currentMap[line.row + DIR[line.direction].row] && currentMap[line.row + DIR[line.direction].row][line.col + DIR[line.direction].col]) {
          currentMap[line.row + DIR[line.direction].row][line.col + DIR[line.direction].col][(line.direction + 2) % 4] = true;
        }
        return {
          line: originalGameState.getLine(line.row, line.col, line.direction),
          maxScore: 1 + this._runMinimax(originalGameState, currentMap, depth + 1).maxScore,
        };
      } else {
        line = [
          ...linesByBoxAvailableLineCount[3],
          ...linesByBoxAvailableLineCount[4],
        ][0];
        if (currentMap[line.row] && currentMap[line.row][line.col]) {
          currentMap[line.row][line.col][line.direction] = true;
        }
        if (currentMap[line.row + DIR[line.direction].row] && currentMap[line.row + DIR[line.direction].row][line.col + DIR[line.direction].col]) {
          currentMap[line.row + DIR[line.direction].row][line.col + DIR[line.direction].col][(line.direction + 2) % 4] = true;
        }
        return {
          line: originalGameState.getLine(line.row, line.col, line.direction),
          maxScore: 0,
        };
      }
    }

    let box;
    let line;

    /**
     * Chains are a sequence of boxes where the first one can be completed,
     * which then makes it possible to complete another one, etc. They can be
     * closed (all the boxes within a closed polygon can be completed) or open.
     * Depending on the number of chains and their type, we might choose to not
     * complete then if it is the optimal tactic.
     */
    const chains = this._getAllChains(this._cloneMap(currentMap), rows, cols);
    const allChains = [
      ...chains.closed,
      ...chains.open,
    ].sort(this._chainComparator);

    // If there is an open chain that is not of length 2, use it
    // OR
    // If there is a closed chain that is not of length 4, use it
    // OR
    // If there are multiple chains, select a line in the longest one.
    if (chains.open.length > 0) {
      if (chains.open[0].length > 2) {
        box = chains.open[0];
        line = this._getLineForBox(originalGameState, box.row, box.col);
      } else if (chains.open[chains.open.length - 1].length < 2) {
        box = chains.open[chains.open.length - 1];
        line = this._getLineForBox(originalGameState, box.row, box.col);
      }
    } else if (chains.closed.length > 0) {
      if (chains.closed[0].length > 4) {
        box = chains.closed[0];
        line = this._getLineForBox(originalGameState, box.row, box.col);
      } else if (chains.closed[chains.closed.length - 1].length < 4) {
        box = chains.closed[chains.closed.length - 1];
        line = this._getLineForBox(originalGameState, box.row, box.col);
      }
    } else if (allChains.length > 1) {
      box = allChains[0];
      line = this._getLineForBox(originalGameState, box.row, box.col);
    }

    if (line) {
      if (currentMap[line.getRow()] && currentMap[line.getRow()][line.getCol()]) {
        currentMap[line.getRow()][line.getCol()][line.getDirection()] = true;
      }
      if (currentMap[line.getRow() + DIR[line.getDirection()].row] && currentMap[line.getRow() + DIR[line.getDirection()].row][line.getCol() + DIR[line.getDirection()].col]) {
        currentMap[line.getRow() + DIR[line.getDirection()].row][line.getCol() + DIR[line.getDirection()].col][(line.getDirection() + 2) % 4] = true;
      }
      return {
        line,
        maxScore: 1 + this._runMinimax(originalGameState, currentMap, depth + 1).maxScore,
      };
    }

    // At this point, either all boxes are missing two lines, or we are left
    // with only one chain which is either open and of length 2, or closed and
    // of length 4.
    let bestChoice;
    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        let availableLines = 0;
        currentMap[i][j].forEach(selectedLine => {
          if (!selectedLine) {
            ++availableLines;
          }
        });
        for (let k = 0; k < 4; ++k) {
          if (currentMap[i][j][k]) {
            continue;
          }
          if (
            k === Directions.UP ||
            k == Directions.LEFT ||
            (k === Directions.DOWN && i === rows - 1) ||
            (k === Directions.RIGHT && j === cols -1)
          ) {
            const nextMap = this._cloneMap(currentMap);
            nextMap[i][j][k] = true;
            if (nextMap[i + DIR[k].row] && nextMap[i + DIR[k].row][j + DIR[k].col]) {
              nextMap[i + DIR[k].row][j + DIR[k].col][(k + 2) % 4] = true;
            }
            // Mark the current line
            // Do the recursion
            let choice;
            if (availableLines === 1) {
              choice = {
                line: originalGameState.getLine(i, j, k),
                maxScore: 1 + this._runMinimax(originalGameState, nextMap, depth + 1).maxScore,
              }
            } else {
              choice = {
                line: originalGameState.getLine(i, j, k),
                maxScore: -this._runMinimax(originalGameState, nextMap, depth + 1).maxScore,
              }
            }
            if (!bestChoice || choice.maxScore > bestChoice.maxScore) {
              bestChoice = choice;
            }
          }
        }
      }
    }

    if (bestChoice) {
      return bestChoice;
    }

    return {
      line: super.run(originalGameState),
      maxScore: 0,
    }
  }

  /**
   * Tries to find the best line to select using the minimax algorithm.
   */
  run(gameState: GameState): ?Line {
    const line = this._runMinimax(
      gameState,
      this._getMapFromGameState(gameState),
    ).line;
    return line ? line : super.run(gameState);
  }
}
