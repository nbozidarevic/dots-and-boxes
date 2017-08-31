/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Characters, {type Character} from '../constants/Characters';
import Directions, {type Direction} from '../constants/Directions';
import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';
import Players, {type Player} from '../constants/Players';

type Props = {
  row: number,
  col: number,
  direction: Direction,
}

type State = {
  rows: number,
  cols: number,
  owner: ?Player,
  currentCharacter: Character,
}

class Line extends React.Component<Props, State> {
  static getStores() {
    return [GameStore];
  }

  static calculateState(prevState: State, props: Props) {
    return {
      rows: GameStore.getRows(),
      cols: GameStore.getCols(),
      owner: GameStore.getLine(
        props.row,
        props.col,
        props.direction,
      ).getOwner(),
      currentCharacter: GameStore.getCharacters()[GameStore.getCurrentPlayer()],
    };
  }

  render() {
    return (
      <div
        className={this._getClassName()}
        style={this._getStyle()}
        onClick={this._selectLine}
      />
    );
  }

  _getClassName(): string {
    const {direction} = this.props;
    const {owner, currentCharacter} = this.state;
    const classNames = ['line'];

    if (owner) {
      classNames.push('line-selected');
    } else if (currentCharacter === Characters.HUMAN) {
      classNames.push('line-interactive');
    }

    if (direction === Directions.DOWN) {
      classNames.push('line-vert');
    } else if (this.props.direction === Directions.RIGHT) {
      classNames.push('line-horiz');
    }

    return classNames.join(' ');
  }

  _getStyle(): Object {
    const {row, col, direction} = this.props;
    const {rows, cols, owner} = this.state;

    let style = {
      top: 100 * row / rows + '%',
      right: undefined,
      bottom: undefined,
      left: 100 * col / cols + '%',
    };

    if (direction === Directions.DOWN) {
      style.bottom = 100 * (1 - (row + 1) / rows) + '%';
    } else if (direction === Directions.RIGHT) {
      style.right = 100 * (1 - (col + 1) / cols) + '%';
    }

    return style;
  }

  _selectLine = () => {
    const {row, col, direction} = this.props;
    const {currentCharacter} = this.state;
    if (currentCharacter !== Characters.HUMAN) {
      return;
    }
    Actions.selectLine(row, col, direction);
  };
}

Line = Container.create(Line, {withProps: true});

export default Line;
