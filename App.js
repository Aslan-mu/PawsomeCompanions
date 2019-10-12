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
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation';

import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Referral from './components/UpdateProfile/Referral';
import PetSittingPreference from './components/UpdateProfile/PetSittingPreference';
import Main from './components/Main';
import Chat from './components/Chat';
import CommunityFeed from "./components/CommunityFeed"
import NewCommunityPost from './components/NewCommunityPost';


const communityStack = createStackNavigator({
  Feed: {screen: CommunityFeed},
  NewCommunityFeedPost: {screen: NewCommunityPost}
})

const tabNavigator = createBottomTabNavigator({
  // Main: { screen: Main },
  // Chat: { screen: Chat },
  Feed: communityStack,
})

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  CreateAccount: { screen: CreateAccount },
  Referral: { screen: Referral },
  Main: { screen: Main },
  Chat: { screen: Chat },
<<<<<<< HEAD
  Feed: tabNavigator
=======
  PetSittingPreference: { screen: PetSittingPreference },
>>>>>>> master
});

export default createAppContainer(tabNavigator);
