import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image 
} from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"
export default class RequestSentConfirmation extends React.Component {

    constructor(props){
        super(props)
    }

    static navigationOptions = {
        title: "Request sent",
    }

    render = () => {
        return (<View style={{justifyContent: "center", alignItems:"center"}}>
                <MaterialCommunityIcon name="check-circle-outline" size={40} style={{marginTop: 184}}/>

                <Text style={styles.confirmationSentence}>
                    Pet sitting request sent
                </Text>
            </View>)
    }

}

const styles = StyleSheet.create({
    confirmationSentence : {
        marginTop: 16,
        width: 242,
        height: 44,
        // fontFamily: "SFProText",
        fontSize: 17,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: "#1a051d"
    }, 
    
})