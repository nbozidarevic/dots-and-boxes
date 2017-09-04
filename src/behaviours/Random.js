/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Behaviour from './Behaviour';
import GameState from '../states/GameState';
import Line from '../data/Line';

export default class Random extends Behaviour {
  run(gameState: GameState): ?Line {
    const lines = [];
    gameState.forEachAvailableLine((line: Line) => {
      lines.push(line);
    });
    return this.getRandomLine(lines);
  }
}
