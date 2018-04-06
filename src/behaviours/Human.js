/**
 * @flow
 */

'use strict';

import Behaviour from './Behaviour';
import Line from '../data/Line';

export default class Human extends Behaviour {
  run(): ?Line {
    return null;
  }

  static getName(): string {
    return 'Igrač';
  }

  static getDescription(): string {
    return 'Korisnik kontroliše igrača.'
  }
}
