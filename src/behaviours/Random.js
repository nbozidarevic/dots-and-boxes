/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import Behaviour from './Behaviour';
import GameStore from '../data/GameStore';
import Line from '../data/Line';

export default class Random extends Behaviour {
  run(): ?Line {
    return this.getRandomLine(GameStore.getAllAvailableLines());
  }
}
