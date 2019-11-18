import React from 'react';
import {
  StyleSheet, Text,
  View,TouchableOpacity,
  Dimensions
} from 'react-native';

class PetSittingPreferenceStart extends React.Component {
    static navigationOptions = {
        title: 'PetSittingPreference',
    };
  
    render() {
        return (
            <View style = {styles.viewStyle}>
                <View style={styles.columnBox}>
                    <Text style={styles.servicesLabel}>Pet sitting preference</Text>
                    <Text style={styles.textContent}>
                        Our community thrives by helping each other. You can choose to register as a pet sitter. If you are happy to pet sit, pet owners can send you pet sitting request to help taking care of their furry friends.
                    </Text>
                </View>
                <View style={styles.columnBox}>
                    <TouchableOpacity style={styles.loginButton} 
                        onPress={()=>{this.props.navigation.navigate("PetSittingPreference")}}
                        >
                        <Text style={styles.loginText}>
                            Yes, I'd love to pet sit
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signUpButton} 
                        onPress={()=>{
                            alert("Account created! Login now!")
                            this.props.navigation.navigate("Login")
                        }}>
                        <Text style={styles.signUpText}>
                            Not now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
  
const styles = StyleSheet.create({
    viewStyle:{
        paddingTop:0.16*Dimensions.get('window').height,
        paddingBottom:0.223*Dimensions.get('window').height,
        flex:1,
        backgroundColor:"rgb(250,250,251)"
    },
    servicesLabel: {
        textAlign: 'center',
        fontWeight: "600",
        fontSize: 20,
        lineHeight: 24,
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d",
        margin:20,
    },
    textContent:{
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d",
        margin:10
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
  
export default PetSittingPreferenceStart;
  