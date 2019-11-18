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
import {format} from "date-fns"
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"

const colors = {
    white: "#fff",
    cornflower: 'rgb(112,105,238)',
    paleGrey: 'rgb(250,250,251)',
    eggplantTwo: "rgb(26,5,29)"
}

class CheckBox extends React.Component {
    constructor(props) {
      super(props);
      this.state = {isCheck: props.value};
    }
  
    checkClicked = async () => {
      await this.setState(prevState => ({
        isCheck: !prevState.isCheck,
      })); // setState is async function.
  
      // Call function type prop with return values.
      this.props.clicked && this.props.clicked(this.props.value, this.state.isCheck);
    }
  
    
    componentDidUpdate( prevProps , prevState){
        if (prevProps.value !== this.props.value){
            this.setState({isCheck: this.props.value})
        }
    }

    render() {
      return (
        <TouchableOpacity onPress={this.checkClicked} style={this.props.style}>
          <View style={{
            height: 24,
            width: 24,
            borderWidth: 1,
            borderColor: 'rgb(236,235,237)',
            backgroundColor:"#ffffff",
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius:4,
            shadowColor: "rgba(0, 0, 0, 0.07)",
            shadowOffset: {
                width: 0,
                height: 7
            },
            shadowRadius: 24,
            shadowOpacity: 1,
          }}>
            <View style={{
              height: 12,
              width: 12,
              backgroundColor: this.state.isCheck ? 'rgb(151,151,151)' : '#FFF',
            }} />
          </View>
        </TouchableOpacity>
      )
    }
}


function DateTimePickerComponent(props) {
    // Need to set the data. so it will pass in a set time function, which accepts two different 
    const [date, setDate] = React.useState(new Date(Date.now()))
    const mode = props.mode
    const submit = props.submit

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
                style={{backgroundColor:"#c9c9c9"}}
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
            // reminder: "Off",
            reminder: false,
            notes: "", 
            show : false, 
            crucial: false,
            saveToSavedInstruction: true
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
                    date: state.time,
                    crucial: state.crucial,
                    saveToSavedInstruction: state.saveToSavedInstruction
                })
            }
        })
    }   

    showForTime = () => {

    }

    setInstruction = (instruction) => {
        this.setState({instruction: instruction})
    }

    render = () =>{
        return (
            <View style={{height: "100%"}}>
                
            <ScrollView style={styles.additionContainer}>
                <TextInput value={this.state.instruction} 
                        onChangeText={(text) => this.setState({instruction:text})} 
                        placeholder="Add task or instruction" style={styles.instructionSubjectText}
                        multiline
                        textAlignVertical="center"
                        
                        >           
                </TextInput>
                
                <TouchableOpacity onPress={()=> this.props.navigation.navigate("SavedInstruction", {setInstruction: this.setInstruction})}>
                    <Text style={styles.createFromSaved}>
                        Or create from saved instructions
                    </Text>
                </TouchableOpacity>
                {/* <Button title="Create from saved instructions" color={colors.cornflower}>    
                </Button> */}


                <TouchableOpacity style={[styles.individualButton, {marginTop:32}]}>
                    <Icon name="repeat" size={24}/>
                                        
                    <Text style={{marginLeft: 8}}>
                        Repeat: {this.state.repeatFrequency}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.individualButton} onPress={()=>{}}>
                    <MaterialCommunityIcon name="bell-outline" size={24}/>

                    <Text style={{marginLeft: 8}}>
                        {/* Reminder: {this.state.reminder} */}
                        Reminder
                    </Text>

                    {/* <Button title="Off" onPress = {() => {}} >
                        
                    </Button> */}
                    <CheckBox clicked={(value, isChecked) => this.setState({reminder: isChecked}) } value={this.state.reminder} style={{position:"absolute", right: 20}}>

                    </CheckBox>
                    
                </TouchableOpacity>

                { this.state.reminder ? 

                <TouchableOpacity style={styles.individualButton} onPress = {() => {this.setState({show: true})}}>
                    <Icon name="access-time" size={24}/>

                    {/* This should be a date picker */}
                    <Text style={{marginLeft: 8}}>
                        Time: {this.state.time === undefined ? "Select time": format(this.state.time, "hh:mm A")}
                    </Text>         

                    {/* <Button title="Morning" onPress = {() => {}} >
                        
                    </Button> */}
                </TouchableOpacity> :
                
                <View></View>
                }

                <View style={styles.instructionForNewInstruction}>
                    <Text style={{height: 40}}>
                    If you turn on the reminder, the sitter will receive a notification 
                    </Text>
                </View>

                <TouchableOpacity style={[styles.individualButton, {marginTop:32}]}>
                    <Icon name="warning" size={24}/>

                    <Text style={{marginLeft: 8}}>
                        Crucial
                    </Text>

                    <CheckBox clicked={(value, isChecked)=>{this.setState({crucial: isChecked})}} value={this.state.crucial} style={{position:"absolute", right:20}} > 
                    </CheckBox>    
                </TouchableOpacity>

                <TouchableOpacity style={styles.individualButton} onPress = {() => {}}>
                    <MaterialCommunityIcon name="content-save-outline" size={24}/>

                    {/* This should be a date picker */}
                    <Text style={{marginLeft: 8}}>
                        Save to saved instructions
                    </Text>         

                    <CheckBox clicked={(value, isChecked)=>{ this.setState( {saveToSavedInstruction: isChecked} ) }} value={this.state.saveToSavedInstruction} style={{position:"absolute", right:20}} > 
                    </CheckBox>    
                </TouchableOpacity>

                <TextInput placeholder="Add details" value={this.state.notes} onChange={(text) => this.setState({notes:text})}  style={styles.inputBox} multiline/> 

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
        justifyContent:"center",
        paddingTop:0,
        paddingBottom: 0,
        height: 47,
        // padding: 4,
        paddingVertical: 10,
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
        borderColor: "#ecebed",
        alignItems:"center",
        marginTop:22,
        color: "#000"
    }, 
    createFromSaved : {
        height: 18,
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: colors.cornflower,
        marginVertical: 8,
        marginLeft: 8
    },

    individualButton : {
        marginBottom: 4,
        height: 40,
        borderRadius: 4,
        backgroundColor: colors.paleGrey,
        flexDirection: "row", alignItems: "center",
        padding: 8,
        paddingHorizontal: 12
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
        // width: 322,
        // height: 271,
        marginTop: 36,
        height: 47,
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
        padding: 8,
        color: "#000"
    }
})