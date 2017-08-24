/**
 * @ flow
 */

'use strict';

import GameStore from '../data/GameStore';
import React from 'react';

document.debug = GameStore;

export default class Root extends React.Component {
  render() {
    return (
      <div>
        {GameStore.rows}<br />
        {GameStore.cols}<br />
        {GameStore.currentPlayer}<br />
        {GameStore.state}
      </div>
    );
  }
}
