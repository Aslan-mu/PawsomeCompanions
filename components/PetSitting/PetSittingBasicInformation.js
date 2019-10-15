import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image , Platform
} from "react-native"

import DateTimePicker from '@react-native-community/datetimepicker';


function DateTimePickerComponent (props) {
    // Need to set the data. so it will pass in a set time function, which accepts two different 
    const [date, setDate] = React.useState(new Date(Date.now()))
    const mode = props.mode
    const [show, setShow] = React.useState(props.show) 
    const submit = props.submit
    // const effect = React.useEffect(()=>{
    //     date = new Date("2018-09-30T11:00:00")
    //     setShow(props.show)   
    // })

    onDateChange = (event,newDate) => {
        newDate = newDate || date;

        setDate(newDate)
    }

    return (
        <View style={{flex:1}}>
            {/* The button is used for submit */}
            <Button title="Submit" onPress={ ()=>{submit(date)}}></Button> 
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
    
    constructor(props){
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

    static navigationOptions = ({navigation}) => ( {
        title: "New Search",
        headerRight: <Button title="Next" onPress={() =>{navigation.navigate("SearchSitterList")}}></Button>
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
        console.log(    date)
        this.setState({show: false, startDate: date})
    }

    submitForEndDate = (date) => {
        this.setState({show: false, endDate: date})
    }

    datePickerForStartDate = () =>{``
        this.submit = this.submitForStartDate
        this.datepicker()   
    }

    datePickerForEndDate = () =>{``
        this.submit = this.submitForEndDate
        this.datepicker()   
    }

    timepicker = () => {
        this.show('time');
    }

    datepicker = () => {
        this.show('date');
    }

    submit = (date) =>{
        this.setState({show: false, endDate: date})
    }

    homeSittingButtonPress = () => {

    }

    render(){
        // const {show, date, mode} = this.state
        return(
            <ScrollView>
            <View style={{flex:1, height:500, flexDirection:"column"}}>
                <View style={{flex:2, flexDirection:"row", alignItems:"center"}}>
                    <Text style={style.leftLabel}>
                        Start Date
                    </Text>

                    <View style={{position: "relative",right: 0}}>
                        <Button title={this.state.startDate === undefined ? "Select Date": `${this.state.startDate.getMonth()}/${this.state.startDate.getDate()}/${this.state.startDate.getFullYear()}`}
                            color={"red"}  onPress={this.datePickerForStartDate}>
                        </Button>
                    </View>
                </View>

                <View style={{flex:3, flexDirection:"row",alignItems:"center", height: 20}}>
                    <Text style={style.leftLabel}>
                        End Date
                    </Text>
                    
                        <Button title={this.state.endDate === undefined ? "Select Date": `${this.state.endDate.getMonth()}/${this.state.endDate.getDate()}/${this.state.endDate.getFullYear()}` }
                         onPress={this.datePickerForEndDate} color={"red"} style={{}}>
                        
                        </Button> 
                </View>

                <View style={{flex:4, flexDirection:"row", alignItems:"center", height: 20}}>
                    <Text style={style.leftLabel}>
                        Pet
                    </Text>

                    <Button title="Should be the pet profile" color={"red"}>
                        
                    </Button>
                </View>

                <View style={{flex: 5, flexDirection:"column"}}>
                    <Text>
                        Service
                    </Text>

                    <Button title="Home Sitting" onPress={()=>{this.setState({service: "Home Sitting"})}} color={ this.state.service !== "Home Sitting"? "red" : "blue" } style={style.serviceSelected}>
                        
                    </Button>

                    <Button title="Pet Onboarding" onPress={()=>{this.setState({service: "Pet Onboarding"})}} color={ this.state.service !== "Pet Onboarding"? "red" : "blue" } style={style.serviceSelected}>
                        
                    </Button>

                    <Button title="Home Visit" onPress={()=>this.setState({service: "Home Visit"})} color={ this.state.service !== "Home Visit"? "red" : "blue" } style={style.serviceSelected}>
                    
                    </Button>
                </View>
                
                {this.state.show ? <DateTimePickerComponent mode={this.state.mode} submit={this.submit}/> : <Text></Text> }
                
            </View>
            </ScrollView>
        )   
    }
}

const style = StyleSheet.create({
    leftLabel: {
        width: 200, 
        marginRight:0,
        fontSize:24
    },

    serviceSelected : {
        // color: "#fff",
        paddingLeft:70
    },
    serviceUnSelected : {
        color:"blue",
        paddingLeft:70
    }
})