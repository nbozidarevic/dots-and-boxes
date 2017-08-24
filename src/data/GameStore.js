/**
 * @flow
 */

import Directions from '../constants/Directions';
import GameStates, {type GameState} from '../constants/GameStates';
import Line from './Line'

class GameStore {
  state: GameState;
  lines: Array<Array<{down?: Line, right?: Line}>>;

  constructor() {
    this.state = GameStates.HOME;
  }

  startGame(rows: number, cols: number) {
    this.lines = [];
    for (let i = 0; i < rows; i++) {
      this.lines[i] = [];
      for (let j = 0; j < cols; j++) {
        this.lines[i][j] = {};
        if (i !== rows - 1) {
          this.lines[i][j][Directions.DOWN] = new Line(i, j, Directions.DOWN);
        }
        if (j !== cols - 1) {
          this.lines[i][j][Directions.RIGHT] = new Line(i, j, Directions.RIGHT);
        }
      }
    }

    this.state = GameStates.GAME;
  }
}

export default new GameStore();
