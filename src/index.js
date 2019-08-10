/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';

import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
])

import Routes from './routes'


// <View> equivale À div do html
// <Text> equivale a : <p> no html 

export default function App(){
  return(
    <Routes/>
  )
}

