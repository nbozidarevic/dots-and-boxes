/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Behaviour from './Behaviour';
import GameStore from '../data/GameStore';

export default class Greedy extends Behaviour {
  run() {
    const lines = [[], [], []];

    GameStore.getAllAvailableLines().forEach(line => {
      const boxes = GameStore.getBoxesForLine(line);
      if (boxes.some(box => box.getSelectedLineCount() === 3)) {
        lines[0].push(line);
      } else if (boxes.every(box => box.getSelectedLineCount() <= 1)) {
        lines[1].push(line);
      } else {
        lines[2].push(line);
      }
    });

    let finalLines;
    if (lines[0].length > 0) {
      finalLines = lines[0];
    } else if (lines[1].length > 0) {
      finalLines = lines[1];
    } else {
      finalLines = lines[2];
    }

    const line = finalLines[Math.floor(Math.random() * finalLines.length)];

    Actions.selectLine(line.getRow(), line.getCol(), line.getDirection());
  }
}
