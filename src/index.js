/**
 * @flow
 */

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root.react';

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<Root />, root);
}
