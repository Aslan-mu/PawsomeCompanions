import React from "react"

import {
  StyleSheet, Text,
  TextInput, View,
  Button, ImageEditor, ScrollView,
  Image, Platform, FlatList, SectionList, TouchableHighlight
} from "react-native"

import Icon from 'react-native-vector-icons/MaterialIcons';

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
  { title: "Previous Pet Sitting", data: [BEN, JOSH] },
  { title: "Most Active Pet Sitting", data: [LEO, KYLIE] },
  { title: "Community Member", data: [SARAH, ALEX] }
]

function NameTag({ name, deleteAName }) {
  return (
    <View style={{ borderRadius: 4, marginVertical: 4, marginLeft: 4, paddingHorizontal: 4, height: 30, backgroundColor: "rgba(0, 148, 255, 0.2)", flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontSize: 16 }}> {name} </Text>
      <TouchableHighlight underlayColor="white" onPress={() => deleteAName(name)}>
        <Icon name={"close"} size={16}></Icon>
      </TouchableHighlight>
      
    </View>
  )
}

function Item({ title, addANewSitterCandidate, deleteAName, sitterChecked }) {

  const [checked, setChecked] = React.useState(false)
  const onChecked = () => {
    if (checked) {
      // delete from a list 
      deleteAName(title)
    } else {
      // add from a list 
      addANewSitterCandidate(title)
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
        <View style={styles.personProfilePhoto}></View>
        <View>
            <Text style={styles.sitterName}>{title}</Text>
            <Text style={styles.peopleRecommended}>5 People Recommended</Text>
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
    <View style={{ height: 44, padding: 8, flexDirection: "row", flexWrap: "wrap", alignItems:"center", marginBottom: 4, marginTop: 8 }}>
      <Text style={styles.toLabel}> To: </Text>
      {sitterList.map((n, i) => <NameTag name={n} key={n + i} deleteAName={props.deleteAName}></NameTag>)}
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
    this.state = { sitterList: [] }
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Search",
    headerRight: (<Button title="Next"></Button>)
  })

  addANewSitterCandidate = (name) => {
    this.setState({ sitterList: this.state.sitterList.concat([name]) })
  }

  deleteAName = (name) => {
    this.setState({ sitterList: this.state.sitterList.filter(s => s !== name) })
  }

  render = () => {
    return (
      <View>
        {/* I cna have a search bar here*/}
        {/* Two micro-interaction methods */}
        <SearchBar sitterList={this.state.sitterList} deleteAName={this.deleteAName} ></SearchBar>
        <SectionList
          sections={PETSITTING_DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item title={item.name} addANewSitterCandidate={this.addANewSitterCandidate}
            deleteAName={this.deleteAName} sitterChecked={this.state.sitterList.includes(item.name)} />}
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
    margin: 20,
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
    width: 38,
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
    margin: 20
  }, 
  toLabel:{
    width: 101,
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

