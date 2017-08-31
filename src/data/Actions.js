/**
 * @flow
 */

'use strict';

import ActionTypes from '../constants/ActionTypes';
import {type Character} from '../constants/Characters';
import {type Direction} from '../constants/Directions';
import Dispatcher from './Dispatcher';

const Actions = {
  startGame(
    rows: number,
    cols: number,
    player_one: Character,
    player_two: Character,
  ) {
    Dispatcher.dispatch({
      type: ActionTypes.START_GAME,
      rows,
      cols,
      player_one,
      player_two,
    });
  },

  selectLine(row: number, col: number, direction: Direction) {
    Dispatcher.dispatch({
      type: ActionTypes.SELECT_LINE,
      row,
      col,
      direction,
    });
  },
};

export default Actions;
