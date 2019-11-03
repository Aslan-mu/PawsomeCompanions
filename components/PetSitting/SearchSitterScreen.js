import React from "react"

import {
  StyleSheet, Text,
  TextInput, View,
  Button, ImageEditor, ScrollView,
  Image, Platform, FlatList, SectionList, TouchableHighlight
} from "react-native"

import Icon from 'react-native-vector-icons/MaterialIcons';
import firebaseSvc from "../../FirebaseSvc";
import UserProfilePage from "./UserProfilePage"

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

// One way is to think how to convince people that availability is not an issue


const BEN = {
  name: "Ben",
  profileImage: "",
  recommendations: ["Outgoing", "Pet Lover", "Friendly"],
  numOfRecommendations: 3
}

const JOSH = {
  name: "Josh",
  profileImage: "",
  recommendations: ["On time", "Careful", "Friendly"],
  numOfRecommendations: 3
}

const KYLIE = {
  name: "Kylie",
  profileImage: "",
  recommendations: ["Outgoing", "Pet Lover", "Friendly"],
  numOfRecommendations: 3
}

const LEO = {
  name: "Leo",
  profileImage: "",
  recommendations: ["Outgoing", "Pet Lover", "Friendly"],
  numOfRecommendations: 3
}

const SARAH = {
  name: "Sarah",
  recommendations: ["Knowledgable in pet sitting", "On time", "Good dog walker"],
  numOfRecommendations: 3
}

const ALEX = {
  name: "Alex",
  recommendations: ["Knowledgable in pet sitting", "On time", "Good dog walker"],
  numOfRecommendations: 3
}

const PETSITTING_DATA = [
  { title: "Search Result", data: [] },
  // { title: "Most Active Pet Sitting", data: [LEO, KYLIE] },
  // { title: "Community Member", data: [SARAH, ALEX] }
]

function NameTag({ name, deleteAName, id }) {
  return (
    <View style={{ borderRadius: 4, marginVertical: 4, marginHorizontal:4, paddingHorizontal: 4, height: 30, backgroundColor: "#a59af5", flexDirection: "row", alignItems: "center", }}>
      <Text style={{ fontSize: 16, color:"#ffffff"}}> {name} </Text>
      <TouchableHighlight underlayColor= "#a59af5" onPress={() => deleteAName(name, id)}>
        <Icon name={"close"} size={16} color="#ffffff"></Icon>
      </TouchableHighlight>
    </View>
  )
}

function Item({ title, addANewSitterCandidate, deleteAName, sitterChecked, numOfRecommendations, item, navigation }) {

  const [checked, setChecked] = React.useState(false)
  const onChecked = () => {
    if (checked) {
      // delete from a list 
      deleteAName(item.name, item.userID)
    } else {
      // add from a list 
      addANewSitterCandidate(item.name, item.userID)
    }
    console.log("Item clicked")
    setChecked(!checked)
  }

  React.useEffect(() => {
    setChecked(sitterChecked)
  })
  return (
    <TouchableHighlight onPress={onChecked} underlayColor="white">
      <View style={styles.item}>
        <TouchableHighlight onPress={ ()=> navigation.navigate("UserProfilePage", {userData: item})} >
          <View style={styles.personProfilePhoto}></View>
        </TouchableHighlight>
        <View>
            <Text style={styles.sitterName}>{item.name}</Text>
            <Text style={styles.peopleRecommended}>{item.numOfRecommendations} People Recommended</Text>
        </View>
        
        <View style={{marginLeft:30}}>
            <Text style={styles.miAway}>
              Midtown West
            </Text>

            <Text style={styles.miAway}>
              0.5 Mile
            </Text>
        </View>

        {checked ? <Icon style={styles.checker} name={"done"} size={24}>  </Icon> : <View />}
      </View>
    </TouchableHighlight>
  );
}

function SearchBar(props) {

  const [sitterList, setSitterList] = React.useState(props.sitterList)

  React.useEffect(() => {
    setSitterList(props.sitterList)
  })

  return ( 
    <View style={{ height: 50, flexDirection: "row", paddingHorizontal:12, alignItems:"center", marginBottom: 4, marginTop: 8 }}>
      <Text style={styles.toLabel}> Selected: </Text>
      <ScrollView directionalLockEnabled horizontal>
        {sitterList.map((s, i) => {
          console.log(s)
          return (<NameTag name={s.name} id={s.id} key={s.id + i} deleteAName={props.deleteAName}></NameTag>)
          }
        )}
      </ScrollView>
    </View>
  )
}

