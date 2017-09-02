/**
 * @flow
 */

'use strict';

import Behaviour from './Behaviour';
import GameStore from '../data/GameStore';
import Line from '../data/Line';

export default class Greedy extends Behaviour {
  run(): ?Line {
    const allAvailableLines = GameStore.getAllAvailableLines();
    const closingLines = [];

    GameStore.getAllAvailableLines().forEach(line => {
      const boxes = line.getBoxes();
      if (boxes.some(box => box.getSelectedLineCount() === 3)) {
        closingLines.push(line);
      }
    });

    return this.getRandomLine(
      closingLines.length > 0
        ? closingLines
        : allAvailableLines,
    );
  }
}
