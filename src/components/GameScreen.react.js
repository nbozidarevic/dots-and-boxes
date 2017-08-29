/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Dot from '../components/Dot.react';
import GameStates, {type GameState} from '../constants/GameStates';
import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';

type State = {
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
    };
  }

  render() {
    const {gameState} = this.state;
    if (gameState !== GameStates.GAME) {
      return null;
    }
    return (
      <div className="board">
        {this._getDots()}
      </div>
    );
  }

  _getDots = (): Array<ReactNode> => {
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
