/**
 * @ flow
 */

'use strict';

import GameScreen from '../components/GameScreen.react';
import HomeScreen from '../components/HomeScreen.react';
import GameStore from '../data/GameStore';
import React from 'react';

export default class Root extends React.Component {
  render() {
    return (
      <div>
        <HomeScreen />
        <GameScreen />
      </div>
    );
  }
}
