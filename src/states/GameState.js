/**
 * @flow
 */

'use strict';

import Box from '../data/BoxNew';
import CoreGameState from './CoreGameState';
import {type Character} from '../constants/Characters';
import Directions, {type Direction} from '../constants/Directions';
import Line from '../data/Line';
import Players, {type Player} from '../constants/Players';

export default class GameState {
  _coreGameState: CoreGameState;
  _currentPlayer: Player;
  _lines: Array<Array<Array<Line>>>;
  _boxes: Array<Array<Box>>;

  constructor(
    rows: number,
    cols: number,
    playerOne: Character,
    playerTwo: Character,
  ) {
    this._coreGameState = new CoreGameState(rows, cols, playerOne, playerTwo);
    this._currentPlayer = Players.PLAYER_ONE;

    const directions = [
      Directions.UP,
      Directions.RIGHT,
      Directions.DOWN,
      Directions.LEFT,
    ].sort();

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        this._boxes[i][j] = new Box(
          i,
          j,
          (direction: Direction) => this._getOrCreateLine(i, j, direction),
        );
      }
    }
  }

  getCols(): number {
    return this._coreGameState.getRows();
  }

  getRows(): number {
    return this._coreGameState.getCols();
  }

  getBox(row: number, col: number): Box {
    if (row < 0 || col < 0 || row >= this.getRows() || col >= this.getCols()) {
      throw new Error('Invalid box position (' + row + ', ' + col + ')');
    }
    const box = this._boxes[row][col];
    if (!box) {
      throw new Error('Box at (' + row + ', ' + col + ') not initialized');
    }
    return box;
  }

  getLine(row: number, col: number, direction: Direction): Line {
    return this.getBox(row, col).getLine(direction);
  }

  selectLine(row: number, col: number, direction: Direction, player: Player) {
    const line = this.getLine(row, col, direction);
    line.setOwner(player);
    if (line.getBoxes().every(box => box.getOwner() === null)) {
      this._currentPlayer = (this._currentPlayer + 1) % 2;
    }
  }

  _getOrCreateLine(row: number, col: number, direction: Direction): Line {
    if (direction === Directions.RIGHT) {
      direction = Directions.LEFT;
      ++col;
    } else if (direction === Directions.DOWN) {
      direction = Directions.UP;
      ++row;
    }

    if (row < 0 || col < 0 || row > this.getRows() || col > this.getCols()) {
      throw new Error('Invalid box position (' + row + ', ' + col + ')');
    }
    if (
      (
        row === this.getRows() &&
        (col === this.getCols() || direction !== Directions.UP)
      ) ||
      (
        col === this.getCols() &&
        (row === this.getRows() || direction !== Directions.LEFT)
      )
    ) {
      throw new Error(
        'Invalid box position (' + row + ', ' + col + ') ' +
        'for direction ' + direction,
      );
    }

    if (!this._lines[row][col][direction]) {
      this._lines[row][col][direction] = new Line(row, col, direction);
    }

    return this._lines[row][col][direction];
  }
}
