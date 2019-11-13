import React from 'react';
import {
    StyleSheet, Text,
    TextInput, View,
    TouchableOpacity,
} from 'react-native';
import firebaseSvc from '../../FirebaseSvc';
  
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
        // console.log('Create successful, navigate to login page.');
        // this.props.navigation.navigate('Login', {
        //     name: this.state.name,
        //     email: this.state.email,
        // });
        alert('Create successful, create profile now!');
        this.props.navigation.navigate('Referral');
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
            <View style = {styles.viewStyle}>
                <View style={styles.columnBox}>
                    <Text style={styles.servicesLabel}>Email:</Text>
                    <TextInput
                        style={styles.inputField}
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
                    <Text style={styles.servicesLabel}>Name:</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={this.onChangeTextName}
                        value={this.state.name}
                    />
                </View>
                <View style={styles.columnBox}>
                    <TouchableOpacity style={styles.button} 
                        onPress={this.onPressCreate}
                        >
                        <Text style = { styles.text}>
                            Create Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStyle:{
        flex:1,
        backgroundColor:"rgb(250,250,251)"
    },
    servicesLabel: {
        // width: 60,
        height: 16,
        // fontFamily: "SFProText",
        fontSize: 14,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: 0,
        color: "#1a051d",
        marginBottom: 20
    },
    inputField: {
        backgroundColor: "#ffffff",
        borderRadius: 8, 
        padding: 12,
        color: "#000000"
    },
    button: {
        // width: "90%",
        height: 48,
        borderRadius: 6,
        backgroundColor: "#f99558",
        justifyContent: "center",
        alignItems: "center"
    },
    columnBox:{
        flexDirection: "column", 
        margin: 20
    },
    text:{
        textAlign: 'center',
        fontSize: 17,
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0,
        color: "white",
    },
});

export default CreateAccount;