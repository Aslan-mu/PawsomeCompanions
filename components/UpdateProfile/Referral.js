import React from 'react';
import {
  StyleSheet, Text,
  TextInput, View,
  TouchableOpacity,
  Image,
} from 'react-native';

import firebaseSvc from '../../FirebaseSvc';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
        this.state={ imageSource: null}
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
        await this.uploadImage(this.state.imageSource);
        await firebaseSvc.updateReferral(this.state.referral);
        await firebase.storage().ref('UserImage').child(global.currentUser.id).getDownloadURL().then(function(url) {
            firebaseSvc.updateImage(url);
        }).catch(function(error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                
            }
        });
        this.props.navigation.navigate("PetSittingPreference")
    }
  
    render() {
        return (
            <View style = {styles.viewStyle}>
                <View style={{alignItems: 'center'}}>
                    <Image source={this.state.imageSource} style={styles.image}></Image>
                </View>
                <View style={styles.columnBox}>
                    <TouchableOpacity style={styles.button} 
                        onPress={this.pickImage}
                        >
                        <Text style = { styles.text}>
                            Upload Image
                        </Text>
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
                <View style={styles.columnBox}>
                    <Text style={styles.servicesLabel}> {this.state.communityName} </Text>
                </View>
                <View style={styles.columnBox}>
                    <TouchableOpacity style={styles.button} 
                        onPress={this.confirmButton}
                        >
                        <Text style = { styles.text}>
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
  
const offset = 16;
const styles = StyleSheet.create({
    image: {
        width:100, 
        height:100,
        backgroundColor:"grey",
        borderRadius:50,
        marginLeft: offset,
        marginTop: offset,
    },
    viewStyle:{
        height:800,
        backgroundColor:"rgb(250,250,251)"
    },
    servicesLabel: {
        // width: 60,
        height: 16,
        // fontFamily: "SFProText",
        fontSize: 12,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: 0,
        color: "#1a051d",
        marginBottom: 20
    },
    inputField: {
        backgroundColor: "#ffffff",
        borderRadius: 8, 
        padding: 12,

    },
    button: {
        // width: "90%",
        height: 48,
        borderRadius: 6,
        backgroundColor: "#f99558",
        justifyContent: "center",
        alignItems: "center"
    },
    columnBox:{
        flexDirection: "column", 
        margin: 20
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
  