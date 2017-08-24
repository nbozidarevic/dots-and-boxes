/**
 * @ flow
 */

import GameStore from '../data/GameStore';
import React from 'react';

export default class Root extends React.Component {
  render() {
    GameStore.startGame(3, 4);
    return <div />;
  }
}
