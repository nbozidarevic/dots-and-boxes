/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import GameStates, {type GameState} from '../constants/GameStates';
import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';

type State = {
  rows: number,
  cols: number,
  gameState: GameState,
}

class HomeScreen extends React.Component<{}, State> {
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
    const {rows, cols, gameState} = this.state;
    if (gameState !== GameStates.HOME) {
      return null;
    }
    return (
      <div>
        <input type="text" value={rows} onChange={this._updateRows} />
        <input type="text" value={cols} onChange={this._updateCols} />
        <input type="button" value="Play" onClick={this._startGame} />
      </div>
    );
  }

  _updateRows = (event: Event) => {
    this.setState({rows: parseInt(event.target.value)});
  };

  _updateCols = (event: Event) => {
    this.setState({cols: parseInt(event.target.value)});
  };

  _startGame = () => {
    const {rows, cols} = this.state;
    Actions.startGame(rows, cols);
  };
}

HomeScreen = Container.create(HomeScreen);

export default HomeScreen;
