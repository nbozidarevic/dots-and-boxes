/**
 * @flow
 */

'use strict';

import ActionTypes from '../constants/ActionTypes';
import Behaviour from '../behaviours/Behaviour.js';
import Characters, {type Character} from '../constants/Characters';
import Directions, {type Direction} from '../constants/Directions';
import Dispatcher from './Dispatcher';
import {Record} from 'immutable';
import {ReduceStore} from 'flux/utils';
import UIStates, {type UIState} from '../constants/UIStates';
import Box from './Box';
import Line from './Line';
import Players, {type Player} from '../constants/Players';

const State = Record({
  gameState: UIStates.HOME,
  lines: [],
  currentPlayer: Players.PLAYER_ONE,
  rows: 0,
  cols: 0,
  iteration: 0,
  characters: [null, null],
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
      gameState: UIStates.GAME,
      lines: lines,
      currentPlayer: Players.PLAYER_ONE,
      rows: rows,
      cols: cols,
      iteration: 0,
      characters: [player_one, player_two],
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
      state = state.set('gameState', UIStates.COMPLETED);
    } else if (
      this.getBoxesForLine(line).every(box => box.getOwner() === null)
    ) {
      state = state.set(
        'currentPlayer',
        this.getCurrentPlayer() === Players.PLAYER_ONE
          ? Players.PLAYER_TWO
          : Players.PLAYER_ONE,
      );
    }

    return state;
  }

  isGameComplete(): boolean {
    return this.getAllLines().every(line => line.getOwner() !== null);
  }

  getRows(): number {
    return this.getState().rows;
  }

  getCols(): number {
    return this.getState().cols;
  }

  getLine(row: number, col: number, direction: Direction): Line {
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
    return this.getState().currentPlayer;
  }

  getCurrentCharacter(): Character {
    return this.getState().characters[this.getCurrentPlayer()];
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
    return this.getState().characters;
  }

  getScore(): Array<number> {
    const score = [0, 0];
    for (let i = 0; i < this.getRows(); ++i) {
      for (let j = 0; j < this.getCols(); ++j) {
        const box = this.getBox(i, j);
        if (box) {
          const owner = box.getOwner();
          if (owner !== null && owner !== undefined) {
            ++score[owner];
          }
        }
      }
    }
    return score;
  }

  getUIState(): UIState {
    return this.getState().gameState;
  }
}

export default new GameStore();
