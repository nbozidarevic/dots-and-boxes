/**
 * @ flow
 */

'use strict';

import Actions from '../data/Actions';
import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';

document.debug = Actions;

class Root extends React.Component {
  static getStores() {
    return [GameStore];
  }

  static calculateState() {
    return {
      rows: GameStore.getState().rows,
      cols: GameStore.getState().cols,
      player: GameStore.getState().currentPlayer,
      state: GameStore.getState().gameState,
    };
  }

  render() {
    return (
      <div>
        {this.state.rows}<br />
        {this.state.cols}<br />
        {this.state.player}<br />
        {this.state.state}
      </div>
    );
  }
}

export default Container.create(Root);
