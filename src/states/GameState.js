/**
 * @flow
 */

'use strict';

import Box from '../data/Box';
import {type Character} from '../constants/Characters';
import CoreGameState from './CoreGameState';
import Directions, {type Direction} from '../constants/Directions';
import Line from '../data/Line';
import Players, {type Player} from '../constants/Players';

export default class GameState {
  _coreGameState: CoreGameState;
  _currentPlayer: Player;
  _lines: Array<Array<Array<Line>>>;
  _boxes: Array<Array<Box>>;
  _score: Array<number>;

  constructor(
    rows: number,
    cols: number,
    playerOne: Character,
    playerTwo: Character,
  ) {
    this._coreGameState = new CoreGameState(rows, cols, playerOne, playerTwo);
    this._currentPlayer = Players.PLAYER_ONE;
    this._score = [0, 0];

    const directions = [
      Directions.UP,
      Directions.RIGHT,
      Directions.DOWN,
      Directions.LEFT,
    ].sort();

    this._lines = [];
    this._boxes = [];
    for (let i = 0; i < rows; ++i) {
      this._boxes[i] = [];
      for (let j = 0; j < cols; ++j) {
        this._boxes[i][j] = new Box(
          i,
          j,
          (direction: Direction) => this._getOrCreateLine(i, j, direction),
        );
      }
    }
  }

  getRows(): number {
    return this._coreGameState.getRows();
  }

  getCols(): number {
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
    if (
      row === this.getRows() &&
      col < this.getCols() &&
      direction === Directions.UP
    ) {
      --row;
      direction = Directions.DOWN;
    } else if (
      row < this.getRows() &&
      col === this.getCols() &&
      direction === Directions.LEFT
    ) {
      --col;
      direction = Directions.RIGHT;
    }
    return this.getBox(row, col).getLine(direction);
  }

  forEachBox(callback: (Box) => void) {
    this._boxes.forEach(boxesRow => boxesRow.forEach(box => callback(box)));
  }

  forEachLine(callback: (Line) => void) {
    this._lines.forEach(
      boxesRow => boxesRow.forEach(
        box => box.forEach(line => callback(line)),
      ),
    );
  }

  getCurrentPlayer(): Player {
    return this._currentPlayer;
  }

  getPlayers(): Array<Character> {
    return this._coreGameState.getPlayers();
  }

  getScore(): Array<number> {
    return this._score;
  }

  isGameComplete(): boolean {
    return (
      this._score[Players.PLAYER_ONE] + this._score[Players.PLAYER_TWO] ===
        this.getRows() * this.getCols()
    );
  }

  selectLine(row: number, col: number, direction: Direction) {
    const line = this.getLine(row, col, direction);
    line.setOwner(this._currentPlayer);

    let boxCompleted = false;
    line.getBoxes().forEach(box => {
      if (box.getOwner() === this._currentPlayer) {
        ++this._score[this._currentPlayer];
        boxCompleted = true;
      }
    })
    if (!boxCompleted) {
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

    if (!this._lines[row]) {
      this._lines[row] = [];
    }
    if (!this._lines[row][col]) {
      this._lines[row][col] = [];
    }
    if (!this._lines[row][col][direction]) {
      this._lines[row][col][direction] = new Line(row, col, direction);
    }

    return this._lines[row][col][direction];
  }
}
