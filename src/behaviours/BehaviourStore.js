/**
 * @flow
 */

'use strict';

import ActionTypes from '../constants/ActionTypes';
import Behaviour from './Behaviour';
import Characters, {type Character} from '../constants/Characters';
import Dispatcher from '../data/Dispatcher';
import GameStates from '../constants/GameStates';
import GameStore from '../data/GameStore';
import Greedy from './Greedy';
import Human from './Human';
import {ReduceStore} from 'flux/utils';

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
        this.run();
    }
    return state;
  }

  run() {
    setTimeout(this.getBehaviour(GameStore.getCurrentCharacter()).run);
  }

  getBehaviour(character: Character): Behaviour {
    switch (character) {
      case Characters.HUMAN:
        return new Human();
      case Characters.GREEDY:
        return new Greedy();
      default:
        throw new Error('Character not implemented');
    }
  }
}

export default new BehaviourStore();
