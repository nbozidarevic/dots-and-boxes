/**
 * @flow
 */

'use strict';

import GameScreen from '../components/GameScreen.react';
import HomeScreen from '../components/HomeScreen.react';
import GameStore from '../data/GameStore';
import React from 'react';

import CSS from '../style.css';

export default class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <HomeScreen />
        <GameScreen />
      </div>
    );
  }
}
