/**
 * @flow
 */

'use strict';

import ActionTypes from '../constants/ActionTypes';
import Directions, {type Direction} from '../constants/Directions';
import Dispatcher from './Dispatcher';
import {Record} from 'immutable';
import {ReduceStore} from 'flux/utils';
import GameStates, {type GameState} from '../constants/GameStates';
import Line from './Line'
import Players, {type Player} from '../constants/Players';

const State = Record({
  gameState: GameStates.HOME,
  lines: [],
  currentPlayer: Players.PLAYER_ONE,
  rows: 0,
  cols: 0,
});

class GameStore extends ReduceStore {
  state: GameState;
  lines: Array<Array<{down?: Line, right?: Line}>>;
  currentPlayer: Player;
  rows: number;
  cols: number;

  constructor() {
    super(Dispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: Object) {
    switch (action.type) {
      case ActionTypes.SELECT_LINE:
        return this.selectLine(state, action.i, action.j, action.direction);
      case ActionTypes.START_GAME:
        return this.startGame(action.rows, action.cols);
      default:
        return state;
    }
  }

  startGame(rows: number, cols: number): State {
    let lines = [];
    for (let i = 0; i <= rows; i++) {
      lines[i] = [];
      for (let j = 0; j <= cols; j++) {
        lines[i][j] = {};
        if (i !== rows - 1) {
          lines[i][j][Directions.DOWN] = new Line(i, j, Directions.DOWN);
        }
        if (j !== cols - 1) {
          lines[i][j][Directions.RIGHT] = new Line(i, j, Directions.RIGHT);
        }
      }
    }

    return new State({
      gameState: GameStates.GAME,
      lines: lines,
      currentPlayer: Players.PLAYER_ONE,
      rows: rows,
      cols: cols,
    });
  }

  selectLine(state: State, i: number, j: number, direction: Direction) {
    if (i >= state.rows || i < 0 || j >= state.cols || j < 0) {
      throw 'Invalid coordinates for the line at the given starting point';
    }

    const line = state.lines[i][j][direction];
    if (!line) {
      throw 'Invalid direction for the line at the given starting point'
    }

    if (!!line.getOwner()) {
      throw 'Line has already been selected';
    }

    line.setOwner(state.currentPlayer);

    if (this.isGameComplete()) {
      state = state.set('gameState', GameStates.COMPLETED);
    } else {
      state = state.set(
        'currentPlayer',
        state.currentPlayer === Players.PLAYER_ONE
          ? Players.PLAYER_TWO
          : Players.PLAYER_ONE,
      );
    }

    return state;
  }

  isGameComplete(): boolean {
    return this.getState().lines.every(a => a.every(b => {
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
