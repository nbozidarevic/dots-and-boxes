/**
 * @flow
 */

'use strict';

import Directions, {type Direction} from '../constants/Directions';
import {type Player} from '../constants/Players';
import Line from './Line';

export default class Box {
  _row: number;
  _col: number;
  _lines: Array<Line>;
  _owner: ?Player;

  constructor(row: number, col: number, lineGetter: (Direction) => Line) {
    this._row = row;
    this._col = col;
    this._owner = null;

    this._lines = [];
    this._lines[Directions.UP] = lineGetter(Directions.UP);
    this._lines[Directions.RIGHT] = lineGetter(Directions.RIGHT);
    this._lines[Directions.DOWN] = lineGetter(Directions.DOWN);
    this._lines[Directions.LEFT] = lineGetter(Directions.LEFT);

    this._lines.forEach(line => line.addBox(this));
  }

  getRow(): number {
    return this._row;
  }

  getCol(): number {
    return this._col;
  }

  getLine(direction: Direction): Line {
    return this._lines[direction];
  }

  getAvailableLines(): Array<Line> {
    return this._lines.filter((line: Line) => line.getOwner() === null);
  }

  getOwner(): ?Player {
    return this._owner;
  }

  setOwner(player: Player) {
    if (this._owner !== null) {
      return;
    }
    if (this._lines.some(line => line.getOwner() === null)) {
      return;
    }
    this._owner = player;
  }

  getSelectedLineCount(): number {
    let count = 0;
    this._lines.forEach(line => {
      if (line.getOwner() !== null) {
        ++count;
      }
    });
    return count;
  }
}
