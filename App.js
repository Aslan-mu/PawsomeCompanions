/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';

import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Referral from './components/UpdateProfile/Referral';
import PetSittingPreference from './components/UpdateProfile/PetSittingPreference';
import Main from './components/Main';
import Chat from './components/Chat';


const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  CreateAccount: { screen: CreateAccount },
  Referral: { screen: Referral },
  Main: { screen: Main },
  Chat: { screen: Chat },
  PetSittingPreference: { screen: PetSittingPreference },
});

export default createAppContainer(AppNavigator);
