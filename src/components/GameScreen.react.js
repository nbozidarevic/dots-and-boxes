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
  uiState: UIState,
}

class GameScreen extends React.Component<{}, State> {
  static getStores(): Array<ReduceStore> {
    return [GameStore];
  }

  static calculateState(): State {
    let rows = 0;
    let cols = 0;
    const uiState = GameStore.getUIState();
    if (this.isValidUIState(uiState)) {
      rows = GameStore.getRows();
      cols = GameStore.getCols();
    }
    return {
      rows,
      cols,
      uiState,
    };
  }

  static isValidUIState(uiState: UIState): boolean {
    return uiState === UIStates.GAME || uiState === UIStates.COMPLETED;
  }

  render() {
    const {uiState} = this.state;
    if (uiState !== UIStates.GAME && uiState !== UIStates.COMPLETED) {
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
    const {rows, cols} = this.state;
    const lines = [];

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        lines.push(
          <Line
            row={i}
            col={j}
            direction={Directions.UP}
            key={i + '_' + j + '_up'}
          />,
          <Line
            row={i}
            col={j}
            direction={Directions.LEFT}
            key={i + '_' + j + '_left'}
          />
        );
        if (i === rows - 1) {
          lines.push(
            <Line
              row={i}
              col={j}
              direction={Directions.DOWN}
              key={i + '_' + j + '_down'}
            />,
          );
        }

        if (j === cols - 1) {
          lines.push(
            <Line
              row={i}
              col={j}
              direction={Directions.RIGHT}
              key={i + '_' + j + '_right'}
            />,
          );
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
