/**
 * @flow
 */

'use strict';

import Directions, {type Direction} from '../constants/Directions';
import GameStates, {type GameState} from '../constants/GameStates';
import Line from './Line'
import Players, {type Player} from '../constants/Players';

class GameStore {
  state: GameState;
  lines: Array<Array<{down?: Line, right?: Line}>>;
  currentPlayer: Player;
  rows: number;
  cols: number;

  constructor() {
    this.state = GameStates.HOME;
    this.lines = [];
    this.currentPlayer = Players.PLAYER_ONE;
    this.rows = 0;
    this.cols = 0;
  }

  startGame(rows: number, cols: number) {
    let lines = [];
    for (let i = 0; i < rows; i++) {
      lines[i] = [];
      for (let j = 0; j < cols; j++) {
        lines[i][j] = {};
        if (i !== rows - 1) {
          lines[i][j][Directions.DOWN] = new Line(i, j, Directions.DOWN);
        }
        if (j !== cols - 1) {
          lines[i][j][Directions.RIGHT] = new Line(i, j, Directions.RIGHT);
        }
      }
    }

    this.lines = lines;
    this.rows = rows;
    this.cols = cols;
    this.state = GameStates.GAME;

    this.play(Players.PLAYER_ONE);
  }

  play(player: Player) {
    this.currentPlayer = player;
  }

  selectLine(i: number, j: number, direction: Direction) {
    if (i >= this.rows || i < 0 || j >= this.cols || j < 0) {
      throw 'Invalid coordinates for the line at the given starting point';
    }

    const line = this.lines[i][j][direction];
    if (!line) {
      throw 'Invalid direction for the line at the given starting point'
    }

    if (!!line.getOwner()) {
      throw 'Line has already been selected';
    }

    line.setOwner(this.currentPlayer);

    if (this.isGameComplete()) {
      this.state = GameStates.COMPLETED;
    } else {
      this.play(
        this.currentPlayer === Players.PLAYER_ONE
          ? Players.PLAYER_TWO
          : Players.PLAYER_ONE,
      );
    }
  }

  isGameComplete(): boolean {
    return this.lines.every(a => a.every(b => {
      if (b.down && !b.down.getOwner()) {
        return false;
      }
      if (b.right && !b.right.getOwner()) {
        return false;
      }
      return true;
    }));
  }
}

export default new GameStore();
