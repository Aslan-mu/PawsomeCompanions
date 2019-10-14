import React from 'react';
import {
  StyleSheet, 
  Text, 
  View, 
  Button, 
  AsyncStorage,
} from 'react-native';


class UserProfile extends React.Component {

    state = {
    };

    static navigationOptions = {
        title: 'Profile',
    };

    constructor(props) {
        super(props);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(global.currentUser);
        this.state.name = global.currentUser.name;
        this.state.id = global.currentUser.id;
        this.state.email = global.currentUser.email;
        console.log(global.currentUser.name)
        console.log(global.currentUser.id)
        console.log(global.currentUser.email)
        console.log(this.state)
    }

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    };


    render() {
        return (
            <View>
                <Text style={styles.title}>Hi, {this.state.name}</Text>
                <Text style={styles.title}>Your Email: {this.state.email} </Text>
                <Text style={styles.title}>Your User Id: {this.state.id} </Text>
                <Button
                    title="Login out"
                    style={styles.buttonText}
                    onPress={this._signOutAsync}
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
});
  
export default UserProfile;