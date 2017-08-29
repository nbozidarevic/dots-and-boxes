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
      rows: GameStore.getState().rows,
      cols: GameStore.getState().cols,
    };
  }

  render() {
    const top = 100 * this.props.row / this.state.rows;
    const left = 100 * this.props.col / this.state.cols;
    const style = {
      left: left + '%',
      top: top + '%',
    };
    return <div className="dot" style={style} />;
  }
}

Dot = Container.create(Dot);

export default Dot;
