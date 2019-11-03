import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView,
    Image, Platform, TouchableOpacity, 
    ImageBackground, Alert,
    SafeAreaView
} from "react-native"

import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';




function DateTimePickerComponent(props) {
    // Need to set the data. so it will pass in a set time function, which accepts two different 
    const [date, setDate] = React.useState(new Date(Date.now()))
    const mode = props.mode
    const [show, setShow] = React.useState(props.show)
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
                onChange={onDateChange}
            />
        </View>)

}


function CustomHeader(props) {
    return (
        <View style={{height: 70, width:"100%", justifyContent:'center', left: 0,padding: 12, backgroundColor: "rgb(250,250,251)"}}>
            <Text style={styles.title}>
                New Pet Sitting Request
            </Text>
        </View>
    )
}


export default class PetSittingBasicInformation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            date: new Date('2020-06-12T14:42:42'),
            startDate: undefined,
            endDate: undefined,
            mode: 'date',
            service: "",
            additionalNotes: ""
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: "New Pet Sitting Request",
        header: null,
        
        // headerRight: <Button title="Next" onPress={() => { navigation.navigate("SearchSitterList") }}></Button>
    })

    setDate = (event, date) => {
        date = date || this.state.date;

        this.setState({
            show: Platform.OS === 'ios' ? true : false,
            date,
        });
    }

    show = mode => {
        this.setState({
            show: true,
            mode,
        });
    }

    submitForStartDate = (date) => {
        console.log("submit for start date")
        console.log(date)
        this.setState({ show: false, startDate: date })
    }

    submitForEndDate = (date) => {
        if (this.state.startDate !== undefined){
            if (this.state.startDate.getTime() > date.getTime()){
                // You shouldn't have that number
                Alert.alert(
                    'Pick another time',
                    `End date should be later than start date `,
                    [
                    //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                    //   {
                    //     text: 'Cancel',
                    //     onPress: () => console.log('Cancel Pressed'),
                    //     style: 'cancel',
                    //   },
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: true},
                  );
                return
            }
        } 

        this.setState({ show: false, endDate: date })
    }

    datePickerForStartDate = () => {
        this.submit = this.submitForStartDate
        this.datepicker()
    }

    datePickerForEndDate = () => {
        this.submit = this.submitForEndDate
        this.datepicker()
    }

    timepicker = () => {
        this.show('time');
    }

    datepicker = () => {
        this.show('date');
    }

    submit = (date) => {
        this.setState({ show: false, endDate: date })
    }

    homeSittingButtonPress = () => {
        
    }

    isInformationReady = () =>  
        {
            const ret = this.state.startDate !== undefined && this.state.endDate !== undefined && this.state.service !== ""
            console.log(ret)
            return ret
        }

    navigateToSearch =
        () => 
            this.props.navigation.navigate("SearchSitterList",{
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                service: this.state.service,
                additionalNotes: this.state.additionalNotes
            }) 

    render() {

        // const {show, date, mode} = this.state
        return (
            <SafeAreaView style={{alignItems:"center",height: "100%", backgroundColor: "#fafafa"}}>
            <CustomHeader></CustomHeader>
            <ScrollView contentContainerStyle={{width:"100%"}} style={{backgroundColor:"rgb(250,250,251)", width:"100%"}}>
                <View style={{flex: 1, top: 0, flexDirection: "column", paddingHorizontal: 12, marginVertical: 0, width:"100%" }}>

                    {/* Date section */}
                    <View style={{}}>
                        <Text style={styles.dates}>
                            DATES
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View>
                                <TouchableOpacity onPress={this.datePickerForStartDate} style={styles.startDateFrame}>
                                    <Text style={styles.buttonText}>
                                        {this.state.startDate === undefined ? "Start Date" : `${this.state.startDate.getMonth()+1}/${this.state.startDate.getDate()}/${this.state.startDate.getFullYear()}`}
                                    </Text>
                                    <Icon name="date-range" size={24} color={"#d0c9d6"}></Icon>

                                </TouchableOpacity>
                                {/* <Button title={this.state.startDate === undefined ? "Select Date": `${this.state.startDate.getMonth()}/${this.state.startDate.getDate()}/${this.state.startDate.getFullYear()}`}
                                    color={"red"}  onPress={this.datePickerForStartDate}>
                                </Button> */}
                            </View>

                            <View style={{ marginLeft: 41 }}>
                                <TouchableOpacity onPress={this.datePickerForEndDate} style={styles.startDateFrame}>
                                    <Text style={styles.buttonText}>
                                        {this.state.endDate === undefined ? "End Date" : `${this.state.endDate.getMonth()+1}/${this.state.endDate.getDate()}/${this.state.endDate.getFullYear()}`}
                                    </Text>

                                    <Icon name="date-range" size={24} color={"#d0c9d6"}></Icon>
                                </TouchableOpacity>
                            </View>
                            {/* 
                            <Button title={this.state.endDate === undefined ? "Select Date": `${this.state.endDate.getMonth()}/${this.state.endDate.getDate()}/${this.state.endDate.getFullYear()}` }
                                onPress={this.datePickerForEndDate} color={"red"} style={{}}/> */}
                        </View>
                    </View>

                    {/* Pet Section */}
                    <View style={{ flex: 4, flexDirection: "column",  marginVertical: 20}}>
                        <Text style={styles.petsLabel}>
                            PETS
                        </Text>

                        <View style={{ width: 100, justifyContent: "center", alignItems: "center" }}>
                            <ImageBackground style={styles.personProfilePhoto} imageStyle={styles.petImageStyle} defaultSource={require("./griffey.jpg")}>
                                <View style={styles.checkMark} >
                                    <Icon name={"check"} size={16} color={"#ffffff"}></Icon>
                                </View>
                            </ImageBackground>
                            <Text style={styles.petName}>
                                Griffey
                            </Text>
                        </View>
                    </View>

                    {/* Service section */}
                    <View style={{ flex: 5, flexDirection: "column", marginBottom: 20, width:"100%"}}>
                        <Text style={styles.servicesLabel}>
                            SERVICES
                        </Text>

                        <TouchableOpacity style={ this.state.service === "Home Sitting" ?  styles.selectedServiceButtonStyle :  styles.serviceButtonStyle} onPress={() => { this.setState({ service: "Home Sitting" }) }}>
                            <Text style={this.state.service === "Home Sitting" ? styles.selectedText : styles.enabledText}>
                                Home Sitting
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={this.state.service === "Pet Boarding" ? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState({ service: "Pet Boarding" }) }}>
                            <Text style={this.state.service === "Pet Boarding" ? styles.selectedText : styles.enabledText} >
                                Pet Boarding
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={ this.state.service === "Home Visit" ? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState({ service: "Home Visit" }) }}>
                            <Text style={this.state.service === "Home Visit" ? styles.selectedText : styles.enabledText}>
                                Home Visit
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Additional notes section */}
                    <View style={{flex: 6, flexDirection: "column", marginBottom: 20}}>
                        <Text style={styles.servicesLabel}>
                            ADDITIONAL NOTES
                        </Text>

                        <TextInput value={this.state.additionalNotes}
                         placeholder="Leave some additional notes" multiline style={styles.additionalNotesInput}
                         onChangeText={(text)=> this.setState({additionalNotes: text}) }
                         >
                            
                        </TextInput> 
                    </View>


                    {/* <View style={{ flex: 6, justifyContent: "center",marginBottom: 20 }}> */}
                </View>
            </ScrollView>
            <View style={{ position: "relative", justifyContent: "center", width:"80%" }}>
                        <TouchableOpacity style={this.isInformationReady() ? styles.searchFrame : styles.disabledSearchFrame } 
                        onPress={this.isInformationReady() ? this.navigateToSearch : () =>{}}>
                            <Text style={ this.isInformationReady() ? styles.enabledText: styles.disabledText }>
                                Search
                            </Text>
                        </TouchableOpacity>
                    </View>
            {this.state.show ? <DateTimePickerComponent mode={this.state.mode} submit={this.submit} /> : <Text></Text>}
            </SafeAreaView>

        )
    }
}


