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
  remainingSimulations: 0,
  uiState: UIStates.HOME,
});

class GameStore extends ReduceStore {
  results: Array<Array<number>> = [];

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
      case ActionTypes.START_SIMULATION:
      this.results = [];
        return this.startSimulation(
          action.rows,
          action.cols,
          action.player_one,
          action.player_two,
        );
      case ActionTypes.START_NEXT_SIMULATION:
        return this.startNextSimulation();
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
      remainingSimulations: 0,
      uiState: UIStates.GAME,
    });
  }

  startSimulation(
    rows: number,
    cols: number,
    player_one: Character,
    player_two: Character,
  ): State {
    return new State({
      gameState: new GameState(rows, cols, player_one, player_two),
      remainingSimulations: 100,
      uiState: UIStates.SIMULATION,
    });
  }

  startNextSimulation(): State {
    const state = this.getState();
    let {gameState, remainingSimulations, uiState} = state;

    this.results.push(gameState.getScore());

    --remainingSimulations;
    if (remainingSimulations > 0) {
      gameState = new GameState(
        gameState.getRows(),
        gameState.getCols(),
        gameState.getPlayers()[0],
        gameState.getPlayers()[1],
      );
    } else {
      const wins = [0, 0];
      const avg = [0, 0];
      const perc = [0, 0];

      this.results.forEach(result => {
        avg[0] += result[0];
        avg[1] += result[1];
        if (result[0] > result[1]) {
          ++wins[0];
        } else if (result[0] < result[1]) {
          ++wins[1];
        }
      });

      avg[0] /= this.results.length;
      avg[1] /= this.results.length;
      perc[0] = wins[0] / this.results.length * 100;
      perc[1] = wins[1] / this.results.length * 100;

      console.log(this.results);
      console.log(wins);
      console.log(avg);
      console.log(perc);
    }

    return new State({
      gameState,
      remainingSimulations,
      uiState,
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

  getGameState(): GameState {
    return this.getState().gameState;
  }

  getRemainingSimulations(): number {
    return this.getState().remainingSimulations;
  }
}

export default new GameStore();
