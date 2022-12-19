/**
 * @format
 */

import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import AppWrapper from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppWrapper);
