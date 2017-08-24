/**
 * @flow
 */

import GameStates, {type GameState} from '../constants/GameStates.js';
import type {Player} from '../constants/Players.js';

class GameStore {
  state: GameState;

  constructor() {
    this.state = GameStates.HOME;
  }

  init(rows: number, cols: number, playerA: Player, playerB: Player) {

  }
}

export default new GameStore();
