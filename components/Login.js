import React from 'react';
import {
  StyleSheet, Text,
  TextInput,  TouchableOpacity, View,
  Button, ImageEditor,
} from 'react-native';
import firebaseSvc from '../FirebaseSvc';
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
  
    setUserInfo = (callback) => {
        userf = firebase.auth().currentUser
        global.currentUser = {
            id: userf.uid,
            email: userf.email,
            name: userf.displayName,
         }
         callback()
    }

    navigateToMain = ()=>{
        this.props.navigation.navigate('Main');
    }

    loginSuccess =  () => {
        alert('Login Success!');
        this.setUserInfo(this.navigateToMain);
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
  