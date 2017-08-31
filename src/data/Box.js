/**
 * @flow
 */

'use strict';

import Line from './Line';
import {type Player} from '../constants/Players';

export default class Box {
  lines: Array<Line>;

  constructor(lines: Array<Line>) {
    this.lines = lines;
  }

  getOwner(): ?Player {
    let owner = null;
    let ownerIteration = -1;
    for (let i = 0; i < 4; ++i) {
      const line = this.lines[i];
      if (line.getOwner() === null) {
        return null;
      }
      if (line.getIteration() > ownerIteration) {
        owner = line.getOwner();
        ownerIteration = line.getIteration();
      }
    }
    return owner;
  }

  getSelectedLineCount(): number {
    let count = 0;
    this.lines.forEach(line => {
      if (line.getOwner() !== null) {
        ++count;
      }
    });
    return count;
  }
}
