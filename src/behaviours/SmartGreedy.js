/**
 * @flow
 */

'use strict';

import Behaviour from './Behaviour';
import GameStore from '../data/GameStore';
import Line from '../data/Line';

export default class SmartGreedy extends Behaviour {
  run(): ?Line {
    const lines = [[], [], []];

    GameStore.getAllAvailableLines().forEach(line => {
      const boxes = line.getBoxes();
      if (boxes.some(box => box.getSelectedLineCount() === 3)) {
        lines[0].push(line);
      } else if (boxes.every(box => box.getSelectedLineCount() <= 1)) {
        lines[1].push(line);
      } else {
        lines[2].push(line);
      }
    });

    for (let i = 0; i < 3; ++i) {
      if (lines[i].length > 0) {
        return this.getRandomLine(lines[i]);
      }
    }
  }
}
