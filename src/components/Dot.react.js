/**
 * @flow
 */

'use strict';

import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';

type Props = {
  row: number,
  col: number,
}

type State = {
  rows: number,
  cols: number,
}

class Dot extends React.Component<Props, State> {
  static getStores() {
    return [GameStore];
  }

  static calculateState() {
    return {
      rows: GameStore.getRows(),
      cols: GameStore.getCols(),
    };
  }

  render() {
    return <div className="dot" style={this._getStyle()} />;
  }

  _getStyle(): Object {
    const {row, col} = this.props;
    const {rows, cols} = this.state;
    return {
      top: 100 * row / rows + '%',
      left: 100 * col / cols + '%',
    }
  }
}

Dot = Container.create(Dot);

export default Dot;
