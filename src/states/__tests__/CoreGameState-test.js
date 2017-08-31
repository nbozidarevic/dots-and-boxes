'use strict';

import Characters from '../../constants/Characters';
import Directions from '../../constants/Directions';
import CoreGameState from '../CoreGameState';

const ROWS = 2;
const COLS = 3;
const PLAYER_ONE = Characters.HUMAN;
const PLAYER_TWO = Characters.GREEDY;
const LINE_LOG = [
  {row: 0, col: 0, dir: Directions.DOWN},
  {row: 0, col: 0, dir: Directions.RIGHT},
  {row: 2, col: 2, dir: Directions.DOWN},
];
const STRING_DATA =
  '{' +
  '"rows":2,"cols":3,"players":["human","greedy"],'+
  '"lineLog":[{"row":0,"col":0,"dir":"down"},{"row":0,"col":0,"dir":"right"},{"row":2,"col":2,"dir":"down"}]'+
  '}';

test('the constructor correctly initializes the game state', () => {
  const coreGameState = new CoreGameState(ROWS, COLS, PLAYER_ONE, PLAYER_TWO);
  expect(coreGameState._rows).toBe(ROWS);
  expect(coreGameState._cols).toBe(COLS);
  expect(coreGameState._players).toEqual([PLAYER_ONE, PLAYER_TWO]);
  expect(coreGameState._lineLog).toEqual([]);
});

test('the constructor correctly initializes the line log', () => {
  const coreGameState = new CoreGameState(
    ROWS,
    COLS,
    PLAYER_ONE,
    PLAYER_TWO,
    LINE_LOG,
  );
  expect(coreGameState._lineLog).not.toBe(LINE_LOG);
  expect(coreGameState._lineLog).toEqual(LINE_LOG);
});

test('data is correcly seralized', () => {
  const coreGameState = new CoreGameState(
    ROWS,
    COLS,
    PLAYER_ONE,
    PLAYER_TWO,
    LINE_LOG,
  );
  expect(coreGameState.serialize()).toBe(STRING_DATA);
});

test('data is correcly deseralized', () => {
  const coreGameState = CoreGameState.deserialize(STRING_DATA);
  expect(coreGameState._rows).toBe(ROWS);
  expect(coreGameState._cols).toBe(COLS);
  expect(coreGameState._players).toEqual([PLAYER_ONE, PLAYER_TWO]);
  expect(coreGameState._lineLog).toEqual(LINE_LOG);
});
