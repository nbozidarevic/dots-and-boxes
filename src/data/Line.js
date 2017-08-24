/**
 * @flow
 */

import Directions, {type Direction} from '../constants/Directions';
import {type Player} from '../constants/Players';

export default class Line {
  x: number;
  y: number;
  owner: ?Player;
  direction: Direction;

  constructor(x: number, y: number, direction: Direction) {
    this.x = x;
    this.y = y;
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
