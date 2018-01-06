/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {
  AppRegistry,
} from 'react-native';

import ClientApp from './js/components/ClientApp';

AppRegistry.registerComponent('TarotApp', () => ClientApp); 

AppRegistry.runApplication('TarotApp', {
  rootTag: document.getElementById('container'),
});
