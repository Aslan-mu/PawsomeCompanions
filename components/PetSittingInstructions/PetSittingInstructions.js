import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image 
} from "react-native"

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebaseSvc from "../../FirebaseSvc";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class PetSittingInstructions extends React.Component {

    dummyData = {
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now()),
        petName: "",
        sitter: "",
        owner: "",
        service:"Drop-in Visit",
        instructions: [
            "Walk Griffey in the morning. I usually walk him around the block",
            "Feed Griffey after the walk"
        ]
    }

    constructor(props) {
        super(props)
    }
    
    static navigationOptions =  ({navigation}) => ({
        title: "Pet Sitting",
        headerRight: <Button title="Next" onPress={ () => {navigation.navigate("AddNewInstruction")} }>  </Button>
    })

    render = () => {
        return <ScrollView style={{padding: 12}}>
            <Text style={{marginVertical: 12}}>
                Oct 7
            </Text>

            <View style={styles.petSittingCard}>
                <View style={{height: 112}}>
                    <View style={{flexDirection: "row", alignItems: "center", marginRight: 12}} >
                        <Text style={styles.petSittingTitle}>
                            Pet Sitting for Ashley
                        </Text>

                        <View style={styles.personProfilePhoto}>

                        </View>

                        <TouchableOpacity style={styles.messageButton}>
                            <Text style={styles.messageButtonText}>
                                Message
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <View style={{flexDirection: "row", marginBottom: 4}}>
                            <Icon name="pets" size={16}></Icon>
                            <Text style={styles.dogNameText}> One dog </Text>
                        </View>

                        <View style={{flexDirection: "row", marginBottom: 4}}>
                            <MaterialCommunityIcon name="calendar" size={16}></MaterialCommunityIcon>
                            <Text style={styles.dogNameText}> 
                            {`${this.dummyData.startDate.getMonth() + 1} ${this.dummyData.startDate.getDay()}, ${this.dummyData.startDate.getFullYear()} to ${this.dummyData.endDate.getMonth() + 1} ${this.dummyData.endDate.getDay()}, ${this.dummyData.endDate.getFullYear()}`}
                            </Text>
                        </View>

                        <View style={{flexDirection: "row", marginBottom: 4}}>
                            <Icon name="info" size={16}></Icon>
                            <Text style={styles.dogNameText}> Drop-in visit </Text>
                        </View>

                    </View>

                </View>

                <View style={styles.divider}/>

                <View style={{marginVertical: 12}}>
                    <Text style={styles.instructionTitle}>
                        Instructions
                    </Text>

                    {this.dummyData.instructions.map( instruction => {
                        console.log(instruction)
                        return (<View style={{flexDirection: "row", alignItems: "flex-start", marginBottom: 12}}>   
                            <Icon name={"repeat"} size={16}/>
                            <Text style={styles.instructionTextLine}>
                                {instruction}
                            </Text>
                        </View>
                        )
                    }) }

                    {/* <View style={{flexDirection: "row", alignItems: "flex-start"}}>   
                        <Icon name={"repeat"} size={16}/>
                        <Text style={styles.instructionTextLine}>
                            Feed Griffey
                        </Text>

                    </View> */}
                </View>
                {
                    global.currentUser.id === this.dummyData.owner ? 
                    <Button title={"Add new instruction"}>
                    
                    </Button>
                    : 
                    <View/>
                }
            </View>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    petSittingCard : {
        // width: 349,
        height: 420,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.07)",
        shadowOffset: {
          width: 0,
          height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        padding: 12
    },
    divider : {
        width: "100%",
        height: 1,
        backgroundColor: "#e0ddea"
    },
    petSittingTitle: {
        // width: 150,
        // height: 14,
        // fontFamily: "SFProText",
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#1a051d",
        justifyContent:"center",
        alignItems: "center",
        marginRight: 100,
    },
    personProfilePhoto: { 
        height: 24, 
        width: 24, 
        borderRadius: 12, 
        backgroundColor: "grey", 
        marginRight: 8 
    },
    messageButton: {
        width: 87,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: "#ffdfce", 
        alignItems: "center"

    },
    messageButtonText: {
        width: 57,
        height: 18,
        fontSize: 13,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: "#6979f8"
    }, 
    dogNameText : {
        // width: 63,
        height: 18,
        // fontFamily: "SFProText",
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: "#1a051d"
    }, 
    instructionTitle: { 
        width: 87,
        height: 18,
        // fontFamily: "SFProText",
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#1a051d",
        marginBottom: 8
    },
    instructionText: {
        width: 296,
        height: 26,
        // fontFamily: "SFProText",
        fontSize: 11,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 13,
        letterSpacing: 0,
        color: "#1a051d"
    }, 
    instructionTextLine: {
        // width: 296,
        // height: 26,
        // fontFamily: "SFProText",
        marginLeft: 4,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d"
    }


})