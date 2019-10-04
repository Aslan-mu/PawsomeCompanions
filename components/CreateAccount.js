import React from 'react';
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor,
} from 'react-native';
import firebaseSvc from '../FirebaseSvc';
  
class CreateAccount extends React.Component {
    static navigationOptions = {
        title: 'Create Account',
    };
  
    state = {
        name: 'default',
        email: 'test@gmail.com',
        password: '123456',
    };
  
    onPressCreate = async () => {
        console.log('create account... email:' + this.state.email);
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        };
        await firebaseSvc.createAccount(
            user,
            this.createSuccess,
            this.createFailed
        );
    };

    createSuccess = () => {
        console.log('Create successful, navigate to login page.');
        this.props.navigation.navigate('Login', {
            name: this.state.name,
            email: this.state.email,
        });
    };
    
    createFailed = () => {
        console.log('Create failure!');
        alert('Create failure. Please try again.');
    };
  
    onChangeTextEmail = email => this.setState({ email });
    onChangeTextPassword = password => this.setState({ password });
    onChangeTextName = name => this.setState({ name });
  
    render() {
        return (
            <View>
            <Text style={styles.title}>Email:</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={this.onChangeTextEmail}
                value={this.state.email}
            />
            <Text style={styles.title}>Password:</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={this.onChangeTextPassword}
                value={this.state.password}
            />
            <Text style={styles.title}>Name:</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={this.onChangeTextName}
                value={this.state.name}
            />
            <Button
                title="Create Account"
                style={styles.buttonText}
                onPress={this.onPressCreate}
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

export default CreateAccount;