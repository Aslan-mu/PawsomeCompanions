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

import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import Referral from './components/UpdateProfile/Referral';
import PetSittingPreference from './components/UpdateProfile/PetSittingPreference';
import Main from './components/Main';
import Chat from './components/Chat';
import CommunityFeed from "./components/CommunityFeed/CommunityFeed";
import NewCommunityPost from './components/CommunityFeed/NewCommunityPost';
import PetSitting from "./components/PetSitting/PetSitting";

import UserProfile from './components/Profile/UserProfile';

const communityStack = createStackNavigator({
	Feed: {screen: CommunityFeed},
	NewCommunityPost: {screen: NewCommunityPost}
})

const petsittingStack = createStackNavigator({
  	PetSitting: PetSitting

})

const userprofilestack = createStackNavigator({
	Profile: { screen: UserProfile }
})

const loginAppNavigator = createStackNavigator({
	Login: { screen: Login },
	CreateAccount: { screen: CreateAccount },
	Referral: { screen: Referral },
	Main: { screen: Main },
	Chat: { screen: Chat },
});

const tabNavigator = createBottomTabNavigator({
	// Main: { screen: Main },
	// Chat: { screen: Chat },
	//Login: loginAppNavigator,
	Feed: communityStack,
	PetSitting: petsittingStack,
	Profile: userprofilestack,
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
