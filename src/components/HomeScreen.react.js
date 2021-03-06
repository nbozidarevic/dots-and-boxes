/**
 * @flow
 */

'use strict';

import BehaviourStore from '../behaviours/BehaviourStore';
import Actions from '../data/Actions';
import Characters, {type Character} from '../constants/Characters';
import UIStates, {type UIState} from '../constants/UIStates';
import GameStore from '../data/GameStore';
import {Container, ReduceStore} from 'flux/utils';
import React from 'react';

type State = {
  rows: number,
  cols: number,
  uiState: UIState,
  player_one: Character,
  player_two: Character,
}

class HomeScreen extends React.Component<{}, State> {
  static getStores(): Array<ReduceStore> {
    return [GameStore];
  }

  static calculateState(): State {
    return {
      rows: 7,
      cols: 7,
      uiState: GameStore.getUIState(),
      player_one: Characters.OPTIMIZING_GREEDY,
      player_two: Characters.GREEDY,
    };
  }

  render() {
    const {rows, cols, uiState, player_one, player_two} = this.state;
    if (uiState !== UIStates.HOME) {
      return null;
    }
    return (
      <div>
        <div>
          Dimenzije:
          <input
            type="number"
            min={1}
            max={21}
            value={rows}
            onChange={this._updateRows}
          />
          <input
            type="number"
            min={1}
            max={21}
            value={cols}
            onChange={this._updateCols}
          />
          <input
            type="button"
            value="Kreni"
            onClick={this._startGame}
          />
          <input
            type="button"
            value="Simuliraj"
            onClick={this._startSimulation}
          />
        </div>
        <div className="desc">
          Protivnici:
          <select onChange={this._updatePlayerOne} value={player_one}>
            {this._getCharacterOptions()}
          </select>
          {' vs '}
          <select onChange={this._updatePlayerTwo} value={player_two}>
            {this._getCharacterOptions()}
          </select>
        </div>
        <div>
          {this._getCharacterDescriptions()}
        </div>
      </div>
    );
  }

  _getCharacterOptions(): Array<any> {
    const options = [];
    for (let character in Characters) {
      options.push(
        <option key={character} value={Characters[character]}>
          {BehaviourStore.getBehaviourName(Characters[character])}
        </option>
      );
    }
    return options;
  }

  _getCharacterDescriptions(): Array<any> {
    const {player_one, player_two} = this.state;
    const descriptions = [
      <div className="desc" key="player_one">{`${BehaviourStore.getBehaviourName(player_one)} - ${BehaviourStore.getBehaviourDescription(player_one)}`}</div>
    ];
    if (player_two !== player_one) {
      descriptions.push(
        <div className="desc" key="player_two">{`${BehaviourStore.getBehaviourName(player_two)} - ${BehaviourStore.getBehaviourDescription(player_two)}`}</div>
      );
    }
    return descriptions;
  }

  _getCharacterFromEvent(event: Event): ?Character {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return null;
    }
    return (target.value: any);
  }

  _updatePlayerOne = (event: Event) => {
    const character = this._getCharacterFromEvent(event);
    if (character) {
      this.setState({player_one: character});
    }
  };

  _updatePlayerTwo = (event: Event) => {
    const character = this._getCharacterFromEvent(event);
    if (character) {
      this.setState({player_two: character});
    }
  };

  _updateRows = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({rows: parseInt(event.target.value)});
    }
  };

  _updateCols = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({cols: parseInt(event.target.value)});
    }
  };

  _startGame = () => {
    const {rows, cols, player_one, player_two} = this.state;
    Actions.startGame(rows, cols, player_one, player_two);
  };

  _startSimulation = () => {
    const {rows, cols, player_one, player_two} = this.state;
    Actions.startSimulation(rows, cols, player_one, player_two);
  };
}

HomeScreen = Container.create(HomeScreen);

export default HomeScreen;
