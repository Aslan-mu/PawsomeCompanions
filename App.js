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

import ChatMain from './components/Messages/ChatMain';
import Chat from './components/Messages/Chat';

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

const userprofileStack = createStackNavigator({
	Profile: { screen: UserProfile }
})

const messageStack = createStackNavigator({
	ChatMain: { screen: ChatMain },
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

messageStack.navigationOptions = ({ navigation }) => {

    let tabBarVisible = true;
    let routeName = navigation.state.routes[navigation.state.index].routeName
    if ( routeName == 'Chat' ) {
        tabBarVisible = false
    }
    return {
        tabBarVisible,
    }
}

export default createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Login: loginAppNavigator,
    App: tabNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
