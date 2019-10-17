import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image 
} from "react-native"

export default class PetSitting extends React.Component {

    // dummyUserData = 
    //     [
    //         {
    //             userName:"",
    //             userId:"",
    //         }

    //     ]
    
    constructor(props) {
        super(props)
    }

    static navigationOptions = {
        title:"PetSitting",
    }    

    render(){
        return (
            <View>
                {/* <Text>
                    This is the pet sitting page
                </Text> */}

                <Button title="Request new pet owners" style={{width:"80%"}} onPress={()=>{this.props.navigation.navigate("PetSittingBasicInformation")}}/>
                
                {/* User link */}

            </View>
        )
    }

}