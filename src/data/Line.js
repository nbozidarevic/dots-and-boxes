/**
 * @flow
 */

'use strict';

import Box from './BoxNew';
import Directions, {type Direction} from '../constants/Directions';
import {type Player} from '../constants/Players';

export type LineID = {
  row: number,
  col: number,
  dir: Direction,
};

export default class Line {
  row: number;
  col: number;
  owner: ?Player;
  direction: Direction;
  iteration: number;
  _boxes: Array<Box>;

  constructor(row: number, col: number, direction: Direction) {
    this.row = row;
    this.col = col;
    this.owner = null;
    this.direction = direction;
    this.iteration = -1;
    this._boxes = [];
  }

  getID(): LineID {
    return {
      row: this.row,
      col: this.col,
      dir: this.direction,
    };
  }

  getOwner(): ?Player {
    return this.owner;
  }

  setOwner(player: Player) {
    if (this.owner !== null) {
      throw new Error('Line has already been selected');
    }
    this.owner = player;
    this._boxes.forEach(box => box.setOwner(player));
  }

  getIteration(): number {
    return this.iteration;
  }

  setIteration(iteration: number) {
    this.iteration = iteration;
  }

  getDirection(): Direction {
    return this.direction;
  }

  getRow(): number {
    return this.row;
  }

  getCol(): number {
    return this.col;
  }

  addBox(box: Box) {
    this._boxes.push(box);
  }
}
