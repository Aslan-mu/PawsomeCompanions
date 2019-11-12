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
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from './components/AuthLoadingScreen';

import Main from './components/UpdateProfile/Main';
import Login from './components/UpdateProfile/Login';
import CreateAccount from './components/UpdateProfile/CreateAccount';
import Referral from './components/UpdateProfile/Referral';
import PetSittingPreferenceStart from './components/UpdateProfile/PetSittingPreferenceStart';
import PetSittingPreference from './components/UpdateProfile/PetSittingPreference';
import PetProfile from './components/UpdateProfile/PetProfile';

import ChatMain from './components/Messages/ChatMain';
import Chat from './components/Messages/Chat';

import CommunityFeed from "./components/CommunityFeed/CommunityFeed";
import NewCommunityPost from './components/CommunityFeed/NewCommunityPost';

import PetSitting from "./components/PetSitting/PetSitting";
import PetSittingBasicInformation from "./components/PetSitting/PetSittingBasicInformation"
import SearchSitterList from "./components/PetSitting/SearchSitterScreen"
import RequestSentConfirmation from "./components/PetSitting/RequestSentConfirmation"

import UserProfile from './components/Profile/UserProfile';
import PetSittingInstruction from "./components/PetSittingInstructions/PetSittingInstructions"
import AddNewInstruction from "./components/PetSittingInstructions/AddNewInstruction"
import SavedInstruction from "./components/PetSittingInstructions/SavedInstructions"

import UserProfilePage from "./components/PetSitting/UserProfilePage"
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"

const communityStack = createStackNavigator({
	Feed: {screen: CommunityFeed},
	// Feed: {screen: RequestSentConfirmation},
	NewCommunityPost: {screen: NewCommunityPost},
})

const petsittingStack = createStackNavigator({
//   PetSitting: PetSitting,
  PetSittingBasicInformation: PetSittingBasicInformation,
  // PetSittingBasicInformation :  UserProfilePage,
  SearchSitterList: SearchSitterList,
  RequestSentConfirmation: {screen: RequestSentConfirmation},
  UserProfilePage :  {screen: UserProfilePage},

})

const userprofileStack = createStackNavigator({
	Profile: { screen: UserProfile }
})

const messageStack = createStackNavigator({
	ChatMain: { screen: ChatMain },
	Chat: { screen: Chat }
})

const loginAppNavigator = createStackNavigator({
    Main: { screen: Main},
	  Login: { screen: Login },
	  CreateAccount: { screen: CreateAccount },
    Referral: { screen: Referral },
    PetSittingPreferenceStart: { screen: PetSittingPreferenceStart },
    PetSittingPreference: {screen: PetSittingPreference},
    PetProfile: {screen: PetProfile}
});

const petSittingInstructionStack = createStackNavigator({
  PetSittingInstruction: PetSittingInstruction,
  // PetSittingInstruction: SavedInstruction,
  AddNewInstruction : AddNewInstruction,
  SavedInstruction: SavedInstruction
})

const petSittingTab = createMaterialTopTabNavigator({
	PetSittingToday: petSittingInstructionStack
})

const tabNavigator = createBottomTabNavigator({
  Feed: {
    screen: communityStack,
    path:"/",
    

    navigationOptions :({navigation, screenProps}) => {
      let anyNotification = navigation.getParam("notification")
      console.log("Hello my world")
      console.log(screenProps)
  

      if (anyNotification){
        return {
          tabBarIcon:({tintColor}) => (
            <Icon name="home" size={24} color={tintColor} style={{alignSelf:"center"}}> </Icon>
          )
        }}
      return {}
    s},
  },
  PetSitting: {
    screen: petsittingStack,
    navigationOptions: {
      tabBarIcon: ({tintColor}) =>(
        <Icon name="search" size={24} color={tintColor} ></Icon>
      )
    }
  },
	Messages: {
    screen: messageStack,
    navigationOptions: {
      tabBarIcon: ({tintColor}) =>(
        <MaterialCommunityIcon name="message-text-outline" size={22} color={tintColor}/>
      )
    }
  },
	PetsittingInstruction: {
    screen: petSittingInstructionStack,
    navigationOptions: {
      tabBarIcon: ({tintColor}) =>(
        <Icon name="pets" size={24} color={tintColor}/>
      )
    }
  },
  Profile: {
    screen: userprofileStack,
    navigationOptions: {
      tabBarIcon: ({tintColor})=> (
        <MaterialCommunityIcon name="account-circle-outline" size={22} color={tintColor}/>
      )
    }
  },
  // PetSittingInstruction: petSittingTab
}, {
  initialRouteParams: {notification: "1234"},
  resetOnBlur: true,
  tabBarOptions:{
    tabStyle:{
      justifyContent:"center",
      alignItems:"center",
      // backgroundColor:"red",
    }
    }
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

communityStack.navigationOptions = ({ navigation }) => {

    // I figure out the problem
    
    let tabBarVisible = true;
    let routeName = navigation.state.routes[navigation.state.index].routeName
    let tabBarIcon =  <Icon name="home" size={28} color={"#000000"} ></Icon>;
    // let anyNotification = navigation.getParam("notification")
    // console.log("Hello my world")
    // console.log(anyNotification)
    // if (anyNotification){
    //     return {tabBarIcon: <Icon name="search" size={24} color={tintColor}></Icon>}
    // }

    // if ( routeName == 'NewCommunityPost' ) {
    //     tabBarVisible = false
    // }
    // return {
    //     tabBarVisible,
    //     tabBarIcon: 
    //       ({tintColor}) => <Icon name="home" size={24} color={tintColor}></Icon>
    // }
}

export default createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Login: loginAppNavigator,
    App: tabNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
    initialRouteParams: {notification: "1235"}
  }
));
