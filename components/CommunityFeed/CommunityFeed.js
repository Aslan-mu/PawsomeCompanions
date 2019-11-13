import React, { useEffect, useState } from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView,
    Image, TouchableOpacity, SafeAreaView, Dimensions
} from "react-native"
import firebaseSvc from '../../FirebaseSvc';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, formatDistance, formatRelative, subDays, subMinutes } from 'date-fns'

const testImage = {uri:"data:image/jpeg;base64,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"}

const testImageLink = testImage.uri

function HeaderRight(props) {
    return (
        <React.Fragment>
            <Button style={{ backgroundColor: "red" }} title={""} onPress={() => { props.navigation.navigate("NewCommunityPost")}}
                icon={<Icon name="add" size={24} style={{ paddingRight: 16 }} />}>
            </Button>
        </React.Fragment>
    )
}

function CustomHeader(props) {
    return (
        <View style={{height: 70,flexDirection:"row", alignItems:"center", left: 0,padding: 12, backgroundColor: "rgb(250,250,251)"}}>
            <Text style={styles.title}>
                {/* Need to change this to the community */}
                {/* Midtown */}
                {global.currentUser.community}
            </Text>

            <TouchableOpacity onPress={ () =>{} } style={{position:"absolute", right:42}}>
                <Icon name={"person-add"} size={22} />
            </TouchableOpacity>

            <TouchableOpacity style={{position:"absolute", right:12}} onPress={()=>props.navigation.navigate("NewCommunityPost")}>
                <MaterialCommunityIcon name={"square-edit-outline"} size={22}/>
            </TouchableOpacity>
        </View>
    )
}

function IndividualPostCard(props) {

    useEffect( ()=>{

    })

    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)


    const data = props.postData
    const imageString = data.imageSourceText

    const doesCurrentUserLikePost = props.postData.usersWhoLike.includes(global.currentUser.id)

    const window = Dimensions.get('window')

    Image.getSize( data.imageSource, (width, height) =>{
        const aspectRatio = width/height 
        const fullWidthRatioHeight = (window.width - 32) / aspectRatio
        setImageHeight(fullWidthRatioHeight)
        setImageWidth(window.width-32)
    })


    return (
        <View style={styles.card}>
            <View style={{flexDirection: "row", alignItems: "center", height:60}}>
                <View style={styles.personProfilePhoto}  />
                <View>
                    <Text style={styles.postUserName}> {data.user} </Text>
                    <Text style={styles.time}> {
                        data.timestamp.seconds !== undefined ? calculateTimeDistance(new Date(data.timestamp.seconds * 1000)) : "placeholder"} ago </Text>
                </View>
                <Icon size={24} name="more-vert" style={{position:"absolute", right: 0}}></Icon>
            </View>
            
            <Image style={{height:imageHeight, width:imageWidth, resizeMode: "cover"}} source={{uri:data.imageSource}}>
            </Image>
            
            <View style={{paddingVertical: 4, flex: 1, flexDirection: "column" }}>
                {/* Person and text */}
                <View style={{ flex: 1, flexDirection: "row", height: 30, alignItems: "center" }}>
                    <Text>{data.text}</Text>
                </View>

                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", height: 30 }}>
                    <TouchableOpacity 
                        onPress={ doesCurrentUserLikePost? ()=>props.unLikeAction(global.currentUser.id ,props.postData) : ()=>props.likeAction(global.currentUser.id ,props.postData)}
                        style={{backgroundColor:"transparent", flexDirection:"row", alignItems:"center"}}>
                        { 
                            doesCurrentUserLikePost? <Icon name="favorite" size={24} /> : <Icon name="favorite-border" size={24} /> }
                        <Text style={{ marginLeft: 4, marginRight: 8 }}>Like {data.numberOfLike}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{backgroundColor:"transparent",  flexDirection:"row",  alignItems:"center"}}>
                        {/* <Icon name="question-answer" size={24} style={{ marginLeft: 16, }} /> */}
                        {/* <Text style={{ marginHorizontal:4 }}>Comment {data.numberOfComment}</Text> */}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        )
    }

    calculateTimeDistance = (postTime) => {
       return formatDistance(postTime, new Date())
    }

    uploadImage = async source => {
        console.log('got image to upload. uri:' + source.uri);
        try {
            const response = await fetch(source.uri);
            const blob = await response.blob();
            const ref = firebase.storage().ref('UserImage').child(global.currentUser.id);
            const task = ref.put(blob);
            
            return new Promise((resolve, reject) => {
                task.on('state_changed',(snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
                    /* noop but you can track the progress here */
                },reject /* this is where you would put an error callback! */,
                    () => resolve(task.snapshot.downloadURL)
                );
            });
        } catch (err) {
            console.log('uploadImage try/catch error: ' + err.message); 
        }
    }

