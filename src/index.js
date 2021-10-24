/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Use consistent styling
import 'sanitize.css/sanitize.css';
import 'semantic-ui-css/semantic.min.css';

import HomepageLayout from './main';

const MOUNT_NODE = document.getElementById('root');

ReactDOM.render(<HomepageLayout />, MOUNT_NODE);
