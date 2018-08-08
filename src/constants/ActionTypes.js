/**
 * @flow
 */

'use strict';

export type ActionType = 'SELECT_LINE' | 'START_GAME';

const ActionTypes = {
  SELECT_LINE: 'select_line',
  START_GAME: 'start_game',
  START_SIMULATION: 'start_simulation',
  START_NEXT_SIMULATION: 'start_next_simulation',
};

export default ActionTypes;
