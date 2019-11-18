import React from 'react';
import {
  StyleSheet, Text,
  TextInput, View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import firebaseSvc from '../../FirebaseSvc';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Image',
    customButtons: [{ name: 'Pawesome', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class Referral extends React.Component {

    constructor(props){
        super(props)
        this.state={ imageSource: require("./camera.png")}
    }

    static navigationOptions = {
        title: 'Referral',
    };
  
    onChangeTextReferral = referral => {
        firebase.firestore().collection('Community').doc(referral || " ").get()
        .then(doc => {
            if (!doc.exists) {
                this.setState({ communityName:'' });
                console.log('No such Community!');
            } else {
                const {name} = doc.data();
                this.setState({ communityName:name });
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
        this.setState({ referral });
    }

    pickImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
          
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    imageSource: source,
                });
            }
        });
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

    confirmButton = async () => {
        if (this.state.referral == null){
            alert("Please fill referral code!")
            return
        }
        await firebaseSvc.updateReferral(this.state.referral);
        if (this.state.imageSource != null) {
            await this.uploadImage(this.state.imageSource);
            await firebase.storage().ref('UserImage').child(global.currentUser.id).getDownloadURL().then(function(url) {
                firebaseSvc.updateImage(url);
            }).catch(function(error) {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    
                }
            });
        }
        alert("Information submitted!")
        this.props.navigation.navigate("PetSittingPreferenceStart")
    }
  
    render() {
        return (
            <ScrollView style = {styles.viewStyle}>
                <View style={styles.columnBox1}>
                    <Text style={styles.servicesLabel}>Your Image:</Text>
                    <TouchableOpacity style={{alignItems: 'center',marginBottom:20, width:80, height:80,}} 
                        onPress={this.pickImage}>
                        <Image source={this.state.imageSource} style={styles.image}></Image>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.columnBox}>
                    <Text style={styles.servicesLabel}>Community Referral:</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={this.onChangeTextReferral}
                        value={this.state.referral}
                    />
                </View>
                <Text style={styles.servicesLabel}> {this.state.communityName} </Text>
                <View style={styles.columnBox}>
                    <Text style={styles.textContent}>
                        The referral code from another member of the community to join the app with full functionality.
                    </Text>
                    <Text style={styles.textContent}>
                        We are a neighborhood-based service, and we want to make our community safe and happy. Part of this is to make sure people you see here actually live in the neighborhood
                    </Text>
                    <TouchableOpacity style={styles.button} 
                        onPress={this.confirmButton}
                        >
                        <Text style = { styles.text}>
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
  
const offset = 16;
const styles = StyleSheet.create({
    image: {
        width:80, 
        height:80,
        borderColor:"grey",
        borderWidth:2,
        borderRadius:50,
        marginTop: offset,
    },
    viewStyle:{
        height:800,
        backgroundColor:"rgb(250,250,251)"
    },
    servicesLabel: {
        textAlign: 'center',
        fontWeight: "600",
        fontSize: 20,
        lineHeight: 24,
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d",
        margin:20,
    },
    textContent:{
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d",
        margin:10
    },
    inputField: {
        backgroundColor: "#ffffff",
        borderRadius: 8, 
        padding: 12,
        borderBottomColor:"#e5e3e2",
        borderBottomWidth:1,
        color:"#000"

    },
    button: {
        // width: "90%",
        height: 48,
        borderRadius: 6,
        backgroundColor: "#f99558",
        justifyContent: "center",
        alignItems: "center"
    },
    columnBox1:{
        flexDirection: "column", 
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        alignItems:"center",
    },
    columnBox:{
        flexDirection: "column", 
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },
    text:{
        textAlign: 'center',
        fontSize: 17,
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0,
        color: "white",
    },
});
  
export default Referral;
  