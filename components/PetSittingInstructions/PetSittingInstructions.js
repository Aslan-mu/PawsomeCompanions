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
        petName: "Griffey",
        sitter: {
            id: "",
            name: "Aslan"
        },
        owner: {
            id: "d04fkhh2nVNPp62PYHEOM5cGv872",
            name: "JJ"
        },
        service:"Drop-in Visit",
        instructions: [
            {
                instruction: "Walk Griffey in the morning. I usually walk him around the block",
                repeat: "",
                reminder: "",
                date: ""
            }, 
            {
                instruction: "Feed Griffey after the walk",
                repeat: "",
                reminder: "",
                date:""
            }
        ]
    }
    
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            petName: "Griffey",
            sessionID:"",
            sitter: {
                id: "",
                name: "Aslan"
            },
            owner: {
                id: "d04fkhh2nVNPp62PYHEOM5cGv872",
                name: "JJ"
            },
            service:"Drop-in Visit",
            instructions: [
                {
                    instruction: "Walk Griffey in the morning. I usually walk him around the block",
                    repeat: "",
                    reminder: "",
                    date: ""
                }, 
                {
                    instruction: "Feed Griffey after the walk",
                    repeat: "",
                    reminder: "",
                    date:""
                }
            
            ]
        }
    }
    
    static navigationOptions =  ({navigation}) => ({
        title: "Pet Sitting",
        headerRight: <Button title="Next" onPress={ () => {navigation.navigate("AddNewInstruction")} }>  </Button>
    })

    componentDidMount = async () => {
        const ownerResult = await firebaseSvc.queryPetSittingSessionForOneOwner(global.currentUser.id)
        const sitterResult = await firebaseSvc.queryPetSittingSessionForOneSitter(global.currentUser.id)
        
        if (ownerResult.length > 0) {
            const sessionID = ownerResult[0].id
            const {startDate, endDate, owner, sitter, service, pet} = ownerResult[0].data()
            const snapshots = await firebaseSvc.queryInstructionsForOneSession(ownerResult[0].id)
            const instructions = []
            snapshots.forEach( 
                (doc) => {
                    const data = doc.data()
                    instructions.push({id: doc.id, instruction: data.instruction, repeat: data.repeat, reminder: data.reminder})
                }
            )
            
            const sitterDoc = await firebaseSvc.querySpecificUser(sitter)
            this.setState({
                sessionID,
                startDate: new Date(startDate.seconds * 1000),
                endDate: new Date(endDate.seconds * 1000),
                owner: {
                    id: owner,
                    name: global.currentUser.name
                },
                sitter: sitterDoc.data(),
                service,
                petName: pet,
                instructions,
                loading: false  
            })  
        }

        if (sitterResult.length > 0){
            const sessionID = ownerResult[0].id
            const {startDate, endDate, owner, sitter, service, pet} = sitterResult[0].data()
            const snapshots = await firebaseSvc.queryInstructionsForOneSession(sitterResult[0].id)
            const instructions = []
            snapshots.forEach( 
                (doc) => {
                    const data = doc.data()
                    instructions.push({id: doc.id, instruction: data.instruction, repeat: data.repeat, reminder: data.reminder})
                }
            )

            const ownerDoc = await firebaseSvc.querySpecificUser(owner)
            this.setState({
                sessionID,
                startDate: new Date(startDate.seconds * 1000),
                endDate: new Date(endDate.seconds * 1000),
                owner: ownerDoc.data(),
                sitter:{
                    name: global.currentUser.name,
                    id: global.currentUser.id
                },
                service,
                petName: pet,
                instructions,
                loading: false   
            })
        }

    }

    addANewInstruction = ({instruction, repeat, reminder, date}) => {
        const newObj = {
            instruction,
            repeat, 
            reminder,
            date
        }

        firebaseSvc.addNewInstructionToTheSession(this.state.sessionID, newObj)
        this.setState({
            instructions: [newObj].concat(this.state.instructions)
        })
    }

    render = () => {
        const isOwner = global.currentUser.id === this.state.owner.id

        return <ScrollView style={{padding: 12}}>
            <Text style={{marginVertical: 12, marginHorizontal: 12}}>
                Oct 7
            </Text>

            {
                this.state.loading ?  <Text>
                    
                </Text>
                 : 
            <View style={styles.petSittingCard}>
                <View style={{height: 112}}>                    
                    <View style={{flexDirection: "row", alignItems: "center", marginRight: 12}} >
                        {
                            isOwner ? 
                                <Text style={styles.petSittingTitle}>
                                    {this.state.sitter.name} pet sitting for you
                                </Text> :
                                <Text style={styles.petSittingTitle}>
                                    Pet Sitting for {this.state.owner.name}
                                </Text> 
                        }

                        <View style={styles.personProfilePhoto}>

                        </View>

                    </View>

                    <View>
                        <View style={{flexDirection: "row", marginBottom: 4}}>
                            <Icon name="pets" size={16}></Icon>
                            <Text style={styles.dogNameText}> {this.state.petName} </Text>
                        </View>

                        <View style={{flexDirection: "row", marginBottom: 4}}>
                            <MaterialCommunityIcon name="calendar" size={16}></MaterialCommunityIcon>
                            <Text style={styles.dogNameText}> 
                            {`${this.state.startDate.getMonth() + 1} ${this.state.startDate.getDay()}, ${this.state.startDate.getFullYear()} to ${this.state.endDate.getMonth() + 1} ${this.state.endDate.getDay()}, ${this.state.endDate.getFullYear()}`}
                            </Text>
                        </View>

                        <View style={{flexDirection: "row", marginBottom: 4}}>
                            <Icon name="info" size={16}></Icon>
                            <Text style={styles.dogNameText}> Drop-in visit </Text>
                        </View>

                    </View>

                </View>

                {/* <View style={styles.divider}/> */}

                <View style={{marginVertical: 12}}>
                    <Text style={styles.instructionTitle}>
                        Instructions
                    </Text>

                    {this.state.instructions.map( (instruction, i) => {
                        return (<View style={{flexDirection: "row", alignItems: "flex-start", marginBottom: 12}} key={i}>   
                            <Icon name={"repeat"} size={16}/>
                            <Text style={styles.instructionTextLine}>
                                {instruction.instruction}
                            </Text>
                        </View>
                        )
                    }) }
                </View>
                {
                    isOwner ? 
                    <TouchableOpacity style={styles.addNewInstructionButton} onPress = { () =>{this.props.navigation.navigate("AddNewInstruction", {addANewInstruction: this.addANewInstruction}); console.log(this.addANewInstruction)}}>
                        <Icon name={"add"} size={14} color={"#fff"}>

                        </Icon>
                        <Text style={styles.addInstructionButtonText}>
                            Add instruction
                        </Text>
                    </TouchableOpacity>
                    : 
                    <View/>
                }
            </View>
            }
        </ScrollView>
    }
}

