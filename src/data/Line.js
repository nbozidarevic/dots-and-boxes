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

  constructor(row: number, col: number, direction: Direction) {
    this.row = row;
    this.col = col;
    this.owner = null;
    this.direction = direction;
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
}
