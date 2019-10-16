import React from 'react';
import firebase from 'firebase';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._bootstrapAsync();
    }
  
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      
      if (userToken){
        console.log(userToken);
        const doc = firebase.firestore().collection('Users').doc(userToken).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                console.log('Document data:', doc.data());
                const {id, email, name} = doc.data();
                global.currentUser = {
                    id: id,
                    email: email,
                    name: name,
                }
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
      }
      
      this.props.navigation.navigate(userToken ? 'App' : 'Login');
    };
  
    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});  

export default AuthLoadingScreen;