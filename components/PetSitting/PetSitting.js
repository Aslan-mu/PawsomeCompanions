import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image 
} from "react-native"

export default class PetSitting extends React.Component {
 
    constructor(props) {
        super(props)
    }

    static navigationOptions = {
        title:"PetSitting",
    }    

    render(){
        return (
            <View>
                <Text>
                    This is the pet sitting page
                </Text>
            </View>
        )
    }

}