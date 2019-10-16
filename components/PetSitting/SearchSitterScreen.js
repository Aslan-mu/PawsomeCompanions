import React from "react"

import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image , Platform, FlatList, SectionList, TouchableHighlight
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
  recommendations: ["Outgoing", "Pet Lover", "Friendly"]
}

const JOSH = {
  name: "Josh",
  profileImage: "",
  recommendations: ["On time", "Careful", "Friendly"]
}

const KYLIE = {
  name: "Kylie",
  profileImage: "",
  recommendations: ["Outgoing", "Pet Lover", "Friendly"]
}

const LEO = {
  name: "Leo",
  profileImage: "",
  recommendations: ["Outgoing", "Pet Lover", "Friendly"]
}

const SARAH = {
  name:"Sarah",
  recommendations: [ "Knowledgable in pet sitting", "On time", "Good dog walker" ]
}

const ALEX = {
  name:"Alex",
  recommendations: [ "Knowledgable in pet sitting", "On time", "Good dog walker" ]
}

const PETSITTING_DATA = [ 
  { title: "Previous Pet Sitting", data: [BEN, JOSH] }, 
  { title: "Most Active Pet Sitting", data: [LEO,KYLIE] },
  {title: "Community Member", data: [SARAH, ALEX] } 
]

function NameTag ({name, deleteAName}) {
  return (
    <View style={{borderRadius: 4, marginVertical:4, marginLeft:4, paddingHorizontal:4, height: 30, backgroundColor:"rgba(0, 148, 255, 0.2)", flexDirection:"row", alignItems:"center"}}>
        <Text style={{fontSize:16}}> {name} </Text>
        
        <TouchableHighlight underlayColor="white" onPress={() => deleteAName(name) }>
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
      }else {
        // add from a list 
        addANewSitterCandidate(title)
      }
      console.log("Item clicked")
      setChecked(!checked)
    }

    React.useEffect( () =>{
      setChecked(sitterChecked)
    })

    return (
      <TouchableHighlight onPress={onChecked} underlayColor="white">
        <View style={styles.item}>
          <View style={styles.personProfilePhoto}></View>
          <Text style={styles.name}>{title}</Text>
          { checked? <Icon style={styles.checker} name={"done"} size={24}>  </Icon> : <View/>}
        </View>
      </TouchableHighlight>
    );
  }

function SearchBar(props) {

  const [sitterList, setSitterList] = React.useState(props.sitterList)

  React.useEffect( () =>{
    setSitterList(props.sitterList)
  } )

  return (
    <View style={{height: 44, padding:8, flexDirection:"row", flexWrap:"wrap", marginBottom: 24, marginTop: 8}}>
        <Text style={{color: "#c9c9c9", fontSize:24}}> To: </Text>
        
        { sitterList.map ( (n,i) => <NameTag name={n} key={n+i} deleteAName={props.deleteAName}></NameTag> )}
    </View>
  )
}

function Header({title}) {
  return (
    <Text style={styles.header}>{title}</Text>
  )
}



export default class SearchSitterList extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {sitterList:[]}
    }

    static navigationOptions = ({navigation}) => ({
        title: "Search",
        headerRight: (<Button title="Next"></Button>)
    })
    
    addANewSitterCandidate = (name) => {
      this.setState( {sitterList: this.state.sitterList.concat([name]) } )
    }

    deleteAName = (name) => {
      this.setState( {sitterList: this.state.sitterList.filter( s => s !== name) } )
    }

    render = ()=> {
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
                renderSectionHeader={({ section: { title } }) => <Header title={title}></Header> }
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
    backgroundColor: '#C9C9C9',
    padding: 8,
    marginVertical: 4,
    // marginHorizontal: 16,
    flex: 1,
    flexDirection:"row",
    alignItems:"center",
  },
  title: {
    fontSize: 32,
  },
  personProfilePhoto: { 
    height: 50, width: 50, borderRadius: 25, backgroundColor: "grey", marginLeft: 8, marginRight: 8 
  },
  header: {
    fontSize: 20,
    marginVertical: 8,
    paddingLeft: 8
  },
  checker: {
    marginLeft:100,
  },
  name: {
    marginLeft:16,
    fontSize:20,
    width: 100,
  }
});

