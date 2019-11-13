import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableOpacity,
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
      password: this.state.password,
    };
    const response = firebaseSvc.login(
      user,
      this.loginSuccess,
      this.loginFailed,
    );
  };

  setUserInfo = async callback => {
    userId = firebase.auth().currentUser.uid;
    const doc = await firebase
      .firestore()
      .collection('Users')
      .doc(userId)
      .get()
      .catch(err => {
        console.log('Error getting document', err);
      });

    if (!doc.exists) {
        console.log('No User Find!');
    } else {
        const {name, email, image, community=""} = doc.data();
        global.currentUser = {
            id: userId,
            email,
            name,
            community,
            imageSource: {uri: image},
        };
    }
    
    callback();
  };

  navigateToMain = () => {
    this._signInAsync();
  };

  loginSuccess = () => {
    alert('Login Success!');
    this.setUserInfo(this.navigateToMain);
  };

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', global.currentUser.id);
    this.props.navigation.navigate('App');
  };

  loginFailed = () => {
    alert('Login failed. Please try again.');
  };

  onChangeTextEmail = email => this.setState({email});
  onChangeTextPassword = password => this.setState({password});

  render() {
    return (
      <View style={styles.viewStyle}>
        <View style={styles.columnBox}>
          <Text style={styles.title}>Hi there!</Text>
          <Text style={styles.subTitle}>Welcome Back!</Text>
        </View>
        <View style={styles.columnBox}>
          <Text style={styles.servicesLabel}>Email:</Text>
          <TextInput
            style={styles.inputField}
            placeHolder="test3@gmail.com"
            onChangeText={this.onChangeTextEmail}
            value={this.state.email}
          />
        </View>
        <View style={styles.columnBox}>
          <Text style={styles.servicesLabel}>Password:</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={this.onChangeTextPassword}
            value={this.state.password}
          />
        </View>
        <View style={styles.columnBox}>
          <TouchableOpacity style={styles.button} onPress={this.onPressLogin}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Feed')}>
            <Text style={styles.text}>Community feed test</Text>
          </TouchableOpacity>
          <View style={styles.rowContainer}>
            <Text>New to Pawsome Community?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('CreateAccount')}>
              <Text style={{color: 'blue', marginLeft: 2}}>Sign up Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    paddingTop: 100,
    height: 800,
    backgroundColor: 'rgb(250,250,251)',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  servicesLabel: {
    // width: 60,
    height: 16,
    // fontFamily: "SFProText",
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    color: '#1a051d',
    marginBottom: 20,
  },
  inputField: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    color:"#000"
  },
  button: {
    margin: 10,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#f99558',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnBox: {
    flexDirection: 'column',
    margin: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 34,
    letterSpacing: 0,
    color: '#1a051d',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    color: '#1a051d',
  },
});

export default Login;
