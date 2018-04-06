/**
 * @flow
 */

'use strict';

import BehaviourStore from '../behaviours/BehaviourStore';
import {type Character} from '../constants/Characters';
import GameStore from '../data/GameStore';
import {Container, ReduceStore} from 'flux/utils';
import Players from '../constants/Players';
import React from 'react';

type State = {
  characters: Array<Character>,
  score: Array<number>,
}

class ScoreBoard extends React.Component<{}, State> {
  static getStores(): Array<ReduceStore> {
    return [GameStore];
  }

  static calculateState(): State {
    return {
      characters: GameStore.getCharacters(),
      score: GameStore.getScore(),
    };
  }

  render() {
    const {characters, score} = this.state;
    return (
      <div className="scoreboard">
        {BehaviourStore.getBehaviourName(characters[Players.PLAYER_ONE])}
        {' '}
        <span className="player_one">{score[Players.PLAYER_ONE]}</span>
        :
        <span className="player_two">{score[Players.PLAYER_TWO]}</span>
        {' '}
        {BehaviourStore.getBehaviourName(characters[Players.PLAYER_TWO])}
      </div>
    );
  }
}

ScoreBoard = Container.create(ScoreBoard, {pure: false});

export default ScoreBoard;
