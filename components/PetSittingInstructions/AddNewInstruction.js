import React from "react"

import {
  StyleSheet, Text,
  TextInput, View,
  Button, ImageEditor, ScrollView,
  Image, Platform, FlatList, SectionList, TouchableOpacity
} from "react-native"

import Icon from 'react-native-vector-icons/MaterialIcons';
import firebaseSvc from "../../FirebaseSvc";
import DateTimePicker from '@react-native-community/datetimepicker';

const colors = {
    white: "#fff",
    cornflower: 'rgb(112,105,238)',
    paleGrey: 'rgb(250,250,251)',
    eggplantTwo: "rgb(26,5,29)"
}


function DateTimePickerComponent(props) {
    // Need to set the data. so it will pass in a set time function, which accepts two different 
    const [date, setDate] = React.useState(new Date(Date.now()))
    const mode = props.mode
    // const [show, setShow] = React.useState(props.show)
    const submit = props.submit
    // const effect = React.useEffect(()=>{
    //     date = new Date("2018-09-30T11:00:00")
    //     setShow(props.show)   
    // })

    onDateChange = (event, newDate) => {
        newDate = newDate || date;

        setDate(newDate)
    }

    return (
        <View style={{ flex: 1, position:"absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "#ffffff"}}>
            {/* The button is used for submit */}
            <Button title="Submit" onPress={() => { submit(date) }}></Button>
            <DateTimePicker
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                // date = {date}
                onChange={onDateChange}
            />
        </View>)

}

export default class AddNewInstruction extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            instruction: "",
            repeatFrequency: "Everyday",
            time: undefined,
            reminder: "Choose a date",
            addNewDetails: "", 
            show : false
        }
    }
    
    static navigationOptions = ({navigation}) => ({
        title: "Add New Instruction",
        headerRight: <Button title="Save" onPress={() => {navigation.getParam("handleSave")(); navigation.navigate("PetSittingInstruction")} }> </Button>
    })

    componentDidMount = () => {

        this.props.navigation.setParams({ handleSave : () => {
                const state = this.state
                // add the parameters to navigation 
                // Submit to the server.
                // I need to think about the data structure in the firestore and make it make sense 
                const addANewInstruction = this.props.navigation.getParam("addANewInstruction")
                console.log("adding new instruction")
                console.log(addANewInstruction)
                addANewInstruction({
                    instruction: state.instruction, 
                    repeat: state.repeatFrequency,
                    reminder: state.reminder,
                    date: state.time
                })
            }
        })
    }   

    showForTime = () => {

    }

    render = () =>{
        return (
            <View style={{height: "100%"}}>
                
            <ScrollView style={styles.additionContainer}>
                <TextInput value={this.state.instruction} onChangeText={(text) => this.setState({instruction:text})} placeholder="Add task or instruction" style={styles.instructionSubjectText}>
                    
                </TextInput>
                
                <TouchableOpacity>
                    <Text style={styles.createFromSaved}>
                        Create from saved instructions
                    </Text>

                </TouchableOpacity>
                {/* <Button title="Create from saved instructions" color={colors.cornflower}>
                    
                </Button> */}

                <TouchableOpacity style={styles.individualButton}>
                    <Icon name="repeat" size={24}>
                                           
                    </Icon>

                    <Text>
                        Repeat: {this.state.repeatFrequency}
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity style={styles.individualButton} onPress = {() => {this.setState({show: true})}}>
                    <Icon name="repeat" size={24}>
                        
                    </Icon>

                    {/* This should be a date picker */}
                    <Text>

                        Time: {this.state.time === undefined ? "Selected Date": this.state.time.toTimeString()}
                    </Text>         

                    {/* <Button title="Morning" onPress = {() => {}} >
                        
                    </Button> */}
                </TouchableOpacity>

                <TouchableOpacity style={styles.individualButton} onPress={()=>{}}>
                    <Icon name="repeat" size={24}>
                        
                    </Icon>

                    <Text>
                        Reminder: {this.state.reminder}
                    </Text>

                    {/* <Button title="Off" onPress = {() => {}} >
                        
                    </Button> */}
                    
                </TouchableOpacity>

                <View style={styles.instructionForNewInstruction}>
                    <Text style={{height: 40}}>
                    If you turn on the reminder, the sitter will receive a notification 
                    </Text>
                </View>

                <TextInput placeholder="Add details" style={styles.inputBox} multiline> 
                    
                </TextInput>
            </ScrollView>
            {this.state.show ? <DateTimePickerComponent mode={"time"} submit={ (date) => this.setState({time: date, show: false})}></DateTimePickerComponent> : <View/> }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    additionContainer : {
        padding: 12
    },
    instructionSubjectText : {
        width: 323,
        height: 47,
        padding: 4,
        borderRadius: 4,
        backgroundColor: colors.white,
        shadowColor: "rgba(0, 0, 0, 0.07)",
        shadowOffset: {
          width: 0,
          height: 7
        },
        shadowRadius: 64,
        shadowOpacity: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ecebed"      
    }, 
    createFromSaved : {
        width: 223,
        height: 18,
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: colors.cornflower,
        marginVertical: 12   
    },

    individualButton : {
        marginVertical: 5,
        width: 323,
        height: 40,
        borderRadius: 4,
        backgroundColor: colors.paleGrey,
        flexDirection: "row", alignItems: "center",
        padding: 8
    },
    individualButtonText : {
        marginLeft: 8,
        width: 109,
        height: 18,
        fontSize: 13,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: colors.eggplantTwo
    }, 
    
    instructionForNewInstruction: {
        marginLeft: 12,
        // width: 273,
        height: 26,
        // fontFamily: "SFProText",
        fontSize: 11,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 13,
        letterSpacing: 0,
        color: colors.eggplantTwo,
        marginBottom: 24
    }, 
    inputBox : {
        marginTop:24,
        // width: 322,
        height: 271,
        borderRadius: 8,
        backgroundColor: colors.white,
        shadowColor: "rgba(0, 0, 0, 0.07)",
        shadowOffset: {
            width: 0,
            height: 7
        },
        shadowRadius: 64,
        shadowOpacity: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ecebed",
        padding: 8
    }



})