function Header({ title }) {
  return (
    <Text style={styles.sectionHeader}>{title}</Text>
  )
}



export default class SearchSitterList extends React.Component {

  constructor(props) {
    super(props)
    const passedInData = props.navigation.state.params
    console.log("passed in data")
    // console.log(props.navigation.state)
    this.state = { 
      sitterList: [], 
      requestData:{
        startDate: props.navigation.getParam("startDate", "default"),
        endDate: passedInData.endDate,
        additionalNotes: passedInData.additionalNotes,
        service: passedInData.service
      }, 
      petSittingData: PETSITTING_DATA
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Search",
    headerRight: (<Button title="Send" onPress={() => {navigation.state.params.handleSave(); navigation.navigate("RequestSentConfirmation")}}></Button>)
  })
  
  addANewSitterCandidate = (name, id) => {
    // The problem now is that I need to link the id with the name
    this.setState({ sitterList: this.state.sitterList.concat([{name, id}]) })
    console.log("add sitter list")
    console.log(this.state.sitterList)
  }

  deleteAName = (name, id) => {
    this.setState({ sitterList: this.state.sitterList.filter(u => u.id !== id) })
  }

  componentDidMount = () => {
    const navigation= this.props.navigation 

    this.props.navigation.setParams({
      handleSave: () => {  
        this.state.sitterList.forEach( sitter=>
            firebaseSvc.addNewRequest({...this.state.requestData, sitter: sitter.id})
        )
      }
    })

    firebaseSvc.getAllUserData((snapshot) =>{
        let incomingUserData = []
        let count = 0
        snapshot.forEach(doc => {
          const userData = doc.data()
          const id = doc.id
          incomingUserData.push({
            name: userData.name,
            image: userData.image,
            numOfRecommendations:userData.numOfRecommendations,
            community: "",
            livingDistance: "",
            userID: id
          })
        })

        incomingUserData.sort( d => -1 * d.numOfRecommendations )
        // console.log(incomingUserData[0].numOfRecommendations)
        this.setState({petSittingData: [{ title: "Search Result", data: incomingUserData}]})
    })
}
  render = () => {

    return (
      <View>
        {/* I cna have a search bar here*/}
        {/* Two micro-interaction methods */}
        <SearchBar sitterList={this.state.sitterList} deleteAName={this.deleteAName} ></SearchBar>
        <SectionList
          sections={this.state.petSittingData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item item={item} title={item.name} numOfRecommendations={item.numOfRecommendations} addANewSitterCandidate={this.addANewSitterCandidate}
            deleteAName={this.deleteAName} sitterChecked={this.state.sitterList.map(s => s.id).includes(item.userID)} navigation={this.props.navigation} />}
          renderSectionHeader={({ section: { title } }) => <Header title={title}></Header>}
        >
        </SectionList>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  item: {
    marginHorizontal: 20,
    // width: 355,
    height: 79,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.07)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    // backgroundColor: '#C9C9C9',
    padding: 8,
    marginVertical: 4,
    // marginHorizontal: 16,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
  },
  personProfilePhoto: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "grey",
    marginLeft: 8,
    marginRight: 8
  },
  header: {
    fontSize: 20,
    marginVertical: 8,
    paddingLeft: 8
  },
  checker: {
    marginLeft: 100,
  },
  name: {
    marginLeft: 16,
    fontSize: 20,
    width: 100,
  }, 
  petSitterCard : {
    width: 355,
    height: 79,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.07)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 10,
    shadowOpacity: 1
  }, 
  sitterName : {
    // width: 38,
    height: 22,
    // fontFamily: "SFProText",
    fontSize: 17,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#1a051d"
  }, 
  peopleRecommended : {
    width: 141,
    height: 16,
    // fontFamily: "SFProText",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 16,
    letterSpacing: 0,
    color: "#1a051d"
  }, 
  miAway : {
    // width: 67,
    height: 14,
    // fontFamily: "SFProText",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "right",
    color: "#1a051d"
  }, 
  sectionHeader: {
    width: 253,
    height: 20,
    // fontFamily: "SFProText",
    fontSize: 15,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    color: "#1a051d",
    margin: 20,
    backgroundColor:"#ffffff"
  }, 
  toLabel:{
    position:"relative",
    // width: 101,
    height: 20,
    // fontFamily: "SFProText",
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    color: "#d0c9d6"
  }
});

