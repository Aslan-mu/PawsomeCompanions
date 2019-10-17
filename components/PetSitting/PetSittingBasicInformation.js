import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView,
    Image, Platform, TouchableOpacity
} from "react-native"

import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

function DateTimePickerComponent(props) {
    // Need to set the data. so it will pass in a set time function, which accepts two different 
    const [date, setDate] = React.useState(new Date(Date.now()))
    const mode = props.mode
    const [show, setShow] = React.useState(props.show)
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
        <View style={{ flex: 1 }}>
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


export default class PetSittingBasicInformation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            date: new Date('2020-06-12T14:42:42'),
            startDate: undefined,
            endDate: undefined,
            mode: 'date',
            service: ""
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: "New Search",
        headerRight: <Button title="Next" onPress={() => { navigation.navigate("SearchSitterList") }}></Button>
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
        this.setState({ show: false, endDate: date })
    }

    datePickerForStartDate = () => {
        ``
        this.submit = this.submitForStartDate
        this.datepicker()
    }

    datePickerForEndDate = () => {
        ``
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

    render() {
        // const {show, date, mode} = this.state
        return (
            <ScrollView>
                <View style={{ flex: 1, top: this.state.show ? -100 : 0, flexDirection: "column" }}>

                    {/* Date section */}
                    <View style={{ margin: 20 }}>
                        <Text style={styles.dates}>
                            DATES
                        </Text>

                        <View style={{ flexDirection: "row" }}>
                            <View>
                                <TouchableOpacity onPress={this.datePickerForStartDate} style={styles.startDateFrame}>
                                    <Text style={styles.buttonText}>
                                        {this.state.startDate === undefined ? "Start Date" : `${this.state.startDate.getMonth()}/${this.state.startDate.getDate()}/${this.state.startDate.getFullYear()}`}
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
                                        {this.state.endDate === undefined ? "End Date" : `${this.state.endDate.getMonth()}/${this.state.endDate.getDate()}/${this.state.endDate.getFullYear()}`}
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
                    <View style={{ margin: 20, flex: 4, flexDirection: "column", }}>
                        <Text style={styles.petsLabel}>
                            PETS
                        </Text>

                        <View style={{ width: 100, justifyContent: "center" }}>
                            <View style={styles.personProfilePhoto}>

                            </View>
                            <Text style={styles.petName}>
                                Griffey
                            </Text>
                        </View>
                    </View>

                    {/* Service section */}
                    <View style={{ flex: 5, flexDirection: "column", margin: 20 }}>
                        <Text style={styles.servicesLabel}>
                            SERVICES
                        </Text>

                        <TouchableOpacity style={styles.serviceButtonStyle} onPress={() => { this.setState({ service: "Home Sitting" }) }}>
                            <Text style={this.state.service === "Home Sitting" ? styles.selectedText : styles.unselectedText}>
                                Home Sitting
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.serviceButtonStyle} onPress={() => { this.setState({ service: "Pet Boarding" }) }}>
                            <Text style={this.state.service === "Pet Boarding" ? styles.selectedText : styles.unselectedText} >
                                Pet Boarding
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.serviceButtonStyle} onPress={() => { this.setState({ service: "Home Visit" }) }}>
                            <Text style={this.state.service === "Home Visit" ? styles.selectedText : styles.unselectedText}>
                                Home Visit
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 6, justifyContent: "center", margin: 20 }}>
                        <TouchableOpacity style={styles.searchFrame} onPress={() => this.props.navigation.navigate("SearchSitterList",{
                            startData: this.state.startDate,
                            endDate: this.state.endDate,
                            service: this.state.service
                        }) }>
                            <Text style={styles.unselectedText}>
                                Search
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {this.state.show ? <DateTimePickerComponent mode={this.state.mode} submit={this.submit} /> : <Text></Text>}
            </ScrollView>
        )
    }
}

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
        width: 146,
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
        alignItems: "center"


    },
    buttonText: {
        width: 71,
        height: 20,
        // fontFamily: "SFPro",
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: "#d0c9d6"
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
    personProfilePhoto: {
        height: 50, width: 50, borderRadius: 25, backgroundColor: "grey", marginLeft: 8, marginRight: 8
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
        width: 60,
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
        // width: "80%",
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
    unselectedText: {
        color: "#1a051d"
    },
    selectedText: {
        color: "#f99558"
    },
    searchFrame: {
        width: "90%",
        height: 48,
        borderRadius: 6,
        backgroundColor: "#f99558",
        justifyContent: "center",
        alignItems: "center"
    }
})