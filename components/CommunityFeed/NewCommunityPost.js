import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image, TouchableOpacity
} from "react-native"

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebaseSvc from '../../FirebaseSvc';
import firebase from 'firebase';

const options = {
    title: 'Select Post',
    customButtons: [{ name: 'Pawesome', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
  

class NewCommunityPost extends React.Component {

    constructor(props){
        super(props)
        this.state={text:"", imageSource:"", posterCategory: ""}
    }

    componentDidMount = () => {
        console.log(this.props.navigation.state)
        const navigation= this.props.navigation 
        this.props.navigation.setParams({handleSave: async () => 
        {    

            const newText = this.state.text
            const imageSource = this.state.imageSource
            const petCategory = this.state.petCategory
            const uploadNewPostAndNavigate = () => {
                firebase.storage().ref('PostImage').child(this.state.imageID).getDownloadURL().then(function(url) {
                    // update service with post id
                    console.log("callback + 1")
                    console.log("New post")
                    console.log(url)
                    console.log(navigation)
                    console.log("After this.props")
                    const newPost = {   
                        text: newText,
                        imageSource,
                        numberOfLike: 0,
                        numberOfComment: 0,
                        owner:global.currentUser.id,
                        image: url,
                        petCategory
                    }
                    firebaseSvc.setNewPost(newPost)
                }).catch(function(error) {
                // A full list of error codes is available at
                    console.log(error)
                    switch (error.code) {
                        
                    }
                });    
            }
            await this.uploadImage(this.state.uriSource, this.state.imageID, uploadNewPostAndNavigate)
        }})
    }

    onChangeText = (text) =>{
        this.setState({text})
    }

    printState = () =>{console.log(this.state)}

    static navigationOptions = ({navigation}) => ({
        title: 'New Community Post',
        headerRight: <Button title="Post" onPress={ () =>{navigation.state.params.handleSave(); navigation.navigate("Feed") }}/>
    });

    pickImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {          
              // You can also display the image using data:
              const source = { uri: 'data:image/jpeg;base64,' + response.data };
              const uriSource = {uri: response.uri}
              const imageID = Math.random().toString(12);
              this.setState({
                imageSource: source,
                uriSource,
                imageID
               });
            }
          });
    }


    render(){
        return (
        <View style={{padding:12}}>
            <TextInput style={styles.posterSubject}>
              Welcome to the community!
            </TextInput>

            <TextInput 
                multiline            
                style={styles.postContent}
                onChangeText={text => this.onChangeText(text)}
                value={this.state.text}
                placeholder="This is the placeholder"
                />
            <Image source={this.state.imageSource} style={{width:100, height:100}}/>
            <View style={{height: 1, width: "100%", backgroundColor:"#C9C9C9", marginBottom: 10}}>
            </View>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon name="camera-alt" size={24} style={{marginRight:30}}></Icon>
                <Button title="Add photo / video" color={"black"} onPress={ this.pickImage }/>
            </View> 
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon name="local-offer" size={24} style={{marginRight:30}}></Icon>
                <Button title="Tag People" color={"black"} onPress={ this.pickImage }/>
            </View> 
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon name="camera-alt" size={24} style={{marginRight:30}}></Icon>
                <View style={{justifyContent: "flex-start", alignItems:"flex-start"}}>
                    <Button title="Topic Category" color={"black"}/>
                    <View style={{flexDirection: "row", marginLeft: 8}}>
                        <TouchableOpacity style={styles.categoryButton} onPress={() => this.setState({posterCategory: "Pet pics"})}>
                            <Text style={this.state.posterCategory !== "Pet pics" ? styles.categoryButtonText : styles.selectedCategoryButtonText}>
                                Pet pics
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryButton} onPress={() => this.setState({posterCategory: "Pet sitting"})}>
                            <Text style={this.state.posterCategory !== "Pet sitting" ? styles.categoryButtonText : styles.selectedCategoryButtonText}>
                                Pet sitting
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryButton} onPress={() => this.setState({posterCategory: "Lost pet"})}>
                            <Text style={this.state.posterCategory !== "Lost pet" ? styles.categoryButtonText : styles.selectedCategoryButtonText}>
                                Lost pet
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryButton} onPress={() => this.setState({posterCategory: "Event"})}>
                            <Text style={this.state.posterCategory !== "Event" ? styles.categoryButtonText : styles.selectedCategoryButtonText}>
                                Event
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View> 

            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon name="navigation" size={24} style={{marginRight:30}}></Icon>
                <Button title="Add location" color={"black"} onPress={ this.pickImage }/>
            </View> 
        </View>
        )
    }


    uploadImage = async (source, imageName, callback) => {
        console.log('got image to upload. uri:' + source.uri);
        try {
            const response = await fetch(source.uri);
            const blob = await response.blob();
            const ref = firebase.storage().ref('PostImage').child(imageName);
            const task = ref.put(blob);

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
            },  error => console.log,
                callback) 

            // return new Promise((resolve, reject) => {
            //     task.on('state_changed',(snapshot) => {
            //         // Observe state change events such as progress, pause, and resume
            //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            //         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //         console.log('Upload is ' + progress + '% done');
            //         switch (snapshot.state) {
            //             case firebase.storage.TaskState.PAUSED: // or 'paused'
            //             console.log('Upload is paused');
            //             break;
            //             case firebase.storage.TaskState.RUNNING: // or 'running'
            //             console.log('Upload is running');
            //             break;
            //         }
            //         /* noop but you can track the progress here */
            //     },reject /* this is where you would put an error callback! */,
            //         () => resolve(task.snapshot.downloadURL)
            //     );
            // });
        } catch (err) {
            console.log('uploadImage try/catch error: ' + err.message); 
        }
    }
}

const styles = StyleSheet.create({
  posterSubject: {
    // height: 150,
    fontSize:20,
    paddingHorizontal:4,
    marginTop: 20,
    marginBottom: 20,
    fontWeight:"bold",
    alignItems:"flex-start"
  },
  postContent: {
    paddingHorizontal:4,
    fontSize:12,
    height:300 
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
    color: "#f99558"
  }
})


export default NewCommunityPost

