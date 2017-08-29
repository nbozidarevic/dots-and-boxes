/**
 * @flow
 */

'use strict';

import Directions, {type Direction} from '../constants/Directions';
import {type Player} from '../constants/Players';

export default class Line {
  row: number;
  col: number;
  owner: ?Player;
  direction: Direction;
  iteration: number;

  constructor(row: number, col: number, direction: Direction) {
    this.row = row;
    this.col = col;
    this.owner = null;
    this.direction = direction;
    this.iteration = -1;
  }

  getOwner(): ?Player {
    return this.owner;
  }

  setOwner(player: Player) {
    if (!!this.owner) {
      throw 'Line has already been selected';
    }
    this.owner = player;
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
}
