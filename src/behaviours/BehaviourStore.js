/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import ActionTypes from '../constants/ActionTypes';
import Behaviour from './Behaviour';
import Characters, {type Character} from '../constants/Characters';
import Dispatcher from '../data/Dispatcher';
import GameStates from '../constants/GameStates';
import GameStore from '../data/GameStore';
import Greedy from './Greedy';
import Human from './Human';
import Random from './Random';
import {ReduceStore} from 'flux/utils';
import SmartGreedy from './SmartGreedy';

class BehaviourStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState(): ?Object {
    return null;
  }

  reduce(state: Object, action: Object) {
    this.getDispatcher().waitFor([GameStore.getDispatchToken()]);
    if (GameStore.getGameState() !== GameStates.GAME) {
      return state;
    }
    switch (action.type) {
      case ActionTypes.SELECT_LINE:
      case ActionTypes.START_GAME:
        setTimeout(() => this.run());
    }
    return state;
  }

  run() {
    const line = this.getBehaviour(GameStore.getCurrentCharacter()).run();
    if (line) {
      Actions.selectLine(line.getRow(), line.getCol(), line.getDirection());
    }
  }

  getBehaviour(character: Character): Behaviour {
    switch (character) {
      case Characters.HUMAN:
        return new Human();
      case Characters.RANDOM:
        return new Random();
      case Characters.GREEDY:
        return new Greedy();
      case Characters.SMART_GREEDY:
        return new SmartGreedy();
      default:
        throw new Error('Character not implemented');
    }
  }
}

export default new BehaviourStore();
