import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image
} from "react-native"
import firebaseSvc from '../FirebaseSvc';
import Icon from 'react-native-vector-icons/MaterialIcons';

function HeaderRight (props) {
    return (
    <React.Fragment>
        <View onClick={props.navigation.navigate('NewCommunityPost')} >
            <Icon name="add" size={24} style={{paddingRight:16}}/>
        </View>
    </React.Fragment>
        )

}

class CommunityFeed extends React.Component {

    static navigationOptions = {
        title: 'Feed',
        headerRight: <HeaderRight navigation={this.props.navigation}></HeaderRight>
    };

    render = () => {
        return <ScrollView style={{ flex: 1, flexDirection: "column" }}>
            <View style={styles.card}>
                <Image style={{height:150, resizeMode:"contain"}} source={require("./cute-pet.jpeg")}>
                </Image>
                <View style={{flex:1, flexDirection: "column"}}>
                    {/* Person and text */}
                    <View style={{flex: 1, flexDirection:"row", height: 70, alignItems:"center"}}>
                        <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor:"grey", marginLeft:8, marginRight:8}}/>
                        <Text>This pet is so cute!</Text>
                    </View>

                    <View style={{flex: 1, flexDirection:"row", alignItems:"center", height: 30}}>
                        <Icon name="favorite-border" size={24} style={{marginLeft: 16}} />
                        <Text style={{marginLeft: 4, marginRight: 8}}>Like </Text>
                        
                        <Icon name="question-answer" size={24} style={{marginLeft: 16}} />
                        <Text style={{marginHorizontal: 8}}>Comment</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text>Text </Text>
            </View>

            <View style={styles.card}>
                <Text>Text </Text>
            </View>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: "column",
        marginTop: 10,
        height: 250,
        width: "100%", 
        borderWidth: 1, 
        borderColor: "black"
    },
});

export default CommunityFeed