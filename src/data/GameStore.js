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
import Line from './Line';
import Players, {type Player} from '../constants/Players';
import UIStates, {type UIState} from '../constants/UIStates';

const State = Record({
  gameState: null,
  uiState: UIStates.HOME,
});

class GameStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  areEqual(a: State, b: State) {
    return false;
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
    return new State({
      gameState: new GameState(rows, cols, player_one, player_two),
      uiState: UIStates.GAME,
    });
  }

  selectLine(state: State, i: number, j: number, direction: Direction): State {
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

  getLine(row: number, col: number, direction: Direction): Line {
    return this.getState().gameState.getLine(row, col, direction);
  }

  getAllLines(): Array<Line> {
    const lines = [];
    this.getState().gameState.forEachLine(line => lines.push(line));
    return lines;
  }

  getAllAvailableLines(): Array<Line> {
    const lines = [];
    this.getState().gameState.forEachLine(line => {
      if (line.getOwner() === null) {
        lines.push(line);
      }
    });
    return lines;
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

  getBox(row: number, col: number): Box {
    return this.getState().gameState.getBox(row, col);
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