class CommunityFeed extends React.Component {

    feedData = [{
        text: "This pet is so cute",
        imageSource: testImageLink,
        user: "Jordan",
        numberOfLike: 10,
        numberOfComment: 4,
        liked: false,
        commented: false,
        timestamp: 1571163581361,
        postCategory: "Pet pics", 
        usersWhoLike: ["d04fkhh2nVNPp62PYHEOM5cGv872"]
    },
    {
        text: "This pet is so cute",
        imageSource: testImageLink,
        user: "Sam",
        numberOfLike: 10,
        numberOfComment: 20,
        liked: false,
        commented: false,
        timestamp: 1571163581361,
        postCategory: "Event",
        usersWhoLike: ["d04fkhh2nVNPp62PYHEOM5cGv872"]
    }, {
        text: "This pet is so cute",
        imageSource: testImageLink,
        user: "Sam",
        numberOfLike: 10,
        numberOfComment: 20,
        liked: false, 
        commented: false,
        timestamp: 1571163581361,
        postCategory: "Pet sitting",
        usersWhoLike: ["d04fkhh2nVNPp62PYHEOM5cGv872"]
    }
]

    constructor(props){
        super(props)
        this.state={feedData: this.feedData, filterPosts: "All"}
        // this.state.name = global.currentUser.name;
        // this.state.id = global.currentUser.id;
        // this.state.email = global.currentUser.email;
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Feed',
        headerRight:
            <Button icon={<Icon name="add" size={15} color={"black"} style={{ paddingRight: 16 }} />} title={"Add"} onPress={() => { navigation.navigate("NewCommunityPost", {addNewPost:navigation.state.params.addNewPost}) }}
            />,
        headerTitle: () => <CustomHeader/>,
        headerStyle: {
            height: 60,
            marginLeft: 0
        },
        header: null
    })

    componentDidMount =() =>{
        this.props.navigation.setParams({addNewPost:this.addPost})
        firebaseSvc.refPostOn(this.parseSnapshot, this.modifiedSnapshot)
    } 

    navigateToNewPage = () => {
        this.props.navigation.navigate("NewCommunityPost")
    }

    addPost = (newPost) => {
        console.log("logging data")
        this.setState({feedData: [newPost].concat(this.state.feedData)})
    }

    modifiedSnapshot = (postData, postID) =>{
        // Find the existing data with the same postID
        firebaseSvc.refUser().doc(postData.owner).get().then(res => {
            const postOwner = res.data()
            const newData = {
                text : postData.text,
                timestamp: postData.timestamp,
                numberOfComment: postData.numberOfComment,
                numberOfLike: postData.usersWhoLike.length,
                imageSource: postData.image,
                // userID: postData.ownerID,
                user: postOwner.name,
                usersWhoLike: postData.usersWhoLike,
                postCategory: postData.postCategory,
                id: postID, 
            }
            const index = this.state.feedData.findIndex(p => p.id === postID)
            const filteredArray = this.state.feedData.filter(p=> p.id !== postID)
            filteredArray.splice(index, 0, newData)
            this.setState({feedData:filteredArray})
        })
    }

    parseSnapshot = (postData, postID) => {
        // console.log(postData.ownerID)
        // text: "This pet is so cute",
        // imageSource: testImage,
        // user: "Sam",
        // numberOfLike: 10,
        // numberOfComment: 20,
        // liked: false,
        // commented: false,
        // timestamp: 1571163581361
        firebaseSvc.refUser().doc(postData.owner).get().then(res => {
            const postOwner = res.data()
            const newData = {
                text : postData.text,
                timestamp: postData.timestamp,
                numberOfComment: postData.numberOfComment,
                numberOfLike: postData.usersWhoLike.length,
                // imageSource: postData.image,
                imageSource: testImageLink,
                // userID: postData.ownerID,
                user: postOwner.name,
                usersWhoLike: postData.usersWhoLike,
                postCategory: postData.postCategory,
                id: postID,
                avator: null,
            }
            this.setState({ feedData: [newData].concat(this.state.feedData)})            
            console.log(res.data().name)})
    }

    render = () => {
        return (
            <SafeAreaView style={{height: "100%", backgroundColor: "#fafafa"}}>
            
            <CustomHeader navigation={this.props.navigation}>

            </CustomHeader>

            {/* First log in need some work */}

            <View style={{flexDirection: "row", marginLeft: 8, marginVertical: 8}}>
            <TouchableOpacity style={this.state.filterPosts !== "All" ? styles.categoryButton : styles.selectedCategoryButton} onPress={() => this.setState({filterPosts: "All"})}>
                  <Text style={this.state.filterPosts !== "All" ? styles.categoryButtonText : styles.selectedCategoryButtonText}>
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.filterPosts !== "Pet pics" ? styles.categoryButton : styles.selectedCategoryButton} onPress={() => this.setState({filterPosts: "Pet pics"})}>
                    <Text style={this.state.filterPosts !== "Pet pics" ? styles.categoryButtonText : 
                    styles.selectedCategoryButtonText}>
                        Pet pics
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={this.state.filterPosts !== "Pet sitting" ? styles.categoryButton : styles.selectedCategoryButton} onPress={() => this.setState({filterPosts: "Pet sitting"})}>
                    <Text style={this.state.filterPosts !== "Pet sitting" ? styles.categoryButtonText : 
                    styles.selectedCategoryButtonText}>
                        Pet sitting
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={this.state.filterPosts !== "Lost pet" ? styles.categoryButton: styles.selectedCategoryButton} onPress={() => this.setState({filterPosts: "Lost pet"})}>
                    <Text style={this.state.filterPosts !== "Lost pet" ? styles.categoryButtonText : 
                    styles.selectedCategoryButtonText}>
                        Lost pet
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={this.state.filterPosts !== "Event" ? styles.categoryButton : styles.selectedCategoryButton} onPress={() =>this.setState({filterPosts: "Event"})}>
                    <Text style={this.state.filterPosts !== "Event" ? styles.categoryButtonText : 
                    styles.selectedCategoryButtonText}>
                        Event
                    </Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView style={{ flex: 1, flexDirection: "column", backgroundColor:"#fafafa" }}>
                {this.state.filterPosts === "All" ? 
                    this.state.feedData.map( (d,i) => <IndividualPostCard unLikeAction={this.userUnlikeOnePost} likeAction={this.userLikeOnePost} postData={d} key={i}></IndividualPostCard>)
                    : 
                    this.state.feedData.filter(d => d.postCategory === this.state.filterPosts).map((d,i) => <IndividualPostCard postData={d} unLikeAction={this.userUnlikeOnePost} likeAction={this.userLikeOnePost} key={i}></IndividualPostCard>)
                }
            </ScrollView>
            </SafeAreaView>
        )
    }

    userLikeOnePost = (userID, postData) =>{
        // call the backend to update the postID.
        // then add itself to the number like to the data itself
        const newUsersWhoLike = postData.usersWhoLike.concat([userID])
        firebaseSvc.updateUsersWhoLike(newUsersWhoLike, postData.id)
    }

    userUnlikeOnePost = (userID, postData) => {
        const newUsersWhoLike = postData.usersWhoLike.filter(u => u !== userID)
        firebaseSvc.updateUsersWhoLike(newUsersWhoLike, postData.id)
    }
}

