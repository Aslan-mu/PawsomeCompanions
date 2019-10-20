import React from 'react';
import {
  StyleSheet, Text,
  TextInput, View,
  AsyncStorage,
  Button,
} from 'react-native';
import firebaseSvc from '../../FirebaseSvc';
import firebase from 'firebase';

class Login extends React.Component {
    static navigationOptions = {
        title: 'Login',
    };
  
    state = {
        name: '',
        email: '',
        password: '',
    };
  
    onPressLogin = async () => {
        console.log('pressing login... email:' + this.state.email);
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        };
        const response = firebaseSvc.login(
            user,
            this.loginSuccess,
            this.loginFailed
        );
    };
  
    setUserInfo = async (callback) => {
        userId = firebase.auth().currentUser.uid;
        await firebase.firestore().collection('Users').doc(userId).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No User Find!');
            } else {
                const {name, email, image} = doc.data();
                global.currentUser = {
                    id: userId,
                    email: email,
                    name: name,
                    imageSource: {uri: image},
                }
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
        callback()
    }

    navigateToMain = ()=>{
        this._signInAsync();
    }

    loginSuccess =  () => {
        alert('Login Success!');
        this.setUserInfo(this.navigateToMain);
    };

    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', global.currentUser.id);
        this.props.navigation.navigate('App');
    };
    
    loginFailed = () => {
        console.log('login failed ***');
        alert('Login failure. Please try again.');
    };
  
    onChangeTextEmail = email => this.setState({ email });
    onChangeTextPassword = password => this.setState({ password });
  
    render() {
        return (
            <View>
            <Text style={styles.title}>Email:</Text>
            <TextInput
                style={styles.nameInput}
                placeHolder="test3@gmail.com"
                onChangeText={this.onChangeTextEmail}
                value={this.state.email}
            />
            <Text style={styles.title}>Password:</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={this.onChangeTextPassword}
                value={this.state.password}
            />
            <Button
                title="Login"
                style={styles.buttonText}
                onPress={this.onPressLogin}
            />
    
            <Button
                title="Create new account"
                style={styles.buttonText}
                onPress={() => this.props.navigation.navigate("CreateAccount")}
            />

            <Button
                title="Community feed test"
                style={styles.buttonText}
                onPress={() => this.props.navigation.navigate("Feed")}
            />
            </View>
        );
    }
}
  
const offset = 16;
const styles = StyleSheet.create({
    title: {
        marginTop: offset,
        marginLeft: offset,
        fontSize: offset,
    },
    nameInput: {
        height: offset * 3,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#111111',
        borderWidth: 1,
        fontSize: offset,
    },
    buttonText: {
        height: offset * 3,
        marginLeft: offset,
        fontSize: 42,
    },
});
  
export default Login;
  