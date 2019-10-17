import React from 'react';
import {
  StyleSheet, Text,
  TextInput, View,
  Button,
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
        this.state={ imageSource: require('./circle.svg')}
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
            <View>
                <View style={{alignItems: 'center'}}>
                    <Image source={this.state.imageSource} style={styles.image}></Image>
                </View>
                <Button
                    title="Upload Image"
                    style={styles.buttonText}
                    onPress={ this.pickImage }
                />
                <Text style={styles.title}>Community Referral: </Text>
            
                <TextInput
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextReferral}
                    value={this.state.referral}
                />

                <Text style={styles.title}> {this.state.communityName} </Text>
                <Button
                    title="Confirm"
                    style={styles.buttonText}
                    onPress={ this.confirmButton }
                />
            </View>
        );
    }
}
  
const offset = 16;
const styles = StyleSheet.create({
    title: {
        marginTop: offset,
        marginLeft: offset,
        fontSize: offset,
    },
    nameInput: {
        height: offset * 3,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#111111',
        borderWidth: 1,
        fontSize: offset,
    },
    buttonText: {
        height: offset * 3,
        marginLeft: offset,
        fontSize: 42,
    },
    image: {
        width:100, 
        height:100,
        marginLeft: offset,
        marginTop: offset,
    }
});
  
export default Referral;
  