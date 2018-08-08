/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Box from '../components/Box.react';
import Directions from '../constants/Directions';
import Dot from '../components/Dot.react';
import Line from '../components/Line.react';
import UIStates, {type UIState} from '../constants/UIStates';
import GameStore from '../data/GameStore';
import {Container, ReduceStore} from 'flux/utils';
import React from 'react';
import ScoreBoard from './ScoreBoard.react';

type State = {
  rows: number,
  cols: number,
  uiState: UIState,
  wrapperDimensions?: {
    width: number,
    height: number,
  };
}

const MIN_BOX_SIZE = 36;
const MAX_BOX_SIZE = 72;

class GameScreen extends React.Component<{}, State> {
  _wrapperRef: ?React$ElementRef<'div'>;

  static getStores(): Array<ReduceStore> {
    return [GameStore];
  }

  static calculateState(prevState: State): State {
    let rows = 0;
    let cols = 0;

    const uiState = GameStore.getUIState();
    if (this.isValidUIState(uiState)) {
      rows = GameStore.getRows();
      cols = GameStore.getCols();
    }

    return {
      rows,
      cols,
      uiState,
    };
  }

  static isValidUIState(uiState: UIState): boolean {
    return uiState === UIStates.GAME || uiState === UIStates.SIMULATION || uiState === UIStates.COMPLETED;
  }

  componentDidMount() {
    window.addEventListener('resize', this._updateWrapperDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._updateWrapperDimensions);
  }

  render() {
    const {uiState} = this.state;
    if (uiState === UIStates.HOME) {
      return null;
    }
    return (
      <div className="game">
        <ScoreBoard />
        <div className="board-wrapper" ref={this._setWrapperRef}>
          <div className="board" style={this._getBoardPosition()}>
            {this._getBoxes()}
            {this._getLines()}
            {this._getDots()}
          </div>
        </div>
      </div>
    );
  }

  _setWrapperRef = (ref: ?React$ElementRef<'div'>) => {
    this._wrapperRef = ref;
    this._updateWrapperDimensions();
  }

  _updateWrapperDimensions = () => {
    if (!this._wrapperRef) {
      return null;
    }
    this.setState({
      wrapperDimensions: {
        width: this._wrapperRef.offsetWidth,
        height: this._wrapperRef.offsetHeight,
      },
    });
  }

  _getBoardPosition(): {
    top: number,
    right: number,
    bottom: number,
    left: number,
  } {
    const {rows, cols, wrapperDimensions} = this.state;
    const position = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    if (!wrapperDimensions) {
      return position;
    }

    const {width, height} = wrapperDimensions;

    if (
      rows === 0 ||
      cols === 0 ||
      width === 0 ||
      height === 0
    ) {
      return position;
    }

    const maxWidth = cols * MAX_BOX_SIZE;
    const maxHeight = rows * MAX_BOX_SIZE;
    if (maxWidth <= width && maxHeight <= height) {
      return {
        top: (height - maxHeight) / 2,
        right: (width - maxWidth) / 2,
        bottom: (height - maxHeight) / 2,
        left: (width - maxWidth) / 2,
      }
    }

    const minWidth = cols * MIN_BOX_SIZE;
    const minHeight = rows * MIN_BOX_SIZE;
    if (width <= minWidth || height <= minHeight) {
      return {
        top: 0,
        right: (width - minWidth) / 2,
        bottom: height - minHeight,
        left: (width - minWidth) / 2,
      }
    }

    const boardRatio = rows / cols;
    const wrapperRatio = wrapperDimensions.height / wrapperDimensions.width;

    if (boardRatio > wrapperRatio) {
      position.left = position.right =
        (wrapperDimensions.width - wrapperDimensions.height / boardRatio) / 2;
      if (wrapperDimensions.width - 2 * position.left > MAX_BOX_SIZE * cols) {
        console.log('resize');
      }
    } else {
      position.top = position.bottom =
        (wrapperDimensions.height - boardRatio * wrapperDimensions.width) / 2;
    }

    return position;
  }

  _getBoxes(): Array<Box> {
    const boxes = [];
    for (let i = 0; i < this.state.rows; ++i) {
      for (let j = 0; j < this.state.cols; ++j) {
        boxes.push(<Box row={i} col={j} key={i + '_' + j} />);
      }
    }
    return boxes;
  };

  _getLines(): Array<Line> {
    const {rows, cols} = this.state;
    const lines = [];

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        lines.push(
          <Line
            row={i}
            col={j}
            direction={Directions.UP}
            key={i + '_' + j + '_up'}
          />,
          <Line
            row={i}
            col={j}
            direction={Directions.LEFT}
            key={i + '_' + j + '_left'}
          />
        );
        if (i === rows - 1) {
          lines.push(
            <Line
              row={i}
              col={j}
              direction={Directions.DOWN}
              key={i + '_' + j + '_down'}
            />,
          );
        }

        if (j === cols - 1) {
          lines.push(
            <Line
              row={i}
              col={j}
              direction={Directions.RIGHT}
              key={i + '_' + j + '_right'}
            />,
          );
        }
      }
    }

    return lines;
  };

  _getDots(): Array<Dot> {
    const dots = [];
    for (let i = 0; i <= this.state.rows; ++i) {
      for (let j = 0; j <= this.state.cols; ++j) {
        dots.push(<Dot row={i} col={j} key={i + '_' + j} />);
      }
    }
    return dots;
  };
}

GameScreen = Container.create(GameScreen);

export default GameScreen;
