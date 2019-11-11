import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image, Dimensions, TouchableOpacity
} from "react-native"

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebaseSvc from "../../FirebaseSvc";
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import { TouchableHighlight } from "react-native-gesture-handler";
import { database } from "firebase";

export default class PetSittingInstructionsController extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            index: 0,
            routes: [{key: 'first', title: 'Today'}, {key: 'second', title: 'Incoming'}],
            todaySession: [],
            incomingSession: []
        };
    }

    static navigationOptions =  ({navigation}) => ({
        title: "Pet Sitting",
        // headerRight: <Button title="Next" onPress={ () => {navigation.navigate("AddNewInstruction")} }>  </Button>
    })

    componentDidMount = async () => {
                    
        firebaseSvc.refPetSittingSessions().where("owner", "==", global.currentUser.id).onSnapshot(
              querySnapshot => {
                  querySnapshot.docChanges().forEach(async change =>{
                      if (change.type === 'added'){
                        const ownerResult = change.doc
                        const sessionID = ownerResult.id
                        const {startDate, endDate, owner, sitter, service, pet, additionalNotes} = ownerResult.data()
                        const sitterDoc = await firebaseSvc.querySpecificUser(sitter)
                        
                        const instructions = []

                        const newSession = {
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
                            additionalNotes,
                            loading: false  
                        }

                        // Here is a small bug but shall be fine
                        const dateNow = Date.now() 
                        if (newSession.startDate.getTime() < dateNow && dateNow < newSession.endDate.getTime()){
                            this.setState({todaySession: this.state.todaySession.concat([newSession])})  
                        }
                        else {
                            this.setState((prevState, props) => {
                                return { incomingSession: prevState.incomingSession.concat([newSession]) }
                            })
                        }

                        // Can I add a event listener here? 
                        const instructionsListener = firebaseSvc.refFirestoreSubCollectionInstruction(sessionID).onSnapshot(querySnapshot=>{
                            let stateInstructions = []
                            if (this.state.todaySession.length !== 0) {
                                stateInstructions = this.state.todaySession[0].instructions 
                            }

                            querySnapshot.docChanges().forEach( async change=>{
                                if (change.type=="added"){
                                    console.log("Instruction added")
                                    const doc = change.doc.id
                                    console.log(change.doc.id)

                                    const data = change.doc.data()
                                    stateInstructions.push({id: doc.id, 
                                        crucial: data.crucial,
                                        date: data.date,
                                        instruction: data.instruction, repeat: data.repeat, reminder: data.reminder})
                                }
                            })

                            this.setState(prevState => {
                                if (prevState.todaySession.length !== 0) {
                                    const prevTodaySession = prevState.todaySession[0]
                                    prevTodaySession.instructions = stateInstructions

                                    return { todaySession: [].concat([prevTodaySession]) }
                                }
                                return {}
                            })
                        }) 

                        // const {startDate, endDate, owner, sitter, service, pet, additionalNotes} = ownerResult.data()
                        // const snapshots = await firebaseSvc.queryInstructionsForOneSession(ownerResult.id)
                      }
                  })
              }
        )

        firebaseSvc.refPetSittingSessions().where("sitter", "==", global.currentUser.id).onSnapshot(
            querySnapshot => {
                querySnapshot.docChanges().forEach(async change =>{
                    if (change.type === 'added' || change.type==="modified"){
                        console.log("sitter")
                        console.log(change.doc.id)
                        const sitterResult = change.doc
                        const sessionID = sitterResult.id
                        const {startDate, endDate, owner, sitter, service, pet, additionalNotes} = sitterResult.data()
                        const instructions = []
                        const ownerDoc = await firebaseSvc.querySpecificUser(owner)

                        const newSession = {
                            sessionID,
                            startDate: new Date(startDate.seconds * 1000),
                            endDate: new Date(endDate.seconds * 1000),
                            sitter: {
                                id: global.currentUser.id,
                                name: global.currentUser.name
                            },
                            owner: ownerDoc.data(),
                            service,
                            petName: pet,
                            instructions,
                            additionalNotes,
                            loading: false  
                        }
                        // Here is a small bug but shall be fine
                        const dateNow = Date.now() 
                        if (newSession.startDate.getTime() < dateNow && dateNow < newSession.endDate.getTime()){
                            this.setState({todaySession: this.state.todaySession.concat([newSession])})  
                        }
                        else {
                            this.setState((prevState, props) => {
                                return { incomingSession: prevState.incomingSession.concat([newSession]) }
                            })
                        }

                        const instructionsListener = firebaseSvc.refFirestoreSubCollectionInstruction(sessionID).onSnapshot(querySnapshot=>{
                            let stateInstructions = []
                            if (this.state.todaySession.length !== 0) {
                                stateInstructions = this.state.todaySession[0].instructions 
                            }

                            querySnapshot.docChanges().forEach( async change=>{
                                if (change.type=="added"){
                                    console.log("Instruction added")
                                    const doc = change.doc.id
                                    console.log(change.doc.id)

                                    const data = change.doc.data()
                                    stateInstructions.push({id: doc.id, 
                                        crucial: data.crucial,
                                        date: data.date,
                                        instruction: data.instruction, repeat: data.repeat, reminder: data.reminder})
                                }
                            })

                            this.setState(prevState => {
                                if (prevState.todaySession.length !== 0) {
                                    const prevTodaySession = prevState.todaySession[0]
                                    prevTodaySession.instructions = stateInstructions

                                    return { todaySession: [].concat([prevTodaySession]) }
                                }
                                return {}
                            })
                        }) 

                    }
                })
            })
        }

    render(){
        return (
            <TabView
                navigationState={this.state}
                // renderScene={SceneMap({
                //     first: PetSittingInstructions,
                //     second: PetSittingInstructions,
                // })}
                renderScene={({route})=>{
                    switch (route.key) {
                        case 'first':
                          return <PetSittingInstructions navigation={this.props.navigation} todaySessionData={this.state.todaySession} />;
                        case 'second':
                        //   return <PetSittingInstructions navigation={this.props.navigation} todaySessionData={this.state.todaySession} />;
                        return <View></View>
                        default:
                          return null;
                      }
                } }

                onIndexChange={index => this.setState({index})}
                initialLayout={{width: Dimensions.get('window').width}}
                inactiveColor={"rgb(208,201,214)"}
                renderTabBar={props =>
                    <TabBar
                      {...props}
                    //   indicatorStyle={{ backgroundColor: '' }}
                    //   labelStyle={{color:"#000000"}}
                      inactiveColor={"rgb(208,201,214)"}
                      activeColor={colors.eggplantTwo}
                      indicatorStyle={{
                          backgroundColor: colors.pastelOrange}}
                      indicatorContainerStyle={{borderRadius: 200}}

                      style={{ backgroundColor: '#ffffff'}}
                    />
                  }
          />
        )
    }
}