const colors = {
    eggplantTwo: "rgb(26,5,29)"
}

// Add image 
const styles = StyleSheet.create({
    leftLabel: {
        width: 200,
        marginRight: 0,
        fontSize: 24
    },

    serviceSelected: {
        // color: "#fff",
        paddingLeft: 70
    },
    serviceUnSelected: {
        color: "blue",
        paddingLeft: 70
    },
    startDateFrame: {
        flexDirection: "row",
        width: 160,
        height: 48,
        borderRadius: 6,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.07)",
        shadowOffset: {
            width: 0,
            height: 7
        },
        shadowRadius: 64,
        shadowOpacity: 1,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor:"#e5e3e2",

    },
    buttonText: {
        width: 100,
        height: 20,
        // fontFamily: "SFPro",
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: "#d0c9d6",
        alignItems: "center",
        justifyContent: "center",
        color: "#3f3356"
        // marginRight: 4
    },
    dates: {
        marginBottom: 14,
        width: 40,
        height: 16,
        // fontFamily: "SFProText",
        fontSize: 12,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: 0,
        color: "#1a051d"
    },
    petImageStyle:{ 
        height: 56, width: 56, borderRadius: 28, position:"relative"
    },
    personProfilePhoto: {
        height: 60, width: 60, borderRadius: 30, backgroundColor: "grey", 
        marginLeft: 8, marginRight: 8, marginBottom: 8,borderStyle: "solid",
        borderWidth: 3,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderColor: "#a5affb"
    },
    checkMark: {
        position:"absolute",
        display: "flex",
        justifyContent:"center",
        alignItems:"center",
        right: 0,
        bottom: 0,
        width: 24,
        height: 24,
        borderRadius:12,
        backgroundColor: "#rgb(249,149,88)"
    },
    petsLabel: {
        marginBottom: 20,
        width: 32,
        height: 16,
        // fontFamily: "SFProText",
        fontSize: 12,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: 0,
        color: "#1a051d"
    },
    petName: {
        width: 60,
        // backgroundColor: "red",
        height: 14,
        // fontFamily: "SFProText",
        fontSize: 12,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#1a051d",
        textAlign: "center",
        justifyContent: "center"
    },
    servicesLabel: {
        // width: 60,
        height: 16,
        // fontFamily: "SFProText",
        fontSize: 12,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: 0,
        color: "#1a051d",
        marginBottom: 20
    },
    serviceButtonStyle: {
        width: "100%",
        height: 44,
        borderRadius: 4,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#e5e3e2",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 16,
        paddingHorizontal: 16
    },
    selectedServiceButtonStyle: {
        width: "100%",
        height: 44,
        borderRadius: 4,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#f99558",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 16,
        paddingHorizontal: 16
    },

    dogWalkingStyle: {
        width: 79,
        height: 18,
        // fontFamily: "SFProText",
        fontSize: 13,
        fontWeight: "bold",
        // fontStyle: "bold",
        lineHeight: 18,
        letterSpacing: 0,
        color: "#1a051d",
    },
    disabledText: {
        color: "#ffffff",
        fontWeight:"bold"
    },
    enabledText: {
        color: "#1a051d",
        fontWeight:"bold"
    },
    selectedText: {
        // color: "#f99558"
        color: "#1a051d",
        fontWeight:"bold"
    },
    searchFrame: {
        // width: "90%",
        height: 48,
        borderRadius: 6,
        backgroundColor: "#f99558",
        justifyContent: "center",
        alignItems: "center"
    }, 
    disabledSearchFrame : {
        height: 48,
        borderRadius: 6,
        backgroundColor: "#7c7c7c",
        justifyContent: "center",
        alignItems: "center"
    },
    additionalNotesInput: {
        height: 300,
        backgroundColor: "#ffffff",
        borderRadius: 8, 
        padding: 12,
    },
    title : {
        // width: 85,
        // height: 28,
        // fontFamily: "SFProDisplay",
        fontSize: 22,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 28,
        letterSpacing: 0,
        color: colors.eggplantTwo
    }
})