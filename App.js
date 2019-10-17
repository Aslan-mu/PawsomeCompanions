/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  	AsyncStorage
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
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from './components/AuthLoadingScreen';

import Login from './components/UpdateProfile/Login';
import CreateAccount from './components/UpdateProfile/CreateAccount';
import Referral from './components/UpdateProfile/Referral';
import PetSittingPreference from './components/UpdateProfile/PetSittingPreference';

import Main from './components/Messages/Main';
import Chat from './components/Messages/Chat';

import CommunityFeed from "./components/CommunityFeed/CommunityFeed";
import NewCommunityPost from './components/CommunityFeed/NewCommunityPost';

import PetSitting from "./components/PetSitting/PetSitting";
import PetSittingBasicInformation from "./components/PetSitting/PetSittingBasicInformation"
import SearchSitterList from "./components/PetSitting/SearchSitterScreen"

import UserProfile from './components/Profile/UserProfile';

const communityStack = createStackNavigator({
	Feed: {screen: CommunityFeed},
	NewCommunityPost: {screen: NewCommunityPost}
})

const petsittingStack = createStackNavigator({
  PetSitting: PetSitting,
  PetSittingBasicInformation: PetSittingBasicInformation,
  SearchSitterList: SearchSitterList
})

const userprofileStack = createStackNavigator({
	Profile: { screen: UserProfile }
})

const messageStack = createStackNavigator({
	Main: { screen: Main },
	Chat: { screen: Chat }
})

const loginAppNavigator = createStackNavigator({
	Login: { screen: Login },
	CreateAccount: { screen: CreateAccount },
    Referral: { screen: Referral },
    PetSittingPreference: { screen: PetSittingPreference },
});

const tabNavigator = createBottomTabNavigator({
	Feed: communityStack,
	PetSitting: petsittingStack,
	Messages: messageStack,
	Profile: userprofileStack,
})

export default createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Login: loginAppNavigator,
    App: tabNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