const IndividualSessionCard = (props) =>{    

    const [wantReadMore, setWantReadMore] = React.useState(false)
    const sessionData = props.sessionData
    const [instructions, setInstructions] = React.useState(props.sessionData.instructions)
    const isOwner = global.currentUser.id === props.sessionData.owner.id

    const addANewInstruction = ({instruction, repeat, reminder, date}) => {
        const newObj = {
            instruction,
            repeat, 
            reminder,
            date
        }

        if (date === undefined){
            newObj.date = null
        }

        firebaseSvc.addNewInstructionToTheSession(props.sessionData.sessionID, newObj)
        // this.setState({
        //     instructions: [newObj].concat(this.state.instructions)
        // })
        setInstructions(props.sessionData.instructions.concat([newObj]))
    }

    return (
        <View style={styles.petSittingCard}>
        <View>                    
            <View style={{flexDirection: "row", alignItems: "center", marginRight: 12}} >
                {
                    isOwner ? 
                        <Text style={styles.petSittingTitle}>
                            {sessionData.sitter.name} pet sitting for you
                        </Text> :
                        <Text style={styles.petSittingTitle}>
                            Pet Sitting for {sessionData.owner.name}
                        </Text> 
                }

                <View style={styles.personProfilePhoto}>

                </View>

            </View>

            <View>
                <View style={{flexDirection: "row", alignItems:"center", marginBottom: 8}}>
                    <Icon name="pets" size={16}></Icon>
                    <Text style={styles.dogNameText}> {sessionData.petName} </Text>
                </View>

                <View style={{flexDirection: "row", alignItems:"center",marginBottom: 8}}>
                    <MaterialCommunityIcon name="calendar" size={16}></MaterialCommunityIcon>
                    <Text style={styles.dogNameText}> 
                    {/* `${this.state.startDate.getMonth() + 1}/${this.state.startDate.getDate()}/${this.state.startDate.getFullYear()} to  */}
                        {` End at ${sessionData.endDate.getMonth() + 1}/${sessionData.endDate.getDate()}/${sessionData.endDate.getFullYear()}`}
                    </Text>
                </View>

                <View style={{flexDirection: "row",alignItems:"center", marginBottom: 8}}>
                    <Icon name="info" size={16}></Icon>
                    <Text style={styles.dogNameText}> Drop-in visit </Text>
                </View>

                <View style={{flexDirection: "row", alignItems:"center", marginBottom: 8}}>
                    <Icon name="speaker-notes" size={16}></Icon>
                    
                    <TouchableOpacity disabled={sessionData.additionalNotes.length <= 35} onPress={()=>{ 
                            if (sessionData.additionalNotes.length > 35 && wantReadMore){
                                setWantReadMore(false)
                            }
                    }}>
                    <Text style={styles.dogNameText}> {sessionData.additionalNotes.length > 35 && !wantReadMore ? sessionData.additionalNotes.substring(0,35) + "..." : sessionData.additionalNotes} </Text>
                    </TouchableOpacity>
                    
                    {
                        sessionData.additionalNotes.length > 35 && !wantReadMore ? 
                        // alignItems:"center", justifyContent:"center"
                            <TouchableOpacity style={{height:18, position: "relative", backgroundColor:"transparent", justifyContent:"center", alignItems:"center", display:"flex"}} onPress={()=> setWantReadMore(true)}>
                                <Text style={styles.readMoreText}>
                                    More
                                </Text>
                            </TouchableOpacity>
                            : <View/>
                    }
                </View>
                
                <TouchableOpacity style={ [styles.addNewInstructionButton, {alignItems:"center", justifyContent:"center", marginBottom:15, marginTop:8} ] }>
                    <Text style={{fontSize:12, color: "#ffffff"}}>
                        Message
                    </Text>
                </TouchableOpacity>

            </View>
        </View>

        <View style={styles.divider}/>


        <View style={{marginVertical: 18, marginRight: 4}}> 

            <View style={{flexDirection:"row", alignItems:"center", marginBottom: 20, }}>
                <View>
                    <Text style={styles.instructionTitle}>
                        Care Instructions
                    </Text>
                </View>
                
                { isOwner ? 
                <TouchableOpacity onPress={() =>{props.navigation.navigate("AddNewInstruction", {addANewInstruction: addANewInstruction});}}
                    style={{backgroundColor:"transparent", position:"absolute", alignItems:'center', justifyContent:"center", right:0, height:24}}>
                    <Icon name={"add-circle-outline"} size={24} color={"#F99558"}>
                    </Icon>
                </TouchableOpacity> : <View/>
                }
            </View>

            {
                // There will always a dummy one
                instructions.length === 1 ?  
                    <Text>
                        "Your haven’t added any instructions You can add tasks and instructions and the pet sitter can view them from here."
                    </Text>
                        :
                instructions.map( (instruction, i) => {
                    if (instruction.instruction === "add a new instruction") return
                    
                    return (

                        <View style={{marginBottom: 8}}> 
                            <View style={{flexDirection: "row", alignItems: "flex-start"}} key={i}>   
                                {
                                    instruction.crucial ? 
                                        <Icon name={"warning"} size={16}/> 
                                        :
                                        <Icon name={"keyboard-arrow-right"} size={16}/> 
                                }

                                <Text style={styles.instructionTextLine}>
                                    {instruction.instruction}
                                </Text>
                            </View>

                            <View style={{flexDirection:"row", marginLeft: 24}}>
                                <View style={[styles.instructionTag, {flexDirection:"row", alignItems:"center"} ]} >
                                    <Icon name="repeat" size={16} color={colors.tagIconGrey}/>
                                    <Text style={styles.instructionTagText}>
                                        {instruction.repeat}
                                    </Text>
                                </View>
                                
                                {
                                instruction.reminder? 
                                <View style={[styles.instructionTag, {flexDirection:"row", alignItems:"center"}]}>
                                    <MaterialCommunityIcon name={"bell-outline"} size={16} color={colors.tagIconGrey}/>                                    
                                        <Text style={styles.instructionTagText}>
                                            Scheduled on {new Date(instruction.date.seconds*1000).toDateString()}
                                        </Text>
                                </View>
                                :
                                <View/>
                                }
                            </View>
                        </View>
                )
            }) }
        </View>
        {/* {
            isOwner ? 
            <TouchableOpacity style={styles.addNewInstructionButton} onPress = { () =>{props.navigation.navigate("AddNewInstruction", {addANewInstruction: this.addANewInstruction}); console.log(this.addANewInstruction)}}>
                <Icon name={"add"} size={14} color={"#fff"}>

                </Icon>
                <Text style={styles.addInstructionButtonText}>
                    Add instruction
                </Text>
            </TouchableOpacity>
            : 
            <View/>
        } */}
    </View>
    )
}