const colors = {
    eggplantTwo: "rgb(26,5,29)"
}

const styles = StyleSheet.create({
    card: {
        // paddingVertical: 10,
        paddingHorizontal: 16,
        flex: 1,
        flexDirection: "column",
        marginBottom: 10,
        width: "100%",
        // height: 306,
        backgroundColor: "#ffffff",
        shadowColor: "#ededed",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 1
    },
    personProfilePhoto: { 
        height: 32, width: 32, borderRadius: 16, backgroundColor: "grey", marginRight: 8 
    },
    postUserName:{
        height: 20,
        // fontFamily: "SFProText",
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d"
    }, 
    time: {
        // width: 39,
        height: 12,
        // fontFamily: "SFProDisplay",
        fontSize: 10,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8d8d8d"
    },
    categoryButton:{
        width: 68,
        height: 24,
        borderRadius: 4,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#62717a",
        marginRight: 8,
        justifyContent: "center",
        alignContent:"center"
      },
      selectedCategoryButton:{
        width: 68,
        height: 24,
        borderRadius: 4,
        backgroundColor: "rgb(97,94,116)",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#62717a",
        marginRight: 8,
        justifyContent: "center",
        alignContent:"center"
      },
      categoryButtonText: {
        height: 13,
        // fontFamily: "SFProText",
        fontSize: 11,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 13,
        letterSpacing: 0,
        textAlign: "center",
        color: "#62717a"
      }, 
      selectedCategoryButtonText: {
        height: 13,
        // fontFamily: "SFProText",
        fontSize: 11,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 13,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
      },
      title : {
        // width: 85,
        // height: 28,
        // fontFamily: "SFProDisplay",
        fontSize: 22,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 28,
        letterSpacing: 0,
        color: colors.eggplantTwo
      }
});

export default CommunityFeed