/**
 * @flow
 */

'use strict';

import ActionTypes from '../constants/ActionTypes';
import Behaviour from '../behaviours/Behaviour.js';
import Characters, {type Character} from '../constants/Characters';
import Directions, {type Direction} from '../constants/Directions';
import Dispatcher from './Dispatcher';
import GameState from '../states/GameState';
import {Record} from 'immutable';
import {ReduceStore} from 'flux/utils';
import Box from './Box';
import BoxNew from './BoxNew';
import Line from './Line';
import Players, {type Player} from '../constants/Players';
import UIStates, {type UIState} from '../constants/UIStates';

const State = Record({
  uiState: UIStates.HOME,
  lines: [],
  iteration: 0,

  gameState: null,
});

class GameStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: Object) {
    switch (action.type) {
      case ActionTypes.SELECT_LINE:
        return this.selectLine(state, action.row, action.col, action.direction);
      case ActionTypes.START_GAME:
        return this.startGame(
          action.rows,
          action.cols,
          action.player_one,
          action.player_two,
        );
      default:
        return state;
    }
  }

  startGame(
    rows: number,
    cols: number,
    player_one: Character,
    player_two: Character,
  ): State {
    let lines = [];
    for (let i = 0; i <= rows; i++) {
      lines[i] = [];
      for (let j = 0; j <= cols; j++) {
        lines[i][j] = {};
        if (i !== rows) {
          lines[i][j][Directions.DOWN] = new Line(i, j, Directions.DOWN);
        }
        if (j !== cols) {
          lines[i][j][Directions.RIGHT] = new Line(i, j, Directions.RIGHT);
        }
      }
    }

    return new State({
      uiState: UIStates.GAME,
      lines: lines,
      iteration: 0,

      gameState: new GameState(rows, cols, player_one, player_two),
    });
  }

  selectLine(state: State, i: number, j: number, direction: Direction) {
    if (i > this.getRows() || i < 0 || j > this.getCols() || j < 0) {
      throw 'Invalid coordinates for the line at the given starting point';
    }

    const line = this.getLine(i, j, direction);
    if (!line) {
      throw 'Invalid direction for the line at the given starting point'
    }

    if (line.getOwner() !== null) {
      throw 'Line has already been selected';
    }

    line.setOwner(this.getCurrentPlayer());
    line.setIteration(this.getCurrentIteration());
    state = state.set('iteration', this.getCurrentIteration() + 1);

    if (this.isGameComplete()) {
      state = state.set('uiState', UIStates.COMPLETED);
    }

    if (direction === Directions.DOWN) {
      direction = Directions.LEFT;
    } else {
      direction = Directions.UP;
    }
    state.gameState.selectLine(i, j, direction);

    return state;
  }

  isGameComplete(): boolean {
    return this.getState().gameState.isGameComplete();
  }

  getRows(): number {
    return this.getState().gameState.getRows();
  }

  getCols(): number {
    return this.getState().gameState.getCols();
  }

  getLine(row: number, col: number, direction: Direction): Line {;
    return this.getState().lines[row][col][direction];
  }

  getAllLines(): Array<Line> {
    const lines = [];
    this.getState().lines.forEach(a => a.forEach(b => {
      if (b[Directions.DOWN]) {
        lines.push(b[Directions.DOWN]);
      }
      if (b[Directions.RIGHT]) {
        lines.push(b[Directions.RIGHT]);
      }
    }));
    return lines;
  }

  getAllAvailableLines(): Array<Line> {
    return this.getAllLines().filter(line => line.getOwner() === null);
  }

  getCurrentPlayer(): Player {
    return this.getState().gameState.getCurrentPlayer();
  }

  getCurrentCharacter(): Character {
    return this.getState().gameState.getPlayers()[this.getCurrentPlayer()];
  }

  getCurrentIteration(): number {
    return this.getState().iteration;
  }

  getBox(row: number, col: number): ?Box {
    if (row < 0 || row >= this.getRows() || col < 0 || col >= this.getCols()) {
      return null;
    }
    return new Box([
      this.getLine(row, col, Directions.DOWN),
      this.getLine(row, col, Directions.RIGHT),
      this.getLine(row, col + 1, Directions.DOWN),
      this.getLine(row + 1, col, Directions.RIGHT),
    ]);
  }

  getBoxNew(row: number, col: number): BoxNew {
    return this.getState().gameState.getBox(row, col);
  }

  getBoxesForLine(line: Line): Array<Box> {
    const potentialBoxes = [];
    if (line.getDirection() === Directions.DOWN) {
      potentialBoxes.push(this.getBox(line.getRow(), line.getCol()));
      potentialBoxes.push(this.getBox(line.getRow(), line.getCol() - 1));
    } else if (line.getDirection() == Directions.RIGHT) {
      potentialBoxes.push(this.getBox(line.getRow(), line.getCol()));
      potentialBoxes.push(this.getBox(line.getRow() - 1, line.getCol()));
    }

    const boxes = [];
    potentialBoxes.forEach(box => {if (box) {boxes.push(box)}});

    return boxes;
  }

  getCharacters(): Array<Character> {
    return this.getState().gameState.getPlayers();
  }

  getScore(): Array<number> {
    return this.getState().gameState.getScore();
  }

  getUIState(): UIState {
    return this.getState().uiState;
  }
}

export default new GameStore();
