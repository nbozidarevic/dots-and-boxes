/**
 * @flow
 */

'use strict';

import Random from './Random';
import GameState from '../states/GameState';
import Line from '../data/Line';

export default class Greedy extends Random {
  run(gameState: GameState): ?Line {
    const closingLines = [];

    gameState.forEachAvailableLine(line => {
      if (line.getBoxes().some(box => box.getSelectedLineCount() === 3)) {
        closingLines.push(line);
      }
    });

    if (closingLines.length > 0) {
      return this.getRandomLine(closingLines);
    }

    return super.run(gameState);
  }

  static getName(): string {
    return 'Računar: Pohlepni';
  }

  static getDescription(): string {
    return `Računar će uvek odabrati prvu liniju koju nađe koja zatvara kutiju.
      Ukoliko ne postoji nijedna takva linija, odabraće neku drugu liniju
      nasumično, i neće paziti na posledice, odnosnu da li protivniku tako
      omogućava da zatvori kutiju.`
  }
}
