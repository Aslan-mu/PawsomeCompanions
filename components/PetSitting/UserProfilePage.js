import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ImageEditor,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';

import {TabView, SceneMap} from 'react-native-tab-view';

const PostRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ffffff'}]} >
    <Text>
      This is the post route
    </Text>
  </View>
);

const InfoRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ffffff'}, {padding:12}]} >
      
      {/* About Section */}
      <View style={{marginBottom:24}}>
          <Text style={[styles.title,{marginBottom:8}]}>
            ABOUT
          </Text>

          <Text>
            Love dogs and long walks on the beach
          </Text>
      </View>

      {/* Pets Section */}
      <View style={{marginBottom:24}}>
          <Text style={[styles.title, {marginBottom:8}]}>
            PETS
          </Text>

          <Text style={styles.bodyText}>
            I don’t have pets now, but I used to have 2 golden retrievers
          </Text>
      </View>

      {/* Pet Sitting Section*/}
      <View style={{marginBottom:24}}>
          <Text style={[styles.title, {marginBottom:8}]}>
            PET SITTING
          </Text>

          <Text style={styles.bodyText}>
            I live in Midtown. Can do drop-in visits in this area. 
            Have experience taking care of dogs and cats.
          </Text>
      </View>

      {/* Recommendation section */}
      <View>
          <Text style={styles.title}>
            RECOMMENDATIONS
          </Text>

          <Text style={styles.bodyText}>
          </Text>
      </View>

  </View>
);

class UserProfilePage extends React.Component {
  // state = {
  //   index: 0,
  //   routes: [{key: 'first', title: 'INFO'}, {key: 'second', title: 'POST'}],
  // };

  constructor(props){
    super(props);
    this.state = {
      index: 0,
      routes: [{key: 'first', title: 'INFO'}, {key: 'second', title: 'POST'}],
      userData : {
        name: "",
        // oh, how to calculate? Do we really need it? 
        living: "distance", 
        numberOfRecommendations: 5,
        about: "",
        pets:"",
        petSitting:"",
        recommendations: "",
        posts: []    
      }
    }
  }

  static navigationOptions = ({navigation}) => {
    title: 'User Profile';
  };

  componentDidMount(){
    // grab user preference
    // grab user post
    // grab pets 
    const data = ""
    
  }

  render = () => {
    
    return (
      <SafeAreaView style={{padding: 12}}>
        {/* User top */}
        <View style={{flexDirection: 'row', marginTop: 12, padding: 12, justifyContent: "flex-start", alignItems:"center"}}>
          <View style={styles.personProfilePhoto}></View>

          <View style={{padding: 12, marginLeft:8}}>
            {/* Name */}
            <Text style={[styles.name, {marginBottom:4, alignItems:"flex-start"} ]}>{this.state.userData.name}</Text>

            {/* Living */}
            <Text style={[styles.bodyText, {marginBottom:4,alignItems:"flex-start"}]}> Midtown West, 0.6 mi away </Text>

            {/* Recommendation */}
            <Text style={[styles.bodyText,{marginBottom:10} ]}> {this.state.numberOfRecommendations} people recommended </Text>
          </View>
        </View>

        {/* User preference */}
        <View style={{height:500, backgroundColor:"#a0a0a0"}}>
          {/* Control */}
          <TabView
            navigationState={this.state}
            renderScene={SceneMap({
              first: InfoRoute,
              second: PostRoute,
            })}
            onIndexChange={index => this.setState({index})}
            initialLayout={{width: Dimensions.get('window').width}}
          />
        </View>
      </SafeAreaView>
    );
  };
}

const colors = {
  eggplantTwo:"rgb(26,5,29)"
}

const styles = StyleSheet.create({
    scene: {
      flex: 1,
    },
    personProfilePhoto: { 
        height: 80, width: 80, borderRadius: 40, backgroundColor: "grey"
    },

    title: {
      height: 16,
      // fontFamily: "SFProText",
      fontSize: 12,
      fontWeight: "600",
      fontStyle: "normal",
      lineHeight: 16,
      letterSpacing: 0,
      color: colors.eggplantTwo
    },
    bodyText: {
      width: "100%",
      // height: 18,
      // fontFamily: "SFProText",
      fontSize: 15,
      fontWeight: "normal",
      fontStyle: "normal",
      letterSpacing: 0,
      color: colors.eggplantTwo
    }, 
    name: {
      width: 45,
      height: 28,
      // fontFamily: "SFProDisplay",
      fontSize: 22,
      fontWeight: "600",
      fontStyle: "normal",
      lineHeight: 28,
      letterSpacing: 0,
      textAlign: "center",
      color: colors.eggplantTwo
    }


});

export default UserProfilePage;