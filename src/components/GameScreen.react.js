/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Box from '../components/Box.react';
import Directions from '../constants/Directions';
import Dot from '../components/Dot.react';
import Line from '../components/Line.react';
import UIStates, {type UIState} from '../constants/UIStates';
import GameStore from '../data/GameStore';
import {Container, ReduceStore} from 'flux/utils';
import React from 'react';
import ScoreBoard from './ScoreBoard.react';

type State = {
  rows: number,
  cols: number,
  gameState: UIState,
}

class GameScreen extends React.Component<{}, State> {
  static getStores(): Array<ReduceStore> {
    return [GameStore];
  }

  static calculateState(): State {
    return {
      rows: GameStore.getState().rows,
      cols: GameStore.getState().cols,
      gameState: GameStore.getState().gameState,
    };
  }

  render() {
    const {gameState} = this.state;
    if (gameState !== UIStates.GAME && gameState !== UIStates.COMPLETED) {
      return null;
    }
    return (
      <div className="game">
        <ScoreBoard />
        <div className="board">
          {this._getBoxes()}
          {this._getLines()}
          {this._getDots()}
        </div>
      </div>
    );
  }

  _getBoxes(): Array<Box> {
    const boxes = [];
    for (let i = 0; i < this.state.rows; ++i) {
      for (let j = 0; j < this.state.cols; ++j) {
        boxes.push(<Box row={i} col={j} key={i + '_' + j} />);
      }
    }
    return boxes;
  };

  _getLines(): Array<Line> {
    const lines = [];
    for (let i = 0; i <= this.state.rows; ++i) {
      for (let j = 0; j <= this.state.cols; ++j) {
        for (let direction in Directions) {
          const line = GameStore.getLine(i, j, Directions[direction]);
          if (line) {
            lines.push(
              <Line
                row={i}
                col={j}
                direction={Directions[direction]}
                key={i + ' ' + j + ' ' + direction}
              />
            );
          }
        }
      }
    }
    return lines;
  };

  _getDots(): Array<Dot> {
    const dots = [];
    for (let i = 0; i <= this.state.rows; ++i) {
      for (let j = 0; j <= this.state.cols; ++j) {
        dots.push(<Dot row={i} col={j} key={i + '_' + j} />);
      }
    }
    return dots;
  };
}

GameScreen = Container.create(GameScreen);

export default GameScreen;
