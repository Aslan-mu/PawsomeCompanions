import React from "react"

import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image , Platform, FlatList
} from "react-native"

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
  

function Item({ title }) {
    return (
      <View style={styles.item}>
        <View style={styles.personProfilePhoto}></View>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }


export default class SearchSitterList extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {}
    }

    static navigationOptions = ({navigation}) => ({
        title: "Search",
        headerRight: (<Button title="Next"></Button>)
    })

    render = ()=> {
        return (
          <View>
            {/* I cna have a search bar here*/}
            {/* Two micro-interaction methods */}
            <FlatList data={DATA}
                renderItem={({ item }) => <Item title={item.title} />}> 
                keyExtractor={item => item.id}
            </FlatList>
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
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flex: 1,
    flexDirection:"row",
    
  },
  title: {
    fontSize: 32,
  },
  personProfilePhoto: { 
    height: 50, width: 50, borderRadius: 25, backgroundColor: "grey", marginLeft: 8, marginRight: 8 
  }
});

