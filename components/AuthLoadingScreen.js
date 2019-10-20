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
      
        if (userToken){
            console.log(userToken);
            firebase.firestore().collection('Users').doc(userToken).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    const {id, email, name, image} = doc.data();
                    global.currentUser = {
                        imageSource:{uri: image},
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
        // this.props.navigation.navigate('Login');
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