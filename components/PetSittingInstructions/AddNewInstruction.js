import React from "react"

import {
  StyleSheet, Text,
  TextInput, View,
  Button, ImageEditor, ScrollView,
  Image, Platform, FlatList, SectionList, TouchableOpacity
} from "react-native"

import Icon from 'react-native-vector-icons/MaterialIcons';
import firebaseSvc from "../../FirebaseSvc";


export default class AddNewInstruction extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            repeatFrequency: "",
            time: "",
            reminder: "",
            addNewDetails: ""
        }
    }
    
    static navigationOptions = {
        title: "Add New Instruction",
        headerRight: <Button title="Save"> </Button>
    }

    componentDidMount = () => {
        this.props.navigation.setParams({ handleSave : () => {
                // add the parameters to navigation 
                // Submit to the server.
                // I need to think about the data structure in the firestore and make it make sense 

            }
        })
    }   

    render = () =>{
        return (
            <View>
                <TextInput placeholder="Feed Griffey after walk">
                    
                </TextInput>

                <Button title="Create from saved instructions">
                    
                </Button>

                <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon name="repeat">
                                           
                    </Icon>

                    <Text>
                        Repeat:
                    </Text>

                    {/* What should this control be? Drop down? */}
                    <Button title="Everyday" onPress = {() => {}} >
                        
                    </Button>
                </TouchableOpacity>

                <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon name="repeat">
                        
                    </Icon>

                    <Text>
                        Time:
                    </Text>         

                    <Button title="Morning" onPress = {() => {}} >
                        
                    </Button>
                </TouchableOpacity>

                <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon name="repeat">
                        
                    </Icon>

                    <Text>
                        Reminder
                    </Text>

                    <Button title="Off" onPress = {() => {}} >
                        
                    </Button>
                </TouchableOpacity>

                <TextInput placeholder="Add details"> 
                    
                </TextInput>

            </View>
        )
    }
}