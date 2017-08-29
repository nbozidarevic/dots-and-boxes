/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Directions, {type Direction} from '../constants/Directions';
import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';
import Players, {type Player} from '../constants/Players';

type Props = {
  row: number,
  col: number,
}

type State = {
  rows: number,
  cols: number,
  owner: ?Player,
}

class Box extends React.Component<Props, State> {
  static getStores() {
    return [GameStore];
  }

  static calculateState(prevState: State, props: Props) {
    return {
      rows: GameStore.getRows(),
      cols: GameStore.getCols(),
      // owner: GameStore.getBox(
      //   props.row,
      //   props.col,
      // ).getOwner(),
    };
  }

  render() {
    return (
      <div
        className={this._getClassName()}
        style={this._getStyle()}
      />
    );
  }

  _getClassName(): string {
    const {owner} = this.state;
    const classNames = ['box'];

    if (owner) {
      classNames.push(owner);
    }

    return classNames.join(' ');
  }

  _getStyle(): Object {
    const {row, col} = this.props;
    const {rows, cols} = this.state;

    let style = {
      top: 100 * row / rows + '%',
      right: 100 * (1 - (col + 1) / cols) + '%',
      bottom: 100 * (1 - (row + 1) / rows) + '%',
      left: 100 * col / cols + '%',
    };

    return style;
  }
}

Box = Container.create(Box, {withProps: true});

export default Box;
