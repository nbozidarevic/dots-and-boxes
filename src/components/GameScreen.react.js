/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Directions from '../constants/Directions';
import Dot from '../components/Dot.react';
import Line from '../components/Line.react';
import GameStates, {type GameState} from '../constants/GameStates';
import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';

type State = {
  rows: number,
  cols: number,
  gameState: GameState,
}

class GameScreen extends React.Component<{}, State> {
  static getStores() {
    return [GameStore];
  }

  static calculateState() {
    return {
      rows: GameStore.getState().rows,
      cols: GameStore.getState().cols,
      gameState: GameStore.getState().gameState,
      player: GameStore.getState().currentPlayer,
    };
  }

  render() {
    const {gameState} = this.state;
    if (gameState !== GameStates.GAME) {
      return null;
    }
    return (
      <div className="board">
        {this._getLines()}
        {this._getDots()}
      </div>
    );
  }

  _getLines = (): Array<Line> => {
    let line;
    const lines = [];
    for (let i = 0; i <= this.state.rows; ++i) {
      for (let j = 0; j <= this.state.cols; ++j) {
        line = GameStore.getLine(i, j, Directions.DOWN);
        if (line) {
          lines.push(
            <Line
              row={line.x}
              col={line.y}
              direction={line.direction}
              owner={line.owner}
            />
          );
        }
        line = GameStore.getLine(i, j, Directions.RIGHT);
        if (line) {
          lines.push(
            <Line
              row={line.x}
              col={line.y}
              direction={line.direction}
              owner={line.owner}
            />
          );
        }
      }
    }
    return lines;
  };

  _getDots = (): Array<Dot> => {
    const dots = [];
    for (let i = 0; i <= this.state.rows; ++i) {
      for (let j = 0; j <= this.state.cols; ++j) {
        dots.push(<Dot row={i} col={j} />);
      }
    }
    return dots;
  };
}

GameScreen = Container.create(GameScreen);

export default GameScreen;
