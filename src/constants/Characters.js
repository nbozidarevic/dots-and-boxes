/**
 * @flow
 */

'use strict';

export type Character =
  'human' |
  'random' |
  'greedy' |
  'smart-greedy' |
  'optimizing-greedy';

const Characters = {
  HUMAN: 'human',
  RANDOM: 'random',
  GREEDY: 'greedy',
  SMART_GREEDY: 'smart-greedy',
  OPTIMIZING_GREEDY: 'optimizing-greedy',
};

export default Characters;
