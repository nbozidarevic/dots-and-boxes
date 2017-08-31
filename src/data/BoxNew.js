/**
 * @flow
 */

'use strict';

import {type Direction} from '../constants/Directions';
import Line from './Line';

export default class Box {
  _row: number;
  _col: number;
  _lines: Array<Line>;

  constructor(row: number, col: number, lines: Array<Line>) {
    this._row = row;
    this._col = col;
    this._lines = [...lines];
    this._lines.forEach(line => line.addBox(this));
  }

  getLine(direction: Direction): Line {
    return this._lines[direction];
  }
}
