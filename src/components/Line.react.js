/**
 * @flow
 */

'use strict';

import Directions, {type Direction} from '../constants/Directions';
import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';

type Props = {
  row: number,
  col: number,
  direction: Direction,
}

type State = {
  rows: number,
  cols: number,
}

class Line extends React.Component<Props, State> {
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
      bottom: undefined,
      right: undefined,
      width: undefined,
      height: undefined,
    };
    if (this.props.direction === Directions.DOWN) {
      style.bottom = (100 - 100 * (this.props.row + 1) / this.state.rows) + '%';
      style.width = 10;
    }
    if (this.props.direction === Directions.RIGHT) {
      style.right = (100 - 100 * (this.props.col + 1) / this.state.cols) + '%';
      style.height = 10;
    }
    console.log(style);
    return <div className="line" style={style} />;
  }
}

Line = Container.create(Line);

export default Line;
