/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps has been renamed, and is not recommended for use.',
  'Warning: componentWillMount has been renamed, and is not recommended for use.',
]);
AppRegistry.registerComponent(appName, () => App);
