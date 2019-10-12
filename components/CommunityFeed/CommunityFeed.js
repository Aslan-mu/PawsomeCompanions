import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView,
    Image
} from "react-native"
import firebaseSvc from '../../FirebaseSvc';
import Icon from 'react-native-vector-icons/MaterialIcons';


function HeaderRight(props) {
    return (
        <React.Fragment>
            <Button style={{ backgroundColor: "red" }} title={""} onPress={() => { props.navigation.navigate("NewCommunityPost")}}
                icon={<Icon name="add" size={24} style={{ paddingRight: 16 }} />}>
            </Button>
        </React.Fragment>
    )
}

function IndividualPostCard(props) {

    const data = props.postData
    const imageString = data.imageSourceText
    return (
        <View style={styles.card} >
            <Image style={{ height: 150, resizeMode: "contain" }} source={data.imageSource}>
            </Image>
            <View style={{ flex: 1, flexDirection: "column" }}>
                {/* Person and text */}
                <View style={{ flex: 1, flexDirection: "row", height: 70, alignItems: "center" }}>
                    <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: "grey", marginLeft: 8, marginRight: 8 }} />
                    <Text>{data.text}</Text>
                </View>

                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", height: 30 }}>
                    <Icon name="favorite-border" size={24} style={{ marginLeft: 16 }} />
                    <Text style={{ marginLeft: 4, marginRight: 8 }}>Like {data.likeNumber}</Text>

                    <Icon name="question-answer" size={24} style={{ marginLeft: 16 }} />
                    <Text style={{ marginHorizontal: 8 }}>Comment {data.commentNumber}</Text>
                </View>
            </View>
        </View>
    )
}


class CommunityFeed extends React.Component {

    feedData = [{
        text: "This pet is so cute",
        imageSource: require("./cute-pet.jpeg"),
        user: "",
        likeNumber: 10,
        commentNumber: 4,
        liked: false,
        commented: false
    }, {
        text: "This pet is so cute",
        imageSource: require("./cute-pet.jpeg"),
        user: "",
        likeNumber: 10,
        commentNumber: 20,
        liked: false,
        commented: false
    }, {
        text: "This pet is so cute",
        imageSource: require("./cute-pet.jpeg"),
        user: "",
        likeNumber: 10,
        commentNumber: 20,
        liked: false,
        commented: false
    }]

    constructor(props){
        super(props)
        this.state={feedData: this.feedData}
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Feed',
        headerRight:
            <Button icon={<Icon name="add" size={15} color={"black"} style={{ paddingRight: 16 }} />} title={"Add"} onPress={() => { navigation.navigate("NewCommunityPost"), {addNewPost:this.addPost} }}
            />
        // headerRight: <Button title="b" onPress={ ()=> navigation.navigate("NewCommunityPost")}></Button>
    })

    navigateToNewPage = () => {
        this.props.navigation.navigate("NewCommunityPost")
    }

    addPost = (newPost) => {
        this.setState({feedData: this.state.feedData.concat([newPost])})
    }

    render = () => {
        return <ScrollView style={{ flex: 1, flexDirection: "column" }}>
            {this.state.feedData.map( (d,i) => <IndividualPostCard postData={d} key={i}></IndividualPostCard> )}
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