/**
 * @flow
 */

'use strict';

import GameState from '../states/GameState';
import Greedy from './Greedy';
import Line from '../data/Line';

export default class SmartGreedy extends Greedy {
  run(gameState: GameState): ?Line {
    const closingLines = [];
    const remainingLines = [];

    gameState.forEachAvailableLine(line => {
      const boxes = line.getBoxes();
      if (boxes.some(box => box.getSelectedLineCount() === 3)) {
        closingLines.push(line);
      } else if (boxes.every(box => box.getSelectedLineCount() <= 1)) {
        remainingLines.push(line);
      }
    });

    if (closingLines.length > 0) {
      return this.getRandomLine(closingLines);
    } else if (remainingLines.length > 0) {
      return this.getRandomLine(remainingLines);
    }

    return super.run(gameState)
  }

  static getName(): string {
    return 'Računar: Pametniji Pohlepni';
  }

  static getDescription(): string {
    return `Računar će uvek odabrati prvu liniju koju nađe koja zatvara kutiju.
      Ukoliko ne postoji nijedna takva linija, odabraće neku drugu liniju koja
      ne omogućava protivniku da zatvori kutiju. Ukoliko ne postoji ni takva
      linija, odabraće neku drugu liniju nasumično.`
  }
}
