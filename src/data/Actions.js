/**
 * @flow
 */

'use strict';

import ActionTypes from '../constants/ActionTypes';
import {type Direction} from '../constants/Directions';
import Dispatcher from './Dispatcher';

const Actions = {
  startGame(rows: number, cols: number) {
    Dispatcher.dispatch({
      type: ActionTypes.START_GAME,
      rows,
      cols,
    });
  },

  selectLine(i: number, j: number, direction: Direction) {
    Dispatcher.dispatch({
      type: ActionTypes.SELECT_LINE,
      i,
      j,
      direction,
    });
  },
};

export default Actions;
