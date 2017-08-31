/**
 * @flow
 */

'use strict';

import Line from '../data/Line';

export default class Behaviour {
  run(): ?Line {
    throw new Error('run() method not implemented');
  }

  getRandomLine(lines: Array<Line>): Line {
    return lines[Math.floor(Math.random() * lines.length)];
  }
}