const colors = {
    pastelOrange : "rgb(249,149,88)"
}

const styles = StyleSheet.create({
    petSittingCard : {
        // width: 349,
        height: 420,
        backgroundColor: "#ffffff",
        // shadowColor: "rgba(0, 0, 0, 0.07)",
        // shadowOffset: {
        //   width: 0,
        //   height: 0
        // },
        // shadowRadius: 10,
        // shadowOpacity: 1,
        padding: 12
    },
    divider : {
        width: "100%",
        height: 1,
        backgroundColor: "#e0ddea"
    },
    addNewInstructionButton: {
        justifyContent: "center",
        alignItems:"center",
        flexDirection:"row",
        width: 147,
        height: 34,
        borderRadius: 6,
        backgroundColor: colors.pastelOrange
    }, 
    petSittingTitle: {
        // width: 150,
        // height: 14,
        // fontFamily: "SFProText",
        fontSize: 17,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#1a051d",
        justifyContent:"center",
        alignItems: "center",
        marginRight: 100,
        marginBottom: 8
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
        // width: 87,
        height: 18,
        // fontFamily: "SFProText",
        fontSize: 17,
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
    }, 
    addInstructionButtonText : {
        width: 104,
        height: 18,
        // fontFamily: "SFProText",
        fontSize: 13,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: "#fbfbfb"
    }
})