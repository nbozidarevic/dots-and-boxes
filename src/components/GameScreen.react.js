/**
 * @ flow
 */

'use strict';

import Actions from '../data/Actions';
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
      gameState: GameStore.getState().gameState,
    };
  }

  render() {
    const {gameState} = this.state;
    if (gameState !== GameStates.GAME) {
      return null;
    }
    return <div />;
  }
}

GameScreen = Container.create(GameScreen);

export default GameScreen;
