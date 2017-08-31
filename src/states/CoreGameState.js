/**
 * @flow
 */

'use strict';

import Directions, {type Direction} from '../constants/Directions';
import Line, {type LineID} from '../data/Line';
import Players, {type Player} from '../constants/Players';
import {type Character} from '../constants/Characters';

export default class CoreGameState {
  _rows: number;
  _cols: number;
  _players: Array<Character>;
  _lineLog: Array<LineID>;

  constructor(
    rows: number,
    cols: number,
    playerOne: Character,
    playerTwo: Character,
    lineLog?: Array<LineID>,
  ) {
    this._rows = rows;
    this._cols = cols;
    this._players = [playerOne, playerTwo];
    this._lineLog = lineLog ? [...lineLog] : [];
  }

  logLine(line: Line) {
    this._lineLog.push(line.getID());
  }

  getRows(): number {
    return this._rows;
  }

  getCols(): number {
    return this._cols;
  }

  serialize(): string {
    return JSON.stringify({
      rows: this._rows,
      cols: this._cols,
      players: this._players,
      lineLog: this._lineLog,
    });
  }

  static deserialize(data: string): CoreGameState {
    const dataObject = JSON.parse(data);
    const rows = dataObject.rows;
    const cols = dataObject.cols;
    const players = dataObject.players;
    const lineLog = dataObject.lineLog;
    return new CoreGameState(
      rows,
      cols,
      players[0],
      players[1],
      lineLog,
    );
  }
}