const IncomingPetSittingSessions = (props) => {
    
    // Load in data from the top 

}

class PetSittingInstructions extends React.Component {

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
            todaySessionData: props.todaySessionData
        }
    }
    
    static navigationOptions =  ({navigation}) => ({
        title: "Pet Sitting",
        // headerRight: <Button title="Next" onPress={ () => {navigation.navigate("AddNewInstruction")} }>  </Button>
    })

    componentDidMount = async () => {
                    
        // firebaseSvc.refPetSittingSessions().where("owner", "==", global.currentUser.id).onSnapshot(
        //       querySnapshot => {
        //           querySnapshot.docChanges().forEach(async change =>{
        //               if (change.type === 'added'){
        //                 const ownerResult = change.doc
        //                 console.log("owner")
        //                 console.log(change.doc.id)
        //                 const sessionID = ownerResult.id
        //                 const {startDate, endDate, owner, sitter, service, pet} = ownerResult.data()
        //                 const snapshots = await firebaseSvc.queryInstructionsForOneSession(ownerResult.id)
        //                 const instructions = []
        //                 snapshots.forEach( 
        //                     (doc) => {
        //                         const data = doc.data()
        //                         instructions.push({id: doc.id, instruction: data.instruction, repeat: data.repeat, reminder: data.reminder})
        //                     }
        //                 )
        //                 const sitterDoc = await firebaseSvc.querySpecificUser(sitter)
        //                 this.setState({
        //                     sessionID,
        //                     startDate: new Date(startDate.seconds * 1000),
        //                     endDate: new Date(endDate.seconds * 1000),
        //                     owner: {
        //                         id: owner,
        //                         name: global.currentUser.name
        //                     },
        //                     sitter: sitterDoc.data(),
        //                     service,
        //                     petName: pet,
        //                     instructions,
        //                     loading: false  
        //                 })  
        //               }
        //           })
        //       }
        // )

        // firebaseSvc.refPetSittingSessions().where("sitter", "==", global.currentUser.id).onSnapshot(
        //     querySnapshot => {
        //         querySnapshot.docChanges().forEach(async change =>{
        //             if (change.type === 'added' || change.type==="modified"){
        //                 console.log("sitter")
        //                 console.log(change.doc.id)
        //                 const sitterResult = change.doc
        //                 const sessionID = sitterResult.id
        //                 const {startDate, endDate, owner, sitter, service, pet} = sitterResult.data()
        //                 const snapshots = await firebaseSvc.queryInstructionsForOneSession(sitterResult.id)
        //                 const instructions = []
        //                 snapshots.forEach( 
        //                     (doc) => {
        //                         const data = doc.data()
        //                         instructions.push({id: doc.id, instruction: data.instruction, repeat: data.repeat, reminder: data.reminder})
        //                     }
        //                 )
            
        //                 const ownerDoc = await firebaseSvc.querySpecificUser(owner)
        //                 this.setState({
        //                     sessionID,
        //                     startDate: new Date(startDate.seconds * 1000),
        //                     endDate: new Date(endDate.seconds * 1000),
        //                     owner: ownerDoc.data(),
        //                     sitter:{
        //                         name: global.currentUser.name,
        //                         id: global.currentUser.id
        //                     },
        //                     service,
        //                     petName: pet,
        //                     instructions,
        //                     loading: false   
        //                 })
        //             }
        //         })
        //     })
        }

    componentDidUpdate( prevProps ){
        if (prevProps.todaySessionData !== this.props.todaySessionData) {
            this.setState({todaySessionData: this.props.todaySessionData})
            // console.log("||***** ***** *****||")
            console.log(this.props.todaySessionData)
        }
    }

    addANewInstruction = ({instruction, repeat, reminder, date}) => {
        const newObj = {
            instruction,
            repeat, 
            reminder,
            date
        }

        firebaseSvc.addNewInstructionToTheSession(props.sessionData.sessionID, newObj)
        this.setState({
            instructions: [newObj].concat(instructions,instructions)
        })
    }

    render = () => {
        const data = this.props.todaySessionData

        return (<ScrollView style={{padding: 12}}>
            {
                this.state.todaySessionData.length === 0 ?  <Text>
                    
                </Text>
                 : 
                <IndividualSessionCard 
                    sessionData={this.state.todaySessionData[0]} navigation={this.props.navigation} addANewInstruction={this.addANewInstruction} 
                />
            }
        </ScrollView>
        )
    }
}

