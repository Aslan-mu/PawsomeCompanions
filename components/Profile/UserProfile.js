import React from 'react';
import {
  StyleSheet, 
  Text, 
  Image,
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
        this.state.imageSource = global.currentUser.imageSource;
        this.state.name = global.currentUser.name;
        this.state.id = global.currentUser.id;
        this.state.email = global.currentUser.email;
    }

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    };

    render() {
        return (
            <View>
                <View style={{alignItems: 'center'}}>
                    <Image source={this.state.imageSource} style={styles.image}></Image>
                </View>
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
    image: {
        width:100, 
        height:100,
        marginLeft: offset,
        marginTop: offset,
    }
});
  
export default UserProfile;