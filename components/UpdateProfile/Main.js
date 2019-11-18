import React from 'react';
import {
  StyleSheet, Text, View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';

class Main extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <View style = {styles.viewStyle}>
                <View style={styles.imageBox}>
                    <Image source={require('./App-Logo.png')} style={styles.image}></Image>
                </View>
                <View style={styles.columnBox}>
                    <View style={{margin:10}}>
                        <Text style={styles.title}>
                            Pawsome
                        </Text>
                        <Text style={styles.title}>
                            Companions
                        </Text>
                    </View>

                    <View style={{margin:10}}>
                        <Text style={styles.text}>
                            Meet pet lovers
                        </Text>
                        <Text style={styles.text}>
                            Find pet sitters
                        </Text>
                    </View>
                </View>
                <View style={styles.columnBox}>
                    <TouchableOpacity style={styles.loginButton} 
                        onPress={() => this.props.navigation.navigate("Login")}
                        >
                        <Text style={styles.loginText}>
                            Log in
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signUpButton} 
                        onPress={() => this.props.navigation.navigate("CreateAccount")}
                        >
                        <Text style={styles.signUpText}>
                            Sign up
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width:128, 
        height:128,
    },
    imageBox: {
        alignItems: "center",
        flex:1,
        margin:40
    },
    viewStyle:{
        flex:1,
        paddingTop:0.16*Dimensions.get('window').height,
        paddingBottom:0.223*Dimensions.get('window').height,
        backgroundColor:"rgb(250,250,251)"
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 28,
        letterSpacing: 0,
        color: "#1a051d",
    },
    text: {
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d",
    },
    loginText:{
        textAlign: 'center',
        fontSize: 17,
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0,
        color: "white",
    },
    signUpText:{
        textAlign: 'center',
        fontSize: 17,
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d",
    },
    inputField: {
        backgroundColor: "#ffffff",
        borderRadius: 8, 
        padding: 12,
    },
    loginButton: {
        margin: 10,
        height: 48,
        borderRadius: 6,
        backgroundColor: "#f99558",
        justifyContent: "center",
        alignItems: "center"
    },
    signUpButton: {
        margin: 10,
        height: 48,
        borderRadius: 6,
        borderWidth:2,
        borderColor:"#f99558",
        backgroundColor:"rgb(250,250,251)",
        justifyContent: "center",
        alignItems: "center"
    },
    columnBox:{
        flex:1,
        flexDirection: "column", 
        margin: 40,
    }
});
  
export default Main;
  