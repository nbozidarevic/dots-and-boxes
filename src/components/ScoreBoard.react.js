/**
 * @flow
 */

'use strict';

import {type Character} from '../constants/Characters';
import GameStore from '../data/GameStore';
import {Container} from 'flux/utils';
import React from 'react';

type State = {
  player_one: Character,
  player_two: Character,
  score: {
    player_one: number,
    player_two: number,
  },
}

class ScoreBoard extends React.Component<{}, State> {
  static getStores() {
    return [GameStore];
  }

  static calculateState() {
    return {
      score: GameStore.getScore(),
      ...GameStore.getCharacters(),
    };
  }

  render() {
    const {player_one, player_two, score} = this.state;
    return (
      <div className="scoreboard">
        {player_one}
        {' '}
        <span className="player_one">{score.player_one}</span>
        :
        <span className="player_two">{score.player_two}</span>
        {' '}
        {player_two}
      </div>
    );
  }
}

ScoreBoard = Container.create(ScoreBoard);

export default ScoreBoard;