const colors = {
    pastelOrange : "rgb(249,149,88)",
    eggplantTwo:"rgb(26,5,29)",
    cornflower:"rgb(112,105,238)",
    paleGrey: "rgb(250,250,251)",
    textGrey: "rgb(190,188,201)",
    tagIconGrey:"rgb(190,188,201)",
}

const styles = StyleSheet.create({
    petSittingCard : {
        // width: 349,
        // height: 420,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        // shadowColor: "rgba(0, 0, 0, 0.07)",
        // shadowOffset: {
        //   width: 0,
        //   height: 7
        // },
        // shadowRadius: 20,
        // shadowOpacity: 1,
        padding: 12
    },
    instructionTag: {
        // width: 88,
        marginRight:8,
        height: 22,
        borderRadius: 6,
        backgroundColor: colors.paleGrey,
        
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
        width: 79,
        height: 34,
        borderRadius: 6,
        backgroundColor: colors.pastelOrange
    }, 
    petSittingTitle: {
        // width: 150,
        // height: 14,
        // fontFamily: "SFProText",
        fontSize: 22,
        fontWeight: "600",
        fontStyle: "normal",
        // lineHeight: 28,
        letterSpacing: 0,
        color: colors.eggplantTwo,
        color: "#1a051d",
        justifyContent:"center",
        alignItems: "center",
        marginRight: 100,
        marginBottom: 12
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
        // height: 18,
        // fontFamily: "SFProText",
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: "#1a051d",
        position:"relative"
    }, 
    instructionTitle: { 
        position:"relative",
        // width: 87,
        // height: 18,
        // fontFamily: "SFProText",
        fontSize: 17,
        fontWeight: "600",
        // fontStyle: "normal",
        letterSpacing: 0,
        color: "#1a051d",
    },
    instructionText: {
        // width: 296,
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
        marginLeft: 8,
        marginBottom: 4,
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
    },
    messageButton : {
        width: 113,
        height: 40,
        borderRadius: 6,
        backgroundColor:colors.pastelOrange,
    },
    readMoreText: {
        // width: 32,
        // height: 13,
        // fontFamily: "SFProText",
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        // lineHeight: 13,
        letterSpacing: 0,
        color: colors.cornflower,
        position:"relative",
        // padding: 8
    }, 
    instructionTagText : {
        height: 13,
        // fontFamily: "SFProText",
        fontSize: 11,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#bebcc9"
    }

})