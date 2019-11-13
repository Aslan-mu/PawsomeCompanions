import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image, Dimensions, TouchableOpacity, SafeAreaView,
    ListView, SectionList, 
} from "react-native"

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebaseSvc from "../../FirebaseSvc";
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import { TouchableHighlight } from "react-native-gesture-handler";
// import console = require("console");


const ListItem = ({title, navigation}) => {
    console.log(title)
    return (
    <View>
        <TouchableOpacity style={{backgroundColor:"transparent"}} onPress={()=>{
            navigation.state.params.setInstruction(title);
            navigation.goBack();
        }}>
            <Text style={styles.instructionBodyText}>
                {title}
            </Text>
        </TouchableOpacity>
    </View>)

}

const Header = ({section}) =>{
    console.log(section)
    return (
        <View>
            <Text style={styles.sectionHeader}>
            {section.title}
        </Text>

        <View style={styles.divider}/>
    </View>)
}

export default class SavedInstructions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            savedInstructions: [
                {
                    data:[
                        "Feed Griffey after walk. Get one container of food filled to the red line.",
                        "Make sure there is always water in the bowl."
                    ], 
                    title: "Feeding",
                    key: "Feeding"
                },
                {
                    data:[
                        "Griffey gets a treat after you walk him. I usually give him a Milk Bone."
                    ], 
                    title: "Habits",
                    key: "Habits"
                },
                {
                    data:[
                        "Let Griffey out in the morning. I usually walk him around the block."
                    ],
                    title: "Activity",
                    key:"Activity"
                },
                {
                    data:[
                        ""
                    ],
                    title: "Uncategorized",
                    key:"Uncategorized"
                }
            ]
        }
    }

    componentDidMount(){
        firebaseSvc.refSavedInstructionsForSpecificUser(global.currentUser.id).get().then(snapshot =>
            snapshot.forEach(doc =>{
                const data = doc.data()
                const savedInstructions = [
                    {
                        data: data.feeding, 
                        title: "Feeding",
                        key: "Feeding"
                    },
                    {
                        data: data.habits, 
                        title: "Habits",
                        key: "Habits"
                    },
                    {
                        data:data.activity,
                        title: "Activity",
                        key:"Activity"
                    },
                    {
                        data:data.uncategorized,
                        title: "Uncategorized",
                        key:"Uncategorized"
                    }
                ]
                this.setState({savedInstructions})
            })
        )
    }

    static navigationOptions = ({navigation}) => ({
        title: "Saved Instructions",
        headerRight: <Button title={"Edit"}> </Button>
    })

    render = () => {

        return (
        <SafeAreaView>
            <View style={{padding: 12}}>
                <Text>
                    Saved instructions for your pet sitters.
                </Text>
            </View>
            {/* <ScrollView style={{padding: 12}}> */}
            <SectionList 
                style={{padding: 12}}
                renderItem={({item}) => <ListItem title={item} navigation={this.props.navigation}/>}
                renderSectionHeader={({section}) => <Header section={section}/>}
                sections={this.state.savedInstructions}
            />
            
            {/* </ScrollView> */}
        </SafeAreaView>
        )
    }
}

const colors = {
    eggplantTwo: "rgb(26,5,29)",
    paleLilac:"rgb(224,221,234)"

}

const styles= StyleSheet.create({
    sectionHeader: {
        // width: 67,
        height: 22,
        // fontFamily: "SFProText",
        fontSize: 17,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        color: colors.eggplantTwo,
        marginTop: 24
    },
    instructionBodyText: {
        // width: 333,
        height: 40,
        // fontFamily: "SFProText",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: colors.eggplantTwo,
        marginBottom:8
    }, 
    divider:{
        marginTop:8,
        // width: 343,
        height: 1,
        backgroundColor: colors.paleLilac,
        marginBottom: 8
    }
})