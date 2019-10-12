import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image
} from "react-native"

class NewCommunityPost extends React.Component {

    static navigationOptions = {
        title: 'New Community Post',
    };

    render(){
        return (
        <View>
            <Text>
                This is new community post
            </Text>
        </View>
        )
    }
}

export default NewCommunityPost