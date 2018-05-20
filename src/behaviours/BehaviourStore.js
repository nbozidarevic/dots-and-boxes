/**
 * @flow
 */

'use strict';

import Actions from '../data/Actions';
import ActionTypes from '../constants/ActionTypes';
import Behaviour from './Behaviour';
import Characters, {type Character} from '../constants/Characters';
import Dispatcher from '../data/Dispatcher';
import GameState from '../states/GameState';
import GameStore from '../data/GameStore';
import Greedy from './Greedy';
import Human from './Human';
import OptimizingGreedy from './OptimizingGreedy';
import Random from './Random';
import {ReduceStore} from 'flux/utils';
import SmartGreedy from './SmartGreedy';
import UIStates from '../constants/UIStates';

const MIN_MOVE_TIME = 200; // ms

class BehaviourStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState(): ?Object {
    return null;
  }

  reduce(state: Object, action: Object) {
    this.getDispatcher().waitFor([GameStore.getDispatchToken()]);
    if (
      GameStore.getUIState() !== UIStates.GAME ||
      GameStore.isGameComplete()
    ) {
      return state;
    }
    switch (action.type) {
      case ActionTypes.SELECT_LINE:
      case ActionTypes.START_GAME:
        setTimeout(() => this.run(GameStore.getGameState()));
    }
    return state;
  }

  run(gameState: GameState) {
    const startTime = performance.now();
    const line =
      this.getBehaviour(GameStore.getCurrentCharacter()).run(gameState);
    const elapsedTime = performance.now() - startTime;

    if (!line) {
      throw new Error('line should not be null');
    }

    const selectLine = () => Actions.selectLine(
      line.getRow(),
      line.getCol(),
      line.getDirection()
    );

    if (elapsedTime < MIN_MOVE_TIME) {
      setTimeout(selectLine, MIN_MOVE_TIME - elapsedTime);
    } else {
      selectLine();
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
      case Characters.OPTIMIZING_GREEDY:
        return new OptimizingGreedy();
      default:
        throw new Error('Character ' + character + ' not implemented');
    }
  }

  getBehaviourName(character: Character): string {
    switch (character) {
      case Characters.HUMAN:
        return Human.getName();
      case Characters.RANDOM:
        return Random.getName();
      case Characters.GREEDY:
        return Greedy.getName();
      case Characters.SMART_GREEDY:
        return SmartGreedy.getName();
      case Characters.OPTIMIZING_GREEDY:
        return OptimizingGreedy.getName();
      default:
        throw new Error('Character name for ' + character + ' not implemented');
      }
  }

  getBehaviourDescription(character: Character): string {
    switch (character) {
      case Characters.HUMAN:
        return Human.getDescription();
      case Characters.RANDOM:
        return Random.getDescription();
      case Characters.GREEDY:
        return Greedy.getDescription();
      case Characters.SMART_GREEDY:
        return SmartGreedy.getDescription();
      case Characters.OPTIMIZING_GREEDY:
        return OptimizingGreedy.getDescription();
      default:
        throw new Error('Character desc for ' + character + ' not implemented');
    }
  }
}

export default new BehaviourStore();
