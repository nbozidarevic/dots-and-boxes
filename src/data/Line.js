/**
 * @flow
 */

'use strict';

import Box from './Box';
import Directions, {type Direction} from '../constants/Directions';
import {type Player} from '../constants/Players';

export type LineID = {
  row: number,
  col: number,
  dir: Direction,
};

export default class Line {
  _row: number;
  _col: number;
  _direction: Direction;
  _boxes: Array<Box>;
  _owner: ?Player;

  constructor(row: number, col: number, direction: Direction) {
    this._row = row;
    this._col = col;
    this._direction = direction;
    this._boxes = [];
    this._owner = null;
  }

  getID(): LineID {
    return {
      row: this._row,
      col: this._col,
      dir: this._direction,
    };
  }

  getOwner(): ?Player {
    return this._owner;
  }

  setOwner(player: Player) {
    if (this._owner !== null) {
      throw new Error('Line has already been selected');
    }
    this._owner = player;
    this._boxes.forEach(box => box.setOwner(player));
  }

  getDirection(): Direction {
    return this._direction;
  }

  getRow(): number {
    return this._row;
  }

  getCol(): number {
    return this._col;
  }

  addBox(box: Box) {
    this._boxes.push(box);
  }

  getBoxes(): Array<Box> {
    return this._boxes;
  }
}
