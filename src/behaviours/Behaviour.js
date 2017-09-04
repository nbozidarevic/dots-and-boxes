/**
 * @flow
 */

'use strict';

import GameState from '../states/GameState';
import Line from '../data/Line';

export default class Behaviour {
  run(gameState: GameState): ?Line {
    throw new Error('run() method not implemented');
  }

  getRandomLine(lines: Array<Line>): Line {
    return lines[Math.floor(Math.random() * lines.length)];
  }
}